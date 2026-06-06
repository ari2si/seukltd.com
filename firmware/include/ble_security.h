/**
 * @file    ble_security.h
 * @brief   App-level Bluetooth security: hidden advertising, PIN lifecycle,
 *          app-authorised remote pairing, MAC/SN display, BLE on/off state.
 *
 * Covers SW-01..04 and RM-01/04, layered on top of the Tuya BLE bonding.
 */
#ifndef BLE_SECURITY_H
#define BLE_SECURITY_H

#include <stdint.h>
#include <stdbool.h>

void ble_sec_init(void);
void ble_sec_task(void);

/* ---- advertising / pairing window (SW-01, SW-02) ---------------------- */
void ble_sec_open_pairing_window(void);   /* 3-min timed, LED solid          */
bool ble_sec_pairing_window_open(void);

/* ---- master BLE on/off (RM-04, SEC-04) -------------------------------- */
void ble_sec_set_enabled(bool enabled);   /* persisted across reboot         */
bool ble_sec_is_enabled(void);
void ble_sec_toggle(void);

/* ---- PIN lifecycle (SW-01, SW-03, SEC-01) ----------------------------- */
bool ble_sec_pin_is_default(void);                  /* SW-03 force-change flag */
bool ble_sec_verify_pin(const char *pin);           /* RM-01 gate             */
bool ble_sec_change_pin(const char *old_pin,
                        const char *new_pin);        /* SW-03                  */
void ble_sec_reset_pin_to_default(void);            /* SEC-01                 */

/* ---- app-authorised remote add (RM-01) -------------------------------- */
/* The app, after a correct PIN, authorises a fob serial. The next learned
 * fob press is only saved if it matches an authorisation that is still open. */
void ble_sec_authorise_remote(uint32_t serial, uint32_t ttl_ms);
bool ble_sec_remote_is_authorised(uint32_t serial);
bool ble_sec_learn_window_open(void);     /* true while a learn window is live  */
void ble_sec_clear_authorisation(void);

/* ---- connection events from the Tuya SDK callback --------------------- */
void ble_sec_on_connected(void);
void ble_sec_on_disconnected(void);

#endif /* BLE_SECURITY_H */
