# Integration guide — for YET (YET8542BTR firmware)

This guide is for **YET**, who already build the YET8542BTR firmware on the
**Tuya BLE SDK** and can modify the source. Our reference is plain **C**
structured around the **same Tuya BLE SDK model** (data points, `tuya_ble_sdk`
init, DP/connection callbacks), so the task is to **merge our feature modules
into your existing project and wire up three callbacks** — not to rewrite
anything.

## 1. Overview
- **Language/framework: identical** — C on the Tuya BLE SDK.
- You **keep** your existing Tuya provisioning, OTA, and RF front-end. You **add**
  our application logic (actuator, security, battery, sleep, remote/PIN
  management) and the data points.
- Touch points: copy ~14 C/H modules, implement **one** HAL file for your
  pins/peripherals, create the DP list, route **3** SDK callbacks.

## 2. Step by step
1. Confirm the build: the Tuya BLE **SoC** SDK project for the YET8542BTR chip,
   your **Product ID (PID)**, and the flash tool.
2. Add our modules to the project (file map below) — platform-independent C.
3. Implement **one file — `board_hal.c`** against the hardware (every function is
   stubbed and marked `>>> FACTORY <<<`).
4. Fill **`app_config.h`**: real GPIO/pin map + active levels; KeeLoq
   manufacturer key + learning scheme; thresholds if your mechanics differ.
5. Create the **data points** (see `tuya_dp_protocol.md`) on the Tuya product —
   IDs and types must match.
6. Route the **Tuya SDK callbacks** (section 3).
7. Build, flash, run the **feature test list** (section 5).

## 3. Wire these three Tuya SDK callbacks
| Tuya SDK event | Call |
|---|---|
| BLE connection established | `app_on_ble_connected()` |
| BLE disconnection | `app_on_ble_disconnected()` |
| DP data received from app | `app_on_dp_received(dp_buf, dp_len)` |

Also call `app_init()` once at startup and `app_loop_once()` from your main loop
(or the SDK periodic hook). Keep BLE advertising **OFF** at boot — it is opened
only by the pairing-window logic.

## 4. `board_hal.c` — the only hardware file
| HAL function | Wire to |
|---|---|
| `hal_gpio_init/output/read` | Relays UP/DOWN, LED strip, RST button, limit switches |
| `hal_adc_read_mv`, `hal_motor_current_ma` | Battery divider + low-side current shunt |
| `hal_nv_read/write` | Tuya flash key/value (fobs, PIN hash, settings) |
| `hal_rf_init(cb)` | Your 433.92 MHz receiver — deliver each KeeLoq frame to `cb` |
| `hal_ble_*`, `hal_ble_link_is_encrypted` | Tuya GAP adv/disconnect + secure-session state |
| `hal_enter_deep_sleep`, `hal_configure_wake_sources` | Low-power + RF-INT / BLE / limit-up wake |
| `hal_rand_fill` | SoC TRNG (PIN salt) |
| `hal_get_mac/serial` | Device MAC / serial shown in the app |

## 5. Feature test list (after flashing)
1. Remote A/B = Up/Down, **middle = STOP**; ×3 opens pairing; 10 s hold toggles BLE.
2. App: find by MAC, `123456` → set custom PIN → control; wrong PIN drops link;
   **5 bad tries → lockout**.
3. Limit switches stop travel with the **1 s pad**; obstruction (>3 A/1 s) cuts + reverses.
4. Battery: <19 V warn flash + DP; <18 V **UP-lockout**; deep sleep after 10 s; wake on remote/app.
5. Reset/recovery: RST + paired fob resets PIN; RST 5 s wipes fobs; RST 10 s forces BLE on + pairing.
6. Anti-tamper: pushing a raised bollard down re-drives it up; **tamper DP** sent.

## 6. Security items to finish at YET
- Return the **real** secure-session state from `hal_ble_link_is_encrypted()`
  (PIN only taken over an encrypted Tuya link). Keep `REQUIRE_ENCRYPTED_LINK = 1`.
- Enable the chip's **flash read-out / debug-port protection** (so the hashed PIN
  and keys can't be dumped).
- Use KeeLoq **Secure learning** and keep the **manufacturer key secret**
  (never in shared source).

## 7. File map (what to copy)
| Area | Files |
|---|---|
| Config / HAL | `app_config.h`, `board_hal.h/.c` (implement bodies) |
| Actuator + sensing | `bollard.h/.c`, `battery.h/.c`, `power_mgr.h/.c`, `led.h/.c` |
| Remote (RF) | `keeloq.h/.c`, `remote_store.h/.c`, `rf_remote.h/.c` |
| BLE security | `ble_security.h/.c`, `sha256.h/.c`, `events.h/.c` |
| App glue | `app_main.c` (DP protocol + callbacks + main loop) |
