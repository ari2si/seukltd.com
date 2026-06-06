# SEUK Bollard Controller — firmware reference

Firmware for the rising-bollard control board (Tuya **BT3L** Bluetooth-LE SoC
module + KeeLoq "code hopping" 433 MHz RF receiver + 2 relays + LED strip +
RST button), housed in the IP68 box.

It is controlled two ways:

1. **Rolling-code key fobs** ("code hopping" remotes) — raise / lower / stop the
   bollard, and special middle-button gestures manage Bluetooth.
2. **Tuya BLE app** (the free Tuya / Smart Life app, or a custom app on the
   Tuya BLE SDK) — for PIN-protected setup, adding/removing fobs, and control.

> **Scope / honesty note.** This is a *reference implementation* against the
> public `tuya_ble_sdk`. It is structured to compile and to make every
> integration point unambiguous, but it is **not** a flash-ready binary: the
> factory must supply the real GPIO map, the KeeLoq manufacturer key, the Tuya
> PID/auth key, and implement the `board_hal.c` bodies for the specific BT3L
> chip platform (Telink/Beken/Realtek). Every such point is marked
> `>>> FACTORY <<<` in the source.

## Layout

```
firmware/
  include/        public headers (config + module APIs)
  src/            implementation
  docs/           Tuya DP protocol the app talks to
```

| Module          | Responsibility |
|-----------------|----------------|
| `app_config.h`  | All pins, timings, keys, defaults — the one file to tune |
| `board_hal.*`   | Porting layer over the Tuya SoC SDK (GPIO/ADC/flash/BLE/RF/sleep) |
| `keeloq.*`      | KeeLoq cipher + rolling-code frame decode |
| `remote_store.*`| Flash table of paired fobs + replay counters |
| `rf_remote.*`   | Decode → authenticate → replay-check → action/gestures |
| `bollard.*`     | Relays + limit switches + obstruction auto-reverse + battery lockout |
| `battery.*`     | Under-load voltage, SoC table, low/lockout states (§7) |
| `power_mgr.*`   | Idle detection + deep sleep / INT wake (§7) |
| `ble_security.*`| Hidden advertising, PIN lifecycle, BLE on/off, learn window |
| `reset_mgr.*`   | Physical RST-button logic (clear fobs, thief-proof reset, recovery) |
| `led.*`         | Status LED-strip patterns (§6) |
| `app_main.*`    | Tuya DP protocol + LED arbitration + wiring + main loop |

## Requirement traceability

Hardware items are assembly/build instructions, captured here and in
`app_config.h`; software items are implemented in code. Mapped against the
detailed 9-section specification (and the original HW/SW/RM/SEC list).

| Spec | Item | Where implemented |
|------|------|-------------------|
| §1   | `is_initialized` state | `pin_is_default` flag (== `!is_initialized`) in `ble_security.c` |
| §1   | 2 pre-paired fobs out of the box | `factory_prepair_if_blank` (`app_main.c`) |
| §1   | No potting / gasket / RST silicone boot | assembly notes (HW-01/03/04) |
| §1   | Up/Down drive relays | `bollard_command` (`bollard.c`) |
| §2   | BLE dormant until triggered | adv stays off until `ble_sec_open_pairing_window` |
| §2   | 3× middle-press → solid LED, 3-min window | `on_pairing_window`, `ble_security.c`, `led.c` |
| §2   | MAC/SN shown in scan | `apply_adv_name` + `device_info` DP |
| §2   | Reject all but `123456` until init; force custom PIN; `is_initialized=1`; drop link on wrong PIN | `handle_dp` gate + `ble_sec_change_pin` + `hal_ble_disconnect` |
| §3   | App-authorised learn (PIN → learn window → fob) | `verify_pin`/`add_remote` + `rf_remote.c` |
| §3   | Hold RST 5 s → wipe all fobs | `reset_mgr.c` |
| §3   | 8–10 fob whitelist; many-to-one / one-to-many / many-to-app | `MAX_REMOTES=10`, `remote_store.*`, Tuya cloud |
| §4   | Polarity relays, limit switches, 1 s de-energise pad | `bollard.c` (`PH_LIMIT_PAD`) |
| §5   | Shunt current >3 A ±0.3 A / 1 s → cut, 500 ms pause, auto-retract | `obstruction_tripped` + `PH_OBSTR_PAUSE` (`bollard.c`) |
| §6   | LED: moving 0.5/1.0, pairing solid, fault 0.2/0.2 | `led.c` + `app_update_led` |
| §7   | Under-load voltage, SoC table, <19 V warn, <18 V UP-lockout, DP alert | `battery.*`, `app_main.c` |
| §7   | Deep sleep 10 s idle (≤0.2 mA) + RF/BLE INT wake | `power_mgr.*`, `board_hal.c` |
| §8   | Middle-hold 10 s → BLE off; RST 10 s → BLE on | `rf_remote.c`, `reset_mgr.c` |
| §8   | RST + paired fob → PIN→`123456`, `is_initialized=0`; unpaired rejected | `reset_mgr.c` |
| §8   | Installer master serial override | `INSTALLER_MASTER_SERIAL`, `reset_mgr.c` |
| §8   | Anti-tamper hold-up (push-down INT → re-drive UP → re-sleep) | `bollard.c` (`PH_IDLE`), `board_hal.c` wake |
| §9   | Rolling-code RX, A/B/C buttons, app PIN control, real-time status DP | `rf_remote.c`, `bollard_status` DP |

Original ID cross-reference: SW-01→§2, SW-02→§2, SW-03→§2, SW-04→§2;
RM-01→§3, RM-02→§3, RM-03→§1, RM-04→§8; SEC-01..04→§8; HW-01..04→§1.

## Before flashing — factory checklist

1. **Pins** — set `PIN_*`, `*_ACTIVE_*` in `app_config.h` from the schematic.
2. **KeeLoq key & scheme** — set `KEELOQ_MFR_KEY_*`; confirm `derive_device_key`
   matches the fob encoder (Simple/Normal/Secure learning) in `keeloq.c`.
3. **RF capture** — implement `hal_rf_init` and confirm the bit order feeding
   `keeloq_decode` (KeeLoq is LSB-first; see `keeloq.c` notes).
4. **Tuya** — set `TUYA_DEVICE_PID`; create the DPs in `docs/tuya_dp_protocol.md`
   on iot.tuya.com; integrate `tuya_ble_sdk_init` in `app_main.c`.
5. **Factory fobs** — write the 2 pre-paired serials into `k_factory_fobs`
   (or provision them on the line) for RM-03.
6. **HAL bodies** — implement `board_hal.c` for the BT3L chip platform.

## Sanity build

Pure logic modules can be syntax-checked on a host without the SDK:

```sh
cd firmware
cc -std=c99 -Wall -Wextra -fsyntax-only -Iinclude src/*.c
```
