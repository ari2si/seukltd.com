# Tuya Data-Point (DP) protocol — SEUK bollard controller

These DPs must be created **identically** in the product definition on
[iot.tuya.com] for the BT3L module's PID, and they are what the Tuya app (or a
custom app built on the Tuya BLE SDK) reads/writes. IDs here match
`firmware/src/app_main.c`.

| DP ID | Name            | Type   | Dir   | Values / format                         | Requirement |
|------:|-----------------|--------|-------|-----------------------------------------|-------------|
| 1     | bollard_ctrl    | enum   | r/w   | `0`=stop, `1`=up, `2`=down              | §4/§9       |
| 101   | ble_switch      | bool   | r/w   | `0`=BLE off, `1`=BLE on                 | RM-04 / §8  |
| 102   | change_pin      | string | w     | `"OLDPIN,NEWPIN"` (6 digits each)       | SW-03 / §2  |
| 103   | verify_pin      | string | w     | `"PIN"` — unlocks management this session | RM-01 / §2 |
| 104   | add_remote      | bool   | w     | `1` = open 30 s learn window            | RM-01 / §3  |
| 105   | remove_remote   | value  | w     | fob 28-bit serial to delete             | RM-02 / §3  |
| 106   | remote_count    | value  | r     | number of paired fobs                   | RM-02/03    |
| 107   | device_info     | string | r     | production serial / MAC text            | SW-04       |
| 108   | pin_is_default  | bool   | r     | `1` until the PIN is changed (`is_initialized==0`) | SW-03 |
| 109   | bollard_status  | enum   | r     | `0`lowered `1`raised `2`rising `3`lowering `4`stopped `5`obstructed `6`locked | §9 |
| 110   | battery_pct     | value  | r     | State-of-Charge 0..100 %                | §7          |
| 111   | battery_state   | enum   | r     | `0`ok `1`low(<19V) `2`lockout(<18V)     | §7          |

## App flows

### First connection (SW-03 forced PIN change)
1. App connects during the pairing window (opened by triple middle-press).
2. Device reports `pin_is_default = 1`.
3. App **must** call `change_pin` with `"123456,<new 6 digits>"`.
   Until then every control DP (incl. `bollard_ctrl`) is rejected by firmware.

### Adding a remote (RM-01, app-authorised)
1. App calls `verify_pin` with the current custom PIN → session unlocked.
2. App calls `add_remote = 1` → device opens a 30 s learn window (LED solid).
3. User presses any button on the new fob → firmware authenticates the rolling
   code, saves it, flashes the LED, and reports the new `remote_count`.
   Foreign/un-authorised presses outside this window are ignored.

### Removing a remote (RM-02)
`verify_pin` first, then `remove_remote = <serial>`.

### Device identification (SW-04)
The advertising / scan-response name is `SEUK-Bollard <last 2 MAC bytes>` so a
user never connects to a neighbour's unit; `device_info` also returns the full
serial once connected.

### Real-time status & battery (spec §7, §9)
The firmware pushes `bollard_status` whenever the state changes (so the app can
show *Rising / Lowered / Obstructed*…) and pushes `battery_pct` + `battery_state`
on change. When `battery_state` becomes `1` (low) the app should raise a
low-battery notification and turn the gauge amber; when it becomes `2` (lockout)
the app must show "Battery Depleted – Operation Locked" and disable the UP
toggle, because the firmware already refuses upward travel below 18 V.

### Wrong PIN (spec §2)
If `verify_pin` is wrong the firmware drops the BLE link immediately; the app
must reconnect and retry with the correct custom PIN.
