/**
 * @file  rf_remote.c
 * @brief Rolling-code remote: decode -> authenticate -> replay-check ->
 *        action / gesture detection.
 */
#include "rf_remote.h"
#include "keeloq.h"
#include "remote_store.h"
#include "bollard.h"
#include "ble_security.h"
#include "led.h"
#include "app_config.h"
#include "board_hal.h"

static rf_remote_cb_t s_cb;
static bool           s_reset_armed;          /* SEC-01: RST held right now    */

/* --- middle-button gesture tracking ----------------------------------- */
static uint8_t   s_mid_count;                 /* presses inside the window     */
static uint32_t  s_mid_first_ms;              /* time of first press in window */
static uint32_t  s_mid_hold_start;            /* when current hold began       */
static bool      s_mid_holding;
static uint32_t  s_last_frame_ms;
static uint32_t  s_last_serial;
static uint16_t  s_last_counter;
static bool      s_toggle_fired;              /* one toggle per hold           */

/* --- replay / window validation --------------------------------------- */
typedef enum { CTR_REPEAT, CTR_NEW, CTR_REJECT } ctr_result_t;

static ctr_result_t check_counter(int idx, uint16_t rx)
{
    const remote_record_t *r = remote_store_get(idx);
    uint16_t stored = r ? r->sync_counter : 0;
    uint16_t diff   = (uint16_t)(rx - stored);

    if (stored == 0)                return CTR_NEW;            /* freshly learnt */
    if (diff == 0)                  return CTR_REPEAT;         /* button held    */
    if (diff <= KEELOQ_SINGLE_WINDOW) return CTR_NEW;          /* normal advance */
    if (diff <= KEELOQ_DOUBLE_WINDOW) return CTR_NEW;          /* resync window  */
    return CTR_REJECT;                                         /* replay / stale */
}

/* --- middle-button gesture engine ------------------------------------- */
static void middle_on_new_press(uint32_t now)
{
    if (s_mid_count == 0 || (now - s_mid_first_ms) > MIDDLE_TRIPLE_PRESS_MS) {
        s_mid_count    = 1;
        s_mid_first_ms = now;
    } else {
        s_mid_count++;
    }

    if (s_mid_count >= 3) {                    /* SW-02: triple fast press      */
        s_mid_count = 0;
        if (s_cb.on_pairing_window) s_cb.on_pairing_window();
    }

    /* Begin (or restart) hold tracking for the 10 s BLE toggle (RM-04).      */
    s_mid_hold_start = now;
    s_mid_holding    = true;
    s_toggle_fired   = false;
}

static void middle_on_repeat(uint32_t now)
{
    if (s_mid_holding && !s_toggle_fired &&
        (now - s_mid_hold_start) >= MIDDLE_HOLD_TOGGLE_MS) {
        s_toggle_fired = true;
        s_mid_count    = 0;                    /* a hold is not a triple press  */
        if (s_cb.on_ble_toggle) s_cb.on_ble_toggle();
    }
}

/* --- main frame handler ----------------------------------------------- */
static void on_frame(uint64_t raw, uint8_t nbits)
{
    int            idx = remote_store_find(keeloq_serial_of(raw));
    keeloq_frame_t f;
#if KEELOQ_SECURE_LEARNING
    /* Secure learning: a normal frame is only decodable with the fob's stored
     * device key, so unknown fobs can't be decoded here — they are learned via
     * rf_remote_learn_secure() from the fob's seed transmission.             */
    if (idx < 0 ||
        !keeloq_decode_with_key(raw, nbits, remote_store_get(idx)->device_key, &f))
        return;
#else
    if (!keeloq_decode(raw, nbits, &f)) return;   /* Normal learning           */
    idx = remote_store_find(f.serial);
#endif

    uint32_t now      = hal_millis();
    bool     is_repeat_tx = (f.serial == s_last_serial &&
                             f.counter == s_last_counter &&
                             (now - s_last_frame_ms) < 800u);

    bool     is_paired = (idx >= 0);
    bool     is_master = (f.serial == INSTALLER_MASTER_SERIAL);

    /* --- SEC-01/02/03: reset combo takes priority over everything --------- */
    if (s_reset_armed && !is_repeat_tx) {
        s_last_serial = f.serial; s_last_counter = f.counter; s_last_frame_ms = now;
        if (s_cb.on_reset_combo) s_cb.on_reset_combo(f.serial, is_paired, is_master);
        return;
    }

    /* --- RM-01: app-authorised learning of a brand-new fob ---------------- */
    if (!is_paired && ble_sec_remote_is_authorised(f.serial)) {
        if (f.disc_ok) {
            int ni = remote_store_add(f.serial, false);
            if (ni >= 0) {
                remote_store_update_counter(ni, f.counter);
                ble_sec_clear_authorisation();
                led_set(LED_FLASH_SUCCESS);
            }
        }
        s_last_serial = f.serial; s_last_counter = f.counter; s_last_frame_ms = now;
        return;
    }

    if (!is_paired) {                          /* SEC-02 spirit: ignore foreign */
        return;
    }

    /* --- replay protection ------------------------------------------------ */
    ctr_result_t cr = check_counter(idx, f.counter);
    if (cr == CTR_REJECT) {
        return;                                /* replay/stale: silently ignore  */
    }
    if (cr == CTR_NEW) remote_store_update_counter(idx, f.counter);

    s_last_serial = f.serial; s_last_counter = f.counter; s_last_frame_ms = now;

    /* --- act on the button ------------------------------------------------ */
    bool new_press = (cr == CTR_NEW) && !is_repeat_tx;

    if (f.buttons & FOB_BTN_MIDDLE) {
        if (new_press) {
            bollard_command(BOLLARD_STOP);     /* §9: middle button = STOP       */
            middle_on_new_press(now);          /* also feeds the BLE gestures:   */
        } else {                               /*   ×3 -> pairing, 10 s -> toggle */
            middle_on_repeat(now);
        }
        return;
    }

    /* A non-middle press cancels any half-finished middle gesture.           */
    s_mid_holding = false;
    s_mid_count   = 0;

    if (!new_press) return;                    /* only act on fresh presses     */

    if      (f.buttons & FOB_BTN_UP)   bollard_command(BOLLARD_UP);
    else if (f.buttons & FOB_BTN_DOWN) bollard_command(BOLLARD_DOWN);
    else if (f.buttons & FOB_BTN_STOP) bollard_command(BOLLARD_STOP);
}

/* --- public API -------------------------------------------------------- */
void rf_remote_init(const rf_remote_cb_t *cb)
{
    if (cb) s_cb = *cb;
    s_mid_count = 0; s_mid_holding = false; s_reset_armed = false;
    hal_rf_init(on_frame);
}

void rf_remote_set_reset_arming(bool armed) { s_reset_armed = armed; }

void rf_remote_learn_secure(uint32_t serial, uint32_t seed_lo, uint32_t seed_hi)
{
    serial &= 0x0FFFFFFFu;
    if (!ble_sec_remote_is_authorised(serial)) return;   /* RM-01: PIN-authorised */
    if (remote_store_find(serial) >= 0) return;          /* already paired        */
    int ni = remote_store_add(serial, false);
    if (ni < 0) return;
    remote_store_set_key(ni, keeloq_derive_key_secure(seed_lo, seed_hi));
    remote_store_update_counter(ni, 0);
    ble_sec_clear_authorisation();
    led_set(LED_FLASH_SUCCESS);
}

void rf_remote_task(void)
{
    /* If a held middle button stops repeating, end the hold cleanly.         */
    if (s_mid_holding && (hal_millis() - s_last_frame_ms) > 800u)
        s_mid_holding = false;
}
