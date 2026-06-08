# BLOC Bollard firmware package — instructions for YET

## 1. What this package is
This is the **reference firmware (C source) + an interactive simulator +
documentation** for the BLOC rising-bollard controller that runs on your
**YET8542BTR (Tuya BLE) module** with a 433.92 MHz rolling-code remote.

It is written in **C on the Tuya BLE SDK — the same framework you already use** —
so it is designed to be **merged into your existing YET8542BTR firmware project,
not rewritten.**

> It is **not** a flashed binary. It becomes the running firmware once you
> compile it with your Tuya SoC SDK for the module and fill in the
> hardware-specific parts (pins, KeeLoq key, ADC, etc.).

## 2. What it is good for
- **See and run every required feature before coding** — the simulator runs in a
  browser and demonstrates remote control, app pairing/PIN, multi-remote/
  multi-bollard topologies, battery lockout, anti-tamper, and reset/recovery.
- **Ready-to-merge C modules** implementing all of it (actuator + limit switches,
  obstruction auto-reverse, rolling-code remote, Tuya app pairing + custom PIN,
  PIN brute-force lockout + hashed PIN, battery monitor, deep sleep, anti-tamper).
- **A precise spec**: the exact Tuya data points to create, and a step-by-step
  integration guide.

## 3. What's inside (folder map)
```
BLOC-Bollard-Package/
├─ READ-ME-FIRST.md / START-HERE.txt   ← this guide + quick pointers
├─ simulator/        index.html, topology.html  ← open in a browser to TEST
├─ include/  (13 .h)                    ← the code (headers)
├─ src/      (13 .c)                    ← the code (logic)
├─ README.md                           ← module overview + traceability
└─ docs/
   ├─ INTEGRATION-GUIDE-YET.md          ← detailed step-by-step + file map + tests
   ├─ tuya_dp_protocol.md               ← the data points to create on Tuya
   └─ BLOC-Bollard-Firmware-Specification.docx
```

## 4. How to USE it — Step A: test the simulator (≈5 minutes)
1. Unzip the package.
2. Double-click **`simulator/index.html`** — it opens in any browser (Chrome /
   Edge / Safari / Firefox) and runs **fully offline, no install**.
3. Try the pebble remote (A=Up, B=Down, middle=STOP; press middle ×3 to open
   pairing; hold middle to toggle BLE), the phone pairing flow, the PCB
   pair/RST recovery buttons, the battery slider and the obstacle toggle.
4. Open **`topology.html`** for the multi-bollard and multi-remote/phone scenes.
5. To see the "lost all remotes → add a new one" flow, open:
   `index.html?pin=482922&fobs=0&ble=off` then use the PCB "RST hold 10 s → BLE
   recovery" button and the app.

## 5. How to INTEGRATE it — Step B: merge into your firmware
1. **Confirm the build**: your Tuya BLE **SoC** SDK project for the YET8542BTR
   chip, your **Product ID (PID)**, and the flash tool.
2. **Copy our modules** (`include/` + `src/`) into the project — platform-
   independent C (see the file map in `docs/INTEGRATION-GUIDE-YET.md`).
3. **Implement ONE file — `src/board_hal.c`** against the YET8542BTR hardware:
   GPIO, ADC (current shunt + battery), flash key/value, BLE helpers, RF frame
   capture, deep-sleep/wake, RNG, and the secure-session check. Every function
   is stubbed and marked `>>> FACTORY <<<`.
4. **Fill `include/app_config.h`**: the real GPIO/pin map + active levels, the
   KeeLoq manufacturer key + learning scheme (Normal or Secure), and the
   obstruction/battery thresholds if your mechanics differ.
5. **Create the data points** from `docs/tuya_dp_protocol.md` on the Tuya
   product — the IDs and types must match.
6. **Route three Tuya SDK callbacks** and the two loop hooks:
   - BLE connected            → `app_on_ble_connected()`
   - BLE disconnected         → `app_on_ble_disconnected()`
   - DP data received         → `app_on_dp_received(dp_buf, dp_len)`
   - at startup               → `app_init()`
   - in the main loop / hook  → `app_loop_once()`
   Keep BLE advertising **OFF** at boot — it is opened only by the pairing logic.
7. **Build, flash, and run** the feature test list in the integration guide.

## 6. The only things you edit on-site (43 marked points)
Everything else is portable C. Search the whole tree for **`>>> FACTORY <<<`**
(43 occurrences) to find every value/implementation we need from you — they are
concentrated in `app_config.h` (pins, KeeLoq key) and `board_hal.c` (hardware).

Quick syntax check on a PC (no SDK needed):
```
cc -std=c99 -Wall -Wextra -fsyntax-only -Iinclude src/*.c
```

## 7. Security items to finish at YET
- Return the **real** secure-session state from `hal_ble_link_is_encrypted()` so
  the PIN is only accepted over an encrypted Tuya link (keep
  `REQUIRE_ENCRYPTED_LINK = 1` in production).
- Enable the chip's **flash read-out / debug-port protection** (so the hashed
  PIN and keys can't be dumped).
- Use KeeLoq **Secure learning** and keep the **manufacturer key secret**
  (never in shared source control).

## 8. What we need back from you (to finalise)
1. Confirm the module is **SoC mode** (our firmware runs on it) and can be flashed
   with custom Tuya-SDK firmware.
2. The **GPIO/pin map** and the **KeeLoq manufacturer key + learning scheme**.
3. The **Tuya PID** and confirmation the data points above can be configured.
