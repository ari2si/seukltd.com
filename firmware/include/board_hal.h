/**
 * @file    board_hal.h
 * @brief   Thin hardware-abstraction layer over the Tuya BT3L SoC SDK.
 *
 * These functions isolate the application logic from the exact chip platform
 * (Telink / Beken / Realtek build of tuya_ble_sdk). The factory implements
 * the bodies in board_hal.c using the SDK's GPIO / timer / flash APIs.
 */
#ifndef BOARD_HAL_H
#define BOARD_HAL_H

#include <stdint.h>
#include <stdbool.h>

/* ---- time ------------------------------------------------------------- */
uint32_t hal_millis(void);                 /* monotonic ms since boot       */

/* ---- GPIO ------------------------------------------------------------- */
void     hal_gpio_output(uint8_t pin, bool active);  /* logic-level aware   */
bool     hal_gpio_read(uint8_t pin);                 /* debounced level read */
void     hal_gpio_init(void);

/* ---- non-volatile storage (flash KV) ---------------------------------- */
/* Returns true on success. key is an app-defined small integer.            */
bool     hal_nv_read(uint16_t key, void *buf, uint16_t len);
bool     hal_nv_write(uint16_t key, const void *buf, uint16_t len);

/* ---- entropy ---------------------------------------------------------- */
/* Fill buf with hardware-random bytes (used for the per-device PIN salt).    */
void     hal_rand_fill(uint8_t *buf, uint16_t len);

/* ---- device identity -------------------------------------------------- */
/* Fills 6-byte BLE MAC (SW-04). Big-endian, mac[0] = MSB.                   */
void     hal_get_mac(uint8_t mac[6]);
/* Fills the printable production serial number string (SW-04).             */
void     hal_get_serial(char *out, uint16_t out_len);

/* ---- BLE control (wraps tuya_ble_sdk) --------------------------------- */
void     hal_ble_adv_start(uint32_t window_ms);  /* SW-02 timed adv window   */
void     hal_ble_adv_stop(void);
void     hal_ble_disconnect(void);
void     hal_ble_set_scan_rsp_name(const char *name); /* SW-04 show MAC/SN   */

/* ---- RF receiver ------------------------------------------------------ */
/* The HAL captures complete KeeLoq frames (in an ISR or decoder IC driver)
 * and delivers them via this callback registered by rf_remote.c.            */
typedef void (*hal_rf_frame_cb_t)(uint64_t raw_frame, uint8_t nbits);
void     hal_rf_init(hal_rf_frame_cb_t cb);

/* ---- ADC (spec §5 current shunt, §7 battery) -------------------------- */
/* Returns the channel voltage in millivolts already scaled to the real-world
 * quantity: ADC_CH_BATTERY -> pack mV; ADC_CH_MOTOR_CURRENT -> shunt mV.     */
uint16_t hal_adc_read_mv(uint8_t channel);
/* Convenience: motor current in milliamps (shunt mV * gain done in HAL).     */
uint16_t hal_motor_current_ma(void);

/* ---- power management (spec §7 deep sleep / INT wake) ----------------- */
/* Arm wake sources (RF INT + BLE) then stop the CPU until one fires. The SDK
 * resumes execution after this call returns (or reboots, platform dependent).*/
void     hal_enter_deep_sleep(void);
/* Configure the wake interrupt pins once at init.                            */
void     hal_configure_wake_sources(void);

#endif /* BOARD_HAL_H */
