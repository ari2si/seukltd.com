/**
 * @file  app_main.c
 * @brief Application entry point: wires the modules to the Tuya BLE SDK,
 *        implements the DP (data-point) protocol the Tuya app talks to, owns
 *        the LED arbitration, and runs the cooperative main loop.
 *
 * Requirement traceability is noted inline as [spec §x / HW-/SW-/RM-/SEC-xx].
 */
#include "app_config.h"
#include "board_hal.h"
#include "led.h"
#include "bollard.h"
#include "rf_remote.h"
#include "remote_store.h"
#include "ble_security.h"
#include "reset_mgr.h"
#include "battery.h"
#include "power_mgr.h"
#include "events.h"

#include <string.h>

/* Tuya SDK headers (platform build):
 *   #include "tuya_ble_api.h"
 *   #include "tuya_ble_type.h"
 */

/* ----------------------------------------------------------------------- */
/*  DP (data-point) IDs  — must match the product definition on iot.tuya.com */
/*  See docs/tuya_dp_protocol.md for the full table.                        */
/* ----------------------------------------------------------------------- */
#define DP_BOLLARD_CTRL     1     /* enum  : 0 stop / 1 up / 2 down          */
#define DP_BLE_SWITCH       101   /* bool  : RM-04 master BLE on/off          */
#define DP_CHANGE_PIN       102   /* string: "OLDPIN,NEWPIN"  (SW-03)         */
#define DP_VERIFY_PIN       103   /* string: "PIN"   gate for management      */
#define DP_ADD_REMOTE       104   /* bool  : RM-01 open learn window (needs PIN)*/
#define DP_REMOVE_REMOTE    105   /* value : serial of fob to remove          */
#define DP_REMOTE_COUNT     106   /* value : report number of paired fobs     */
#define DP_DEVICE_INFO      107   /* string: report MAC / serial (SW-04)      */
#define DP_PIN_IS_DEFAULT   108   /* bool  : report SW-03 force-change flag    */
#define DP_BOLLARD_STATUS   109   /* enum  : real-time state (spec §9)        */
#define DP_BATTERY_PCT      110   /* value : 0..100 SoC (spec §7)             */
#define DP_BATTERY_STATE    111   /* enum  : 0 ok / 1 low / 2 lockout (§7)    */
#define DP_PIN_LOCKED       112   /* bool  : PIN locked (brute-force defence) */
#define DP_TAMPER           113   /* enum  : 1 forced push-down / 2 enclosure */

/* RM-01: management DPs are unlocked only after a correct PIN this session.  */
static bool     s_session_pin_ok;
static bool     s_app_connected;     /* §2: an app link is currently open       */
static uint32_t s_connect_ms;        /* §2: when it connected (PIN-auth timeout) */

/* ----------------------------------------------------------------------- */
/*  RM-03 factory pre-pairing  >>> FACTORY: program these 2 fob serials <<<  */
/* ----------------------------------------------------------------------- */
static const uint32_t k_factory_fobs[FACTORY_PREPAIR_COUNT] = {
    0x00000000u,   /* fob #1 28-bit serial */
    0x00000000u,   /* fob #2 28-bit serial */
};

static void factory_prepair_if_blank(void)
{
    if (remote_store_count() != 0) return;        /* already provisioned       */
    for (int i = 0; i < FACTORY_PREPAIR_COUNT; i++)
        if (k_factory_fobs[i] != 0)
            remote_store_add(k_factory_fobs[i], true);
}

/* ----------------------------------------------------------------------- */
/*  DP report helpers                                                       */
/* ----------------------------------------------------------------------- */
static void dp_report_value(uint8_t dp_id, uint32_t v)
{
    uint8_t buf[8];
    buf[0] = dp_id; buf[1] = 0x02 /*value*/; buf[2] = 0; buf[3] = 4;
    buf[4] = (v >> 24); buf[5] = (v >> 16); buf[6] = (v >> 8); buf[7] = v;
    /* >>> FACTORY: tuya_ble_dp_data_report(buf, sizeof(buf)); */
    (void)buf;
}

static void dp_report_enum(uint8_t dp_id, uint8_t v)
{
    uint8_t buf[5] = { dp_id, 0x04 /*enum*/, 0, 1, v };
    /* >>> FACTORY: tuya_ble_dp_data_report(buf, sizeof(buf)); */
    (void)buf;
}

static void dp_report_bool(uint8_t dp_id, bool b)
{
    uint8_t buf[5] = { dp_id, 0x01 /*bool*/, 0, 1, (uint8_t)(b ? 1 : 0) };
    /* >>> FACTORY: tuya_ble_dp_data_report(buf, sizeof(buf)); */
    (void)buf;
}

static void dp_report_string(uint8_t dp_id, const char *s)
{
    uint8_t buf[64];
    uint16_t n = (uint16_t)strlen(s); if (n > 59) n = 59;
    buf[0] = dp_id; buf[1] = 0x03 /*string*/; buf[2] = (n >> 8); buf[3] = (n & 0xFF);
    memcpy(&buf[4], s, n);
    /* >>> FACTORY: tuya_ble_dp_data_report(buf, 4 + n); */
    (void)buf;
}

static void report_battery(void)            /* spec §7                          */
{
    dp_report_value(DP_BATTERY_PCT, battery_soc_percent());
    dp_report_enum(DP_BATTERY_STATE, (uint8_t)battery_state());
}

static void report_status_snapshot(void)
{
    char info[40];
    hal_get_serial(info, sizeof(info));
    dp_report_string(DP_DEVICE_INFO, info);          /* SW-04                   */
    dp_report_bool(DP_PIN_IS_DEFAULT, ble_sec_pin_is_default());
    dp_report_bool(DP_BLE_SWITCH, ble_sec_is_enabled());
    dp_report_value(DP_REMOTE_COUNT, (uint32_t)remote_store_count());
    dp_report_enum(DP_BOLLARD_STATUS, (uint8_t)bollard_status());
    dp_report_bool(DP_PIN_LOCKED, ble_sec_pin_locked());
    report_battery();
}

/* ----------------------------------------------------------------------- */
/*  DP command handler — called from the Tuya SDK DP-received callback       */
/*  payload layout: [dp_id][type][len_hi][len_lo][data...]                  */
/* ----------------------------------------------------------------------- */
static void handle_dp(const uint8_t *p, uint16_t len)
{
    if (len < 4) return;
    uint8_t  id   = p[0];
    uint16_t dlen = ((uint16_t)p[2] << 8) | p[3];
    const uint8_t *d = &p[4];
    if ((uint16_t)(dlen + 4) > len) return;

    power_mgr_notify_activity();          /* any app traffic keeps us awake §7  */

    /* Item #3: the PIN must only travel over a Tuya secure (encrypted) session.
     * Refuse PIN exchange — and drop the link — on an unencrypted connection.  */
#if REQUIRE_ENCRYPTED_LINK
    if ((id == DP_VERIFY_PIN || id == DP_CHANGE_PIN) && !hal_ble_link_is_encrypted()) {
        hal_ble_disconnect();
        return;
    }
#endif

    /* SW-03 hard gate: while the PIN is still the factory default
     * (is_initialized == 0), the only thing the app may do is change the PIN. */
    bool default_pin = ble_sec_pin_is_default();

    switch (id) {

    case DP_CHANGE_PIN: {                                   /* SW-03 / §2      */
        char tmp[16]; uint16_t n = dlen < 15 ? dlen : 15;
        memcpy(tmp, d, n); tmp[n] = '\0';
        char *comma = strchr(tmp, ',');
        if (comma) {
            *comma = '\0';
            if (ble_sec_change_pin(tmp, comma + 1)) {       /* sets is_initialized=1 */
                s_session_pin_ok = true;
                dp_report_bool(DP_PIN_IS_DEFAULT, ble_sec_pin_is_default());
            }
        }
        break;
    }

    case DP_VERIFY_PIN: {                                   /* RM-01 gate / §2 */
        if (ble_sec_pin_locked()) {        /* brute-force lockout active        */
            dp_report_bool(DP_PIN_LOCKED, true);
            hal_ble_disconnect();
            break;
        }
        char tmp[16]; uint16_t n = dlen < 15 ? dlen : 15;
        memcpy(tmp, d, n); tmp[n] = '\0';
        s_session_pin_ok = ble_sec_verify_pin(tmp);
        if (!s_session_pin_ok) {
            dp_report_bool(DP_PIN_LOCKED, ble_sec_pin_locked());
            hal_ble_disconnect();          /* §2: wrong PIN -> drop the link    */
        }
        break;
    }

    case DP_BLE_SWITCH:                                     /* RM-04 (app)     */
        if (default_pin || !s_session_pin_ok) break;
        ble_sec_set_enabled(dlen >= 1 && d[0] != 0);
        dp_report_bool(DP_BLE_SWITCH, ble_sec_is_enabled());
        break;

    case DP_ADD_REMOTE:                                     /* RM-01 / §3      */
        if (default_pin || !s_session_pin_ok) break;
        /* Open a learn window; serial 0 => accept the next NEW fob pressed.    */
        ble_sec_authorise_remote(0, 30000u);
        break;

    case DP_REMOVE_REMOTE: {                               /* RM-02 / §3      */
        if (default_pin || !s_session_pin_ok) break;
        if (dlen >= 4) {
            uint32_t serial = ((uint32_t)d[0] << 24) | ((uint32_t)d[1] << 16) |
                              ((uint32_t)d[2] << 8)  | d[3];
            remote_store_remove(serial);
            dp_report_value(DP_REMOTE_COUNT, (uint32_t)remote_store_count());
        }
        break;
    }

    case DP_BOLLARD_CTRL:                                   /* §4/§9 control   */
        if (default_pin) break;          /* SW-03: no control on default PIN    */
        /* §9.5 / §2: every command requires a validated PIN this session. An
         * un-authenticated control attempt drops the link instantly (§2).      */
        if (!s_session_pin_ok) { hal_ble_disconnect(); break; }
        if (dlen >= 1) {
            if      (d[0] == 1) bollard_command(BOLLARD_UP);
            else if (d[0] == 2) bollard_command(BOLLARD_DOWN);
            else                bollard_command(BOLLARD_STOP);
        }
        break;

    default:
        break;
    }
}

/* ----------------------------------------------------------------------- */
/*  RF gesture callbacks                                                    */
/* ----------------------------------------------------------------------- */
static void on_pairing_window(void)        /* SW-02 triple middle-press        */
{
    power_mgr_notify_activity();
    ble_sec_open_pairing_window();
}

static void on_ble_toggle(void)            /* RM-04 10 s middle hold           */
{
    ble_sec_toggle();
    led_set(LED_FLASH_SUCCESS);
}

static void on_reset_combo(uint32_t serial, bool is_paired, bool is_master)
{
    reset_mgr_on_fob_during_hold(serial, is_paired, is_master);  /* SEC-01/02/03 */
}

/* ----------------------------------------------------------------------- */
/*  Tuya SDK connection callback (called from the SDK event handler)        */
/* ----------------------------------------------------------------------- */
void app_on_ble_connected(void)
{
    power_mgr_notify_activity();
    s_session_pin_ok = false;            /* RM-01: must re-verify each session  */
    s_app_connected  = true;
    s_connect_ms     = hal_millis();     /* §2: start the PIN-auth timeout       */
    ble_sec_on_connected();              /* SW-02 success flash                 */
    report_status_snapshot();            /* SW-04 + §7/§9 state to the app      */
}

void app_on_ble_disconnected(void)
{
    s_session_pin_ok = false;
    s_app_connected  = false;
    ble_sec_on_disconnected();
}

/* The Tuya SDK calls this from its callback queue on DP_DATA_RECEIVED.       */
void app_on_dp_received(const uint8_t *data, uint16_t len)
{
    handle_dp(data, len);
}

/* ----------------------------------------------------------------------- */
/*  Central LED arbitration (spec §6) — single owner avoids module fights.   */
/*  Priority: success-burst > service-mode > moving > pairing/learn > fault. */
/* ----------------------------------------------------------------------- */
static void app_update_led(void)
{
    if (led_get() == LED_FLASH_SUCCESS) return;      /* let the 2 s burst run   */

    led_pattern_t want;
    if (reset_mgr_service_active())                   want = LED_FAULT;   /* svc  */
    else if (bollard_is_moving())                     want = LED_MOVING;  /* §6   */
    else if (ble_sec_pairing_window_open() ||
             ble_sec_learn_window_open())             want = LED_SOLID;   /* §6   */
    else if (battery_state() != BATT_OK)              want = LED_FAULT;   /* §6/§7*/
    else                                              want = LED_OFF;

    led_set(want);
}

/* Push status / battery DPs only when they change (keeps BLE traffic light). */
static void app_publish_changes(void)
{
    if (bollard_status_changed())
        dp_report_enum(DP_BOLLARD_STATUS, (uint8_t)bollard_status());
    if (battery_state_changed())
        report_battery();                            /* §7 app alert            */

    uint8_t reason;
    if (events_get_tamper(&reason))                  /* intrusion / anti-tamper */
        dp_report_enum(DP_TAMPER, reason);
}

/* ----------------------------------------------------------------------- */
/*  Init + main loop                                                        */
/* ----------------------------------------------------------------------- */
static void app_init(void)
{
    hal_gpio_init();
    events_init();
    led_init();
    battery_init();
    bollard_init();
    remote_store_init();
    ble_sec_init();
    reset_mgr_init();
    power_mgr_init();

    factory_prepair_if_blank();          /* RM-03                               */

    rf_remote_cb_t cb = {
        .on_pairing_window = on_pairing_window,
        .on_ble_toggle     = on_ble_toggle,
        .on_reset_combo    = on_reset_combo,
    };
    rf_remote_init(&cb);

    /* >>> FACTORY: tuya_ble_sdk_init() with TUYA_DEVICE_PID etc., register the
     * callback queue, and route its events to:
     *     app_on_ble_connected() / app_on_ble_disconnected()
     *     app_on_dp_received(dp_buf, dp_len)
     * Keep advertising OFF at boot (SW-01); it is only enabled by
     * ble_sec_open_pairing_window().                                          */
}

static void app_loop_once(void)
{
    bollard_task();
    rf_remote_task();
    reset_mgr_task();
    ble_sec_task();
    battery_task();

    /* §2: a connection that does not authenticate with the saved custom PIN
     * within the timeout is dropped.                                          */
    if (s_app_connected && ble_sec_is_initialized() && !s_session_pin_ok &&
        (hal_millis() - s_connect_ms) >= APP_AUTH_TIMEOUT_MS) {
        hal_ble_disconnect();
        s_app_connected = false;
    }

    app_publish_changes();
    app_update_led();
    led_task();

    /* Stay awake whenever the user is actively engaged.                      */
    power_mgr_inhibit_sleep(ble_sec_pairing_window_open() ||
                            ble_sec_learn_window_open() ||
                            reset_mgr_service_active());
    power_mgr_task();

    /* >>> FACTORY: tuya_ble_main_tasks();  (pump the SDK event queue)         */
}

/* On most Tuya SoC builds the SDK owns main(); call app_init() from the
 * user-init hook and app_loop_once() from the user main-loop hook. The plain
 * main() below is what a bare-metal / simulator build would use.             */
int app_main(void)
{
    app_init();
    for (;;) app_loop_once();
    /* not reached */
}
