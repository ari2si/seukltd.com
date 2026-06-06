/**
 * @file    reset_mgr.h
 * @brief   Physical RST-button logic: thief-proof PIN reset and emergency
 *          Bluetooth recovery.
 *
 *   SEC-01  RST held + an ALREADY-paired fob pressed  -> PIN back to 123456.
 *   SEC-02  RST held + an UNPAIRED fob pressed         -> rejected.
 *   SEC-03  RST held + the installer master fob        -> override allowed.
 *   SEC-04  RST held alone for 10 s                    -> force Bluetooth ON.
 */
#ifndef RESET_MGR_H
#define RESET_MGR_H

#include <stdint.h>
#include <stdbool.h>

void reset_mgr_init(void);
void reset_mgr_task(void);   /* polls the RST button; call from main loop     */
bool reset_mgr_service_active(void);  /* true while the RST button is held      */

/* Called by rf_remote when a valid fob press arrives while RST is held.      */
void reset_mgr_on_fob_during_hold(uint32_t serial, bool is_paired, bool is_master);

#endif /* RESET_MGR_H */
