/**
 * @file  led.c
 * @brief Non-blocking LED-strip state machine (spec §6, SW-02 feedback).
 */
#include "led.h"
#include "app_config.h"
#include "board_hal.h"

static led_pattern_t s_pattern = LED_OFF;
static uint32_t      s_phase_start;
static uint32_t      s_success_start;   /* for the bounded 2 s success burst */

void led_init(void)
{
    s_pattern = LED_OFF;
    hal_gpio_output(PIN_LED_STRIP, false);
}

void led_set(led_pattern_t pattern)
{
    if (pattern == s_pattern) return;
    s_pattern     = pattern;
    s_phase_start = hal_millis();
    if (pattern == LED_FLASH_SUCCESS)
        s_success_start = s_phase_start;
}

led_pattern_t led_get(void) { return s_pattern; }

static void drive(bool on) { hal_gpio_output(PIN_LED_STRIP, on); }

/* ON for on_ms, OFF for off_ms, repeating. */
static void duty(uint32_t now, uint32_t on_ms, uint32_t off_ms)
{
    uint32_t period = on_ms + off_ms;
    drive(((now - s_phase_start) % period) < on_ms);
}

void led_task(void)
{
    uint32_t now = hal_millis();

    switch (s_pattern) {
    case LED_OFF:
        drive(false);
        break;

    case LED_SOLID:                       /* pairing window open              */
        drive(true);
        break;

    case LED_MOVING:                      /* §6: 0.5 s ON / 1.0 s OFF          */
        duty(now, LED_MOVING_ON_MS, LED_MOVING_OFF_MS);
        break;

    case LED_FAULT:                       /* §6: 0.2 s ON / 0.2 s OFF          */
        duty(now, LED_FAULT_ON_MS, LED_FAULT_OFF_MS);
        break;

    case LED_FLASH_SUCCESS:               /* 2 s of fast flashing, then idle  */
        if (now - s_success_start >= BLE_SUCCESS_FLASH_MS) {
            led_set(LED_OFF);
            break;
        }
        drive(((now / 120u) & 1u) != 0);
        break;

    case LED_BLINK_SLOW:
        drive(((now - s_phase_start) % 2000u) < 100u); /* brief blip every 2 s */
        break;
    }
}
