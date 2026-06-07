/**
 * @file  reset_mgr.c
 * @brief Physical RST-button logic (SEC-01..04).
 */
#include "reset_mgr.h"
#include "rf_remote.h"
#include "ble_security.h"
#include "remote_store.h"
#include "events.h"
#include "led.h"
#include "app_config.h"
#include "board_hal.h"

static bool     s_pressed;
static uint32_t s_press_start;
static bool     s_clear_fired;         /* §3 wipe-all-fobs once per hold        */
static bool     s_emergency_fired;     /* SEC-04 once per hold                  */

void reset_mgr_init(void)
{
    s_pressed = false;
    s_clear_fired = false;
    s_emergency_fired = false;
}

void reset_mgr_task(void)
{
    bool now_pressed = hal_gpio_read(PIN_RST_BUTTON);   /* HAL maps active-low  */
    uint32_t now = hal_millis();

    if (now_pressed && !s_pressed) {
        /* Button just went down: arm the fob reset combo (SEC-01). While held,
         * the central LED owner shows the rapid "service mode" flash.         */
        s_pressed         = true;
        s_press_start     = now;
        s_clear_fired     = false;
        s_emergency_fired = false;
        rf_remote_set_reset_arming(true);
        events_post_tamper(TAMPER_ENCLOSURE_RST);   /* box opened / RST pressed  */
    }
    else if (now_pressed && s_pressed) {
        uint32_t held = now - s_press_start;

        /* §3: held alone for 5 s -> wipe all paired fobs.                     */
        if (!s_clear_fired && held >= RST_CLEAR_REMOTES_MS) {
            s_clear_fired = true;
            remote_store_clear_all();
            led_set(LED_FLASH_SUCCESS);     /* confirm the wipe                 */
        }

        /* §8.3 lost-remote override: held alone 10 s -> force Bluetooth ON and
         * open the pairing window, so the app can re-link and authorise a new
         * remote even when all fobs are lost and BLE had been switched off.   */
        if (!s_emergency_fired && held >= RST_EMERGENCY_HOLD_MS) {
            s_emergency_fired = true;
            ble_sec_set_enabled(true);
            ble_sec_open_pairing_window();
            led_set(LED_FLASH_SUCCESS);
        }
    }
    else if (!now_pressed && s_pressed) {
        /* Released: disarm the combo window.                                  */
        s_pressed = false;
        rf_remote_set_reset_arming(false);
    }
}

bool reset_mgr_service_active(void) { return s_pressed; }

void reset_mgr_on_fob_during_hold(uint32_t serial, bool is_paired, bool is_master)
{
    (void)serial;
    if (is_master || is_paired) {
        /* SEC-01 (paired fob) / SEC-03 (installer master): allow PIN reset.
         * Reverting to the default PIN also sets is_initialized = 0 inside
         * ble_sec_reset_pin_to_default().                                     */
        ble_sec_reset_pin_to_default();
        led_set(LED_FLASH_SUCCESS);
    }
    /* SEC-02: an unpaired (neighbour / thief) fob is silently rejected —
     * the existing PIN block is maintained and nothing changes.              */
}
