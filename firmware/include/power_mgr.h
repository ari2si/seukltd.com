/**
 * @file    power_mgr.h
 * @brief   Idle detection + deep-sleep entry / INT wake (spec §7).
 *
 * The board sleeps ~10 s after the motor stops and the system is otherwise
 * idle, dropping to <= 0.2 mA. A 1 s remote press (RF INT) or a Tuya app
 * connection wakes it within WAKE_LATENCY_MAX_MS.
 */
#ifndef POWER_MGR_H
#define POWER_MGR_H

#include <stdbool.h>

void power_mgr_init(void);
void power_mgr_task(void);

/* Reset the idle timer. Call on any meaningful activity: RF frame, BLE
 * connect, motor motion, button press.                                       */
void power_mgr_notify_activity(void);

/* Keep the board awake while true (e.g. BLE connected or pairing window).     */
void power_mgr_inhibit_sleep(bool inhibit);

#endif /* POWER_MGR_H */
