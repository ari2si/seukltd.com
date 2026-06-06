/**
 * @file  board_hal.c
 * @brief Porting layer for the Tuya BT3L SoC.  >>> FACTORY: fill the bodies <<<
 *
 * Each function below maps onto the chip-specific build of tuya_ble_sdk
 * (Telink TLSR825x / Beken / Realtek). The stubs are written so the rest of
 * the firmware compiles and the integration points are unambiguous.
 */
#include "board_hal.h"
#include "app_config.h"

/* The SDK headers differ per platform; include the right ones here, e.g.:
 *   #include "tuya_ble_api.h"
 *   #include "tuya_ble_port.h"
 *   #include "gpio.h"  / "drv_gpio.h" / ...
 */

/* ----------------------------------------------------------------------- */
/*  Time                                                                    */
/* ----------------------------------------------------------------------- */
uint32_t hal_millis(void)
{
    /* >>> FACTORY: return a monotonic millisecond tick.
     * On Tuya BLE SDK use the app timer / clock_time() converted to ms.     */
    return 0;
}

/* ----------------------------------------------------------------------- */
/*  GPIO                                                                    */
/* ----------------------------------------------------------------------- */
void hal_gpio_init(void)
{
    /* >>> FACTORY: configure PIN_RELAY_UP/DOWN, PIN_LED_STRIP as outputs;
     * PIN_RST_BUTTON as input w/ pull-up; PIN_RF_DATA per receiver type.    */
}

void hal_gpio_output(uint8_t pin, bool active)
{
    /* Translate logical "active" into the right electrical level.           */
    bool level = active;
    if (pin == PIN_LED_STRIP)  level = LED_ACTIVE_HIGH   ? active : !active;
    else                       level = RELAY_ACTIVE_HIGH ? active : !active;
    (void)level;
    /* >>> FACTORY: drv_gpio_write(pin, level); */
}

bool hal_gpio_read(uint8_t pin)
{
    /* >>> FACTORY: raw = drv_gpio_read(pin); */
    bool raw = false;

    /* Return a logical "active/pressed/actuated = true" regardless of wiring. */
    if (pin == PIN_RST_BUTTON && RST_BUTTON_ACTIVE_LOW)
        return !raw;
    if ((pin == PIN_LIMIT_UP || pin == PIN_LIMIT_DOWN) && LIMIT_SWITCH_ACTIVE_LOW)
        return !raw;
    return raw;
}

/* ----------------------------------------------------------------------- */
/*  Non-volatile key/value storage                                         */
/* ----------------------------------------------------------------------- */
bool hal_nv_read(uint16_t key, void *buf, uint16_t len)
{
    (void)key; (void)buf; (void)len;
    /* >>> FACTORY: tuya_ble_nv_read() / flash KV read. Return false if absent.*/
    return false;
}

bool hal_nv_write(uint16_t key, const void *buf, uint16_t len)
{
    (void)key; (void)buf; (void)len;
    /* >>> FACTORY: tuya_ble_nv_write() / flash KV write.                     */
    return false;
}

/* ----------------------------------------------------------------------- */
/*  Identity                                                                */
/* ----------------------------------------------------------------------- */
void hal_get_mac(uint8_t mac[6])
{
    /* >>> FACTORY: tuya_ble_gap_addr_get() or platform MAC API.             */
    for (int i = 0; i < 6; i++) mac[i] = 0;
}

void hal_get_serial(char *out, uint16_t out_len)
{
    /* >>> FACTORY: copy the production S/N (e.g. YPT0020806816GA).           */
    if (out_len) out[0] = '\0';
}

/* ----------------------------------------------------------------------- */
/*  BLE control                                                             */
/* ----------------------------------------------------------------------- */
void hal_ble_adv_start(uint32_t window_ms)
{
    (void)window_ms;
    /* >>> FACTORY: enable advertising; arm a timer to auto-stop after the
     * window. On Tuya SDK: tuya_ble_gap_advertising_start() + app timer.     */
}

void hal_ble_adv_stop(void)        { /* tuya_ble_gap_advertising_stop();   */ }
void hal_ble_disconnect(void)      { /* tuya_ble_gap_disconnect();         */ }

void hal_ble_set_scan_rsp_name(const char *name)
{
    (void)name;
    /* >>> FACTORY: set the advertising / scan-response name so the Tuya app
     * shows the MAC or S/N (SW-04). tuya_ble_gap_scan_rsp_data_set().        */
}

/* ----------------------------------------------------------------------- */
/*  RF receiver                                                             */
/* ----------------------------------------------------------------------- */
void hal_rf_init(hal_rf_frame_cb_t cb)
{
    (void)cb;
    /* >>> FACTORY: set up the 433 MHz receiver capture (timer-capture ISR on
     * PIN_RF_DATA, or UART/SPI from a decoder IC). On a complete KeeLoq frame
     * call cb(raw_frame, nbits) from outside interrupt context.             */
}

/* ----------------------------------------------------------------------- */
/*  ADC                                                                     */
/* ----------------------------------------------------------------------- */
uint16_t hal_adc_read_mv(uint8_t channel)
{
    (void)channel;
    /* >>> FACTORY: read the SoC ADC, apply the divider/amplifier gain, and
     * return millivolts. For ADC_CH_BATTERY return the real pack voltage in
     * mV; for ADC_CH_MOTOR_CURRENT return the shunt-amplifier output in mV.  */
    return 0;
}

uint16_t hal_motor_current_ma(void)
{
    /* >>> FACTORY: convert the shunt reading to milliamps:
     *   I(mA) = Vshunt(mV) / (Rshunt(ohm) * Gain). Implement with integer
     * math against your real shunt + amplifier values.                      */
    return 0;
}

/* ----------------------------------------------------------------------- */
/*  Power management                                                        */
/* ----------------------------------------------------------------------- */
void hal_configure_wake_sources(void)
{
    /* >>> FACTORY: configure as deep-sleep wake sources:
     *   - PIN_RF_INT          (a >=1 s remote press)               §7
     *   - the BLE controller  (an app connection handshake)        §7
     *   - PIN_LIMIT_UP edge   (upper microswitch OPENs = tamper)   §8
     * On the Tuya SDK this uses the low-power / pin-wake API so the CPU
     * resumes within WAKE_LATENCY_MAX_MS.                                   */
}

void hal_enter_deep_sleep(void)
{
    /* >>> FACTORY: place peripherals in retention and request the SoC's
     * deepest sleep that keeps the configured wake interrupts armed
     * (target <= 0.2 mA). Tuya SDK: tuya_ble_sleep_allowed / platform PM.   */
}
