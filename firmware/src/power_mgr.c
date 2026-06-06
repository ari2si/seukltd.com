/**
 * @file  power_mgr.c
 * @brief Deep-sleep scheduler (spec §7).
 */
#include "power_mgr.h"
#include "bollard.h"
#include "app_config.h"
#include "board_hal.h"

static uint32_t s_last_activity;
static bool     s_inhibit;

void power_mgr_init(void)
{
    s_last_activity = hal_millis();
    s_inhibit = false;
    hal_configure_wake_sources();          /* RF INT + BLE wake (§7)           */
}

void power_mgr_notify_activity(void) { s_last_activity = hal_millis(); }

void power_mgr_inhibit_sleep(bool inhibit) { s_inhibit = inhibit; }

void power_mgr_task(void)
{
    uint32_t now = hal_millis();

    /* Anything happening keeps us awake and pushes the idle deadline out.     */
    if (bollard_is_moving() || s_inhibit) {
        s_last_activity = now;
        return;
    }

    if ((now - s_last_activity) >= DEEP_SLEEP_IDLE_MS) {
        /* §7: enter deep sleep. The HAL returns once a wake INT fires; treat
         * that as fresh activity so we stay up long enough to service it.     */
        hal_enter_deep_sleep();
        s_last_activity = hal_millis();
    }
}
