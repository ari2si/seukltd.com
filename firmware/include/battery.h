/**
 * @file    battery.h
 * @brief   22 V Li pack monitoring: under-load voltage, SoC %, warn/lockout.
 *          Implements spec §7 and the UP-travel lockout used by §5/§7.
 */
#ifndef BATTERY_H
#define BATTERY_H

#include <stdint.h>
#include <stdbool.h>

typedef enum {
    BATT_OK = 0,      /* >= warn threshold                                    */
    BATT_LOW,         /* < 19 V under load: rapid flash + app alert           */
    BATT_LOCKOUT,     /* < 18 V: UP travel refused                            */
} batt_state_t;

void         battery_init(void);
void         battery_task(void);          /* periodic sampling                */

/* Force a fresh under-load reading; call while the motor is running so the
 * surface-charge voltage does not give a false-high result (spec §7).        */
void         battery_sample_under_load(void);

uint16_t     battery_voltage_mv(void);
uint8_t      battery_soc_percent(void);   /* 0..100 via multi-point table     */
batt_state_t battery_state(void);
bool         battery_up_allowed(void);    /* false in BATT_LOCKOUT (§7)        */

/* True for one call after the state changes, so the app DP is only re-sent
 * when something actually changed.                                           */
bool         battery_state_changed(void);

#endif /* BATTERY_H */
