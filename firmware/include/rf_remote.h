/**
 * @file    rf_remote.h
 * @brief   Rolling-code remote handling: decode, replay-check, gestures.
 *
 * Turns raw RF frames into validated, de-duplicated button events and detects
 * the special middle-button gestures:
 *   - 3 fast presses  -> open BLE pairing window         (SW-02)
 *   - 10 s hold       -> toggle Bluetooth ON / OFF       (RM-04)
 * Bollard UP/DOWN/STOP presses are forwarded to the bollard module.
 */
#ifndef RF_REMOTE_H
#define RF_REMOTE_H

#include <stdint.h>
#include <stdbool.h>

/* Gesture / event callbacks the application registers (see app_main.c).      */
typedef struct {
    void (*on_pairing_window)(void);          /* SW-02 triple middle-press    */
    void (*on_ble_toggle)(void);              /* RM-04 10 s middle hold       */
    void (*on_reset_combo)(uint32_t serial,   /* SEC-01/02/03 paired fob held */
                           bool is_paired,
                           bool is_master);
} rf_remote_cb_t;

void rf_remote_init(const rf_remote_cb_t *cb);
void rf_remote_task(void);   /* services hold timers; call from main loop     */

/* Tells the RF layer that the physical RST button is currently held, so the
 * next valid fob press is interpreted as a reset combo (SEC-01).             */
void rf_remote_set_reset_arming(bool armed);

#endif /* RF_REMOTE_H */
