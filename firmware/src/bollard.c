/**
 * @file  bollard.c
 * @brief Actuator state machine (spec §4 limits, §5 obstruction, §7 lockout).
 *
 * Safety rules:
 *   - UP and DOWN relays are never energised together (interlock).
 *   - Reversing inserts BOLLARD_DIR_DEADTIME_MS with both off.
 *   - A stroke-limit microswitch stops travel, then a 1 s padding delay runs
 *     before the relay is de-energised (§4).
 *   - During UP travel, motor current > 3 A (±0.3 A) for > 1 s triggers an
 *     obstruction: cut UP, pause 500 ms, then drive DOWN to release (§5).
 *   - UP is refused when the battery is in lockout (§7).
 */
#include "bollard.h"
#include "battery.h"
#include "events.h"
#include "app_config.h"
#include "board_hal.h"

/* Internal phases of the machine. */
typedef enum {
    PH_IDLE = 0,
    PH_DEADTIME,     /* both relays off, waiting before energising            */
    PH_UP,
    PH_DOWN,
    PH_LIMIT_PAD,    /* limit hit; 1 s padding before de-energise             */
    PH_OBSTR_PAUSE,  /* 500 ms gap before auto-retract                        */
} phase_t;

static phase_t          s_phase;
static bollard_cmd_t    s_pending;       /* direction to apply after deadtime  */
static bollard_status_t s_status;
static bollard_status_t s_last_reported;
static bool             s_obstructing;   /* current DOWN move is a retract     */

static uint32_t s_phase_t0;              /* timestamp the phase began          */
static uint32_t s_move_t0;              /* timestamp motion began             */
static uint32_t s_overcurrent_t0;        /* when current first exceeded limit  */
static bool     s_overcurrent;
static uint32_t s_batt_sample_t;         /* next under-load battery sample      */

/* ---- low level -------------------------------------------------------- */
static void relays(bool up, bool down)
{
    hal_gpio_output(PIN_RELAY_UP,   up);
    hal_gpio_output(PIN_RELAY_DOWN, down);
}

static bool limit_up_hit(void)   { return hal_gpio_read(PIN_LIMIT_UP);   }
static bool limit_down_hit(void) { return hal_gpio_read(PIN_LIMIT_DOWN); }

static void set_status(bollard_status_t st) { s_status = st; }

/* ---- public API ------------------------------------------------------- */
void bollard_init(void)
{
    relays(false, false);
    s_phase       = PH_IDLE;
    s_pending     = BOLLARD_STOP;
    s_obstructing = false;
    s_overcurrent = false;
    s_status = s_last_reported =
        limit_up_hit() ? BST_RAISED : (limit_down_hit() ? BST_LOWERED : BST_STOPPED);
}

void bollard_command(bollard_cmd_t cmd)
{
    if (cmd == BOLLARD_STOP) {
        relays(false, false);
        s_phase = PH_IDLE;
        s_pending = BOLLARD_STOP;
        s_obstructing = false;
        set_status(limit_up_hit() ? BST_RAISED :
                   limit_down_hit() ? BST_LOWERED : BST_STOPPED);
        return;
    }

    if (cmd == BOLLARD_UP) {
        if (!battery_up_allowed()) {        /* §7 lockout                      */
            relays(false, false);
            s_phase = PH_IDLE;
            set_status(BST_LOCKED);
            return;
        }
        if (limit_up_hit()) { set_status(BST_RAISED); return; }   /* already up */
    } else { /* DOWN */
        if (limit_down_hit()) { set_status(BST_LOWERED); return; }/* already dn */
    }

    /* Start (or reverse) via the dead-time phase.                            */
    relays(false, false);
    s_obstructing = false;
    s_pending     = cmd;
    s_phase       = PH_DEADTIME;
    s_phase_t0    = hal_millis();
}

bollard_status_t bollard_status(void) { return s_status; }

bool bollard_is_moving(void)
{
    return s_phase == PH_UP || s_phase == PH_DOWN;
}

bool bollard_status_changed(void)
{
    if (s_status != s_last_reported) { s_last_reported = s_status; return true; }
    return false;
}

/* ---- helpers ---------------------------------------------------------- */
static void begin_move(bollard_cmd_t dir)
{
    uint32_t now = hal_millis();
    relays(dir == BOLLARD_UP, dir == BOLLARD_DOWN);
    s_phase    = (dir == BOLLARD_UP) ? PH_UP : PH_DOWN;
    set_status(s_obstructing ? BST_OBSTRUCTED :
               (dir == BOLLARD_UP) ? BST_RISING : BST_LOWERING);
    s_move_t0        = now;
    s_phase_t0       = now;
    s_overcurrent    = false;
    s_batt_sample_t  = now + 300u;          /* first under-load read soon       */
}

static void enter_limit_pad(bollard_status_t final_state)
{
    /* §4: leave the relay energised for a 1 s padding before cutting it.      */
    s_phase    = PH_LIMIT_PAD;
    s_phase_t0 = hal_millis();
    set_status(final_state);                /* report final position now        */
}

/* §5 obstruction monitor — only on the way up. */
static bool obstruction_tripped(uint32_t now)
{
#if OBSTRUCT_DETECT_ON_UP_ONLY
    if (s_phase != PH_UP || s_obstructing) return false;
#endif
    uint16_t ma = hal_motor_current_ma();
    uint16_t trip = OBSTRUCT_CURRENT_MA + OBSTRUCT_TOLERANCE_MA;

    if (ma >= trip) {
        if (!s_overcurrent) { s_overcurrent = true; s_overcurrent_t0 = now; }
        else if ((now - s_overcurrent_t0) >= OBSTRUCT_DEBOUNCE_MS) return true;
    } else {
        s_overcurrent = false;              /* dropped below — reset the timer  */
    }
    return false;
}

/* ---- main task -------------------------------------------------------- */
void bollard_task(void)
{
    uint32_t now = hal_millis();

    switch (s_phase) {

    case PH_IDLE:
#if ANTI_TAMPER_RESTORE
        /* §8 anti-tamper: at rest UP with relays open, if the upper limit has
         * been forced open (manual push-down) re-drive UP to relock. The open
         * edge is what woke us from deep sleep.                               */
        if (s_status == BST_RAISED && !limit_up_hit() && battery_up_allowed()) {
            s_obstructing = false;
            events_post_tamper(TAMPER_FORCED_PUSHDOWN);   /* notify the app      */
            begin_move(BOLLARD_UP);
        }
#endif
        break;

    case PH_OBSTR_PAUSE:
        if ((now - s_phase_t0) >= OBSTRUCT_REVERSE_PAUSE_MS) {
            s_obstructing = true;           /* §5: auto-retract downward        */
            begin_move(BOLLARD_DOWN);
        }
        break;

    case PH_DEADTIME:
        if ((now - s_phase_t0) >= BOLLARD_DIR_DEADTIME_MS)
            begin_move(s_pending);
        break;

    case PH_UP:
        /* under-load battery sampling (§7) */
        if ((int32_t)(now - s_batt_sample_t) >= 0) {
            battery_sample_under_load();
            s_batt_sample_t = now + 500u;
        }
        if (limit_up_hit())               { enter_limit_pad(BST_RAISED); break; }
        if (obstruction_tripped(now)) {     /* §5                              */
            relays(false, false);
            set_status(BST_OBSTRUCTED);
            s_phase = PH_OBSTR_PAUSE;
            s_phase_t0 = now;
            break;
        }
        if ((now - s_move_t0) >= BOLLARD_TRAVEL_TIMEOUT_MS) {
            relays(false, false); s_phase = PH_IDLE; set_status(BST_STOPPED);
        }
        break;

    case PH_DOWN:
        if ((int32_t)(now - s_batt_sample_t) >= 0) {
            battery_sample_under_load();
            s_batt_sample_t = now + 500u;
        }
        if (limit_down_hit()) {
            enter_limit_pad(BST_LOWERED);
            s_obstructing = false;          /* retract finished                 */
            break;
        }
        if ((now - s_move_t0) >= BOLLARD_TRAVEL_TIMEOUT_MS) {
            relays(false, false); s_phase = PH_IDLE; set_status(BST_STOPPED);
        }
        break;

    case PH_LIMIT_PAD:                       /* §4: 1 s padding then de-energise */
        if ((now - s_phase_t0) >= BOLLARD_LIMIT_STOP_DELAY_MS) {
            relays(false, false);
            s_phase = PH_IDLE;
        }
        break;
    }
}
