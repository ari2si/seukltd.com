/**
 * @file    app_config.h
 * @brief   Central configuration for the SEUK bollard controller firmware.
 *
 * Target hardware : Tuya BT3L Bluetooth-LE SoC module (acts as the MCU)
 *                   + KeeLoq / rolling-code ("code hopping") 433 MHz RF receiver
 *                   + 2x relays (bollard UP / DOWN) + LED strip + RST button.
 *
 * EVERYTHING the factory must confirm / fill in is marked  >>> FACTORY <<<.
 * Pin numbers below are PLACEHOLDERS and MUST be matched to the real PCB
 * schematic before flashing.
 */
#ifndef APP_CONFIG_H
#define APP_CONFIG_H

#include <stdint.h>
#include <stdbool.h>

/* ------------------------------------------------------------------------- */
/*  Firmware identity                                                        */
/* ------------------------------------------------------------------------- */
#define FW_NAME                     "seuk-bollard"
#define FW_VERSION_MAJOR            1
#define FW_VERSION_MINOR            0
#define FW_VERSION_PATCH            0

/* ------------------------------------------------------------------------- */
/*  Tuya cloud product credentials   >>> FACTORY <<<                         */
/*  Obtained from iot.tuya.com when the product (PID) is created.            */
/* ------------------------------------------------------------------------- */
#define TUYA_DEVICE_PID             "xxxxxxxxxxxxxxxx"   /* 16-char Product ID */
#define TUYA_DEVICE_AUTH_KEY        "xxxxxxxxxxxxxxxx..."/* per-PID auth key   */
/* The per-unit UUID + AuthKey are written at production by Tuya's licence
 * tool; this firmware only needs the PID at compile time.                    */

/* ------------------------------------------------------------------------- */
/*  GPIO map  >>> FACTORY: match to schematic <<<                            */
/*  Use the SDK's own pin enumeration (TUYA_GPIO_NUM_x) in board_hal.c.      */
/* ------------------------------------------------------------------------- */
#define PIN_RELAY_UP                0   /* drives the "raise bollard" relay   */
#define PIN_RELAY_DOWN              1   /* drives the "lower bollard" relay    */
#define PIN_LED_STRIP               2   /* status LED strip output            */
#define PIN_RST_BUTTON              3   /* physical PCB RST button (active-low)*/
#define PIN_RF_DATA                 4   /* data line from 433 MHz RF receiver  */
#define PIN_LIMIT_UP                5   /* upper stroke-limit microswitch      */
#define PIN_LIMIT_DOWN             6   /* lower stroke-limit microswitch      */
#define PIN_RF_INT                  7   /* RF receiver wake interrupt line     */

#define RELAY_ACTIVE_HIGH           1   /* 1 = relay coil energised on logic-1 */
#define RST_BUTTON_ACTIVE_LOW       1   /* 1 = button reads 0 when pressed     */
#define LIMIT_SWITCH_ACTIVE_LOW     1   /* 1 = switch reads 0 when actuated     */
#define LED_ACTIVE_HIGH             1

/* ADC channels (logical ids passed to hal_adc_read_mv).  >>> FACTORY <<<     */
#define ADC_CH_MOTOR_CURRENT        0   /* low-side shunt amplifier output     */
#define ADC_CH_BATTERY              1   /* 22 V pack divider                   */

/* ------------------------------------------------------------------------- */
/*  Bollard motion timing & limit handling (spec §4)                         */
/* ------------------------------------------------------------------------- */
#define BOLLARD_TRAVEL_TIMEOUT_MS   30000u  /* hard safety stop (no limit hit) */
#define BOLLARD_DIR_DEADTIME_MS     300u    /* gap before reversing direction  */
#define BOLLARD_LIMIT_STOP_DELAY_MS 1000u   /* §4: 1 s padding before de-energise */

/* ------------------------------------------------------------------------- */
/*  Obstruction detection — current shunt (spec §5)                          */
/* ------------------------------------------------------------------------- */
#define OBSTRUCT_CURRENT_MA         3000u   /* trip threshold                  */
#define OBSTRUCT_TOLERANCE_MA       300u    /* ±0.3 A variance allowance       */
#define OBSTRUCT_DEBOUNCE_MS        1000u   /* must persist >1 s               */
#define OBSTRUCT_REVERSE_PAUSE_MS   500u    /* pause before auto-retract       */
#define OBSTRUCT_DETECT_ON_UP_ONLY  1       /* §5 specifies upward travel      */

/* ------------------------------------------------------------------------- */
/*  Anti-tamper hold-up (spec §8)                                            */
/*  At rest UP the relays are open (zero standby). If the actuator is forced  */
/*  down it leaves the upper microswitch; that edge wakes the MCU which       */
/*  re-drives UP to restore the locked position, then re-sleeps.             */
/* ------------------------------------------------------------------------- */
#define ANTI_TAMPER_RESTORE         1       /* 1 = fight a manual push-down    */
/* >>> FACTORY: wire PIN_LIMIT_UP so its OPEN edge is a deep-sleep wake INT.  */

/* ------------------------------------------------------------------------- */
/*  Battery: 22 V Li pack monitoring (spec §7)   millivolts                   */
/* ------------------------------------------------------------------------- */
#define BATT_FULL_MV                25200u  /* 100 %                           */
#define BATT_MID_MV                 21000u  /*  50 %                           */
#define BATT_EMPTY_MV               18000u  /*   0 % / lockout floor           */
#define BATT_LOW_WARN_MV            19000u  /* §7: rapid-flash + app alert     */
#define BATT_LOCKOUT_MV             18000u  /* §7: refuse UP travel below this  */

/* ------------------------------------------------------------------------- */
/*  Deep sleep (spec §7)                                                      */
/* ------------------------------------------------------------------------- */
#define DEEP_SLEEP_IDLE_MS          10000u  /* §7: idle time before sleeping   */
#define WAKE_LATENCY_MAX_MS         1000u   /* §7: must be awake within 1000 ms */
#define WAKE_RF_MIN_PRESS_MS        1000u   /* §7: an elongated 1 s remote      */
                                            /*     press is what triggers wake   */

/* ------------------------------------------------------------------------- */
/*  RF rolling-code (KeeLoq) parameters   >>> FACTORY <<<                     */
/* ------------------------------------------------------------------------- */
/* 64-bit KeeLoq manufacturer key used to derive each fob's device key.
 * This is SECRET and belongs to the factory; never commit the real value.   */
#define KEELOQ_MFR_KEY_LO           0x00000000u
#define KEELOQ_MFR_KEY_HI           0x00000000u

/* Rolling-code acceptance windows (Microchip AN's recommended defaults).    */
#define KEELOQ_SINGLE_WINDOW        16      /* counter may jump up to +16      */
#define KEELOQ_DOUBLE_WINDOW        32768   /* resync window (two presses)     */

/* ------------------------------------------------------------------------- */
/*  Remote (fob) button codes  >>> FACTORY: match fob encoder <<<            */
/*  4-bit button field carried in the KeeLoq frame.                          */
/* ------------------------------------------------------------------------- */
#define FOB_BTN_UP                  0x1   /* Button A: raise bollard          */
#define FOB_BTN_DOWN               0x2   /* Button B: lower bollard          */
#define FOB_BTN_MIDDLE              0x4   /* Middle: STOP (single press) +     */
                                          /*  ×3 -> pairing, 10 s hold -> BLE  */
#define FOB_BTN_STOP                0x8   /* optional dedicated STOP button    */

/* ------------------------------------------------------------------------- */
/*  Remote storage limits                                                    */
/* ------------------------------------------------------------------------- */
#define MAX_REMOTES                 10      /* §3: whitelist up to 8-10 fobs   */
#define FACTORY_PREPAIR_COUNT       2       /* RM-03: ships pre-paired w/ 2     */

/* ------------------------------------------------------------------------- */
/*  Bluetooth / app security (SW-xx)                                         */
/* ------------------------------------------------------------------------- */
#define DEFAULT_PIN                 "123456"   /* SW-01 factory default PIN    */
#define PIN_LEN                     6
#define BLE_PAIRING_WINDOW_MS       180000u    /* SW-02: 3-minute open window   */
#define BLE_SUCCESS_FLASH_MS        2000u      /* SW-02: 2 s flash on success   */
#define APP_AUTH_TIMEOUT_MS         15000u     /* §2: drop link if no valid PIN */

/* ------------------------------------------------------------------------- */
/*  Security hardening                                                       */
/* ------------------------------------------------------------------------- */
/* PIN brute-force lockout: after THRESHOLD wrong tries, reject PIN attempts  */
/* for a backoff that grows with each further failure (persisted count).      */
#define PIN_FAIL_LOCK_THRESHOLD     5
#define PIN_LOCK_BASE_MS            30000u     /* first lockout = 30 s          */
#define PIN_LOCK_MAX_SHIFT          5          /* cap backoff at base<<5 (~16m) */

/* Hashed PIN at rest: stored as salt + iterated SHA-256, never plaintext.    */
#define PIN_SALT_LEN                8
#define PIN_HASH_LEN                32
#define PIN_HASH_ITERS              2048u      /* slows online + offline guessing */

/* Tamper event reasons reported to the app (DP_TAMPER).                      */
#define TAMPER_FORCED_PUSHDOWN      1
#define TAMPER_ENCLOSURE_RST        2

/* ------------------------------------------------------------------------- */
/*  LED-strip timing profiles (spec §6)   milliseconds                       */
/* ------------------------------------------------------------------------- */
#define LED_MOVING_ON_MS            500u       /* §6: moving 0.5 s ON           */
#define LED_MOVING_OFF_MS           1000u      /* §6: moving 1.0 s OFF          */
#define LED_FAULT_ON_MS             200u       /* §6: fault/low-batt 0.2 s ON   */
#define LED_FAULT_OFF_MS            200u       /* §6: fault/low-batt 0.2 s OFF  */

/* ------------------------------------------------------------------------- */
/*  Remote gesture timing (RM-04, SW-02)                                     */
/* ------------------------------------------------------------------------- */
#define MIDDLE_TRIPLE_PRESS_MS      1500u      /* 3 fast presses inside this    */
#define MIDDLE_HOLD_TOGGLE_MS       10000u     /* RM-04: 10 s hold => BLE toggle*/

/* ------------------------------------------------------------------------- */
/*  Physical RST button timing (SEC-01, SEC-04)                              */
/* ------------------------------------------------------------------------- */
#define RST_CLEAR_REMOTES_MS        5000u      /* §3: 5 s alone => wipe all fobs */
#define RST_EMERGENCY_HOLD_MS       10000u     /* SEC-04: 10 s => force BLE on  */
#define RST_RESET_COMBO_WINDOW_MS   8000u      /* SEC-01: window to also press  */
                                              /*         a paired remote        */
/* NOTE >>> FACTORY: §3 (5 s = wipe fobs) and §8 (10 s = BLE recovery) share
 * the RST button, so holding to 10 s also passes the 5 s wipe point. Confirm
 * this is intended, or move one action to a distinct gesture.                */

/* ------------------------------------------------------------------------- */
/*  Installer master override (SEC-03)  >>> FACTORY <<<                       */
/*  Hard-coded 28-bit serial of SEUK's installer master fob. Pressing it     */
/*  with RST held can recover a unit even when all client fobs are lost.     */
/* ------------------------------------------------------------------------- */
#define INSTALLER_MASTER_SERIAL     0x0FFFFFFFu

#endif /* APP_CONFIG_H */
