/**
 * @file  ble_security.c
 * @brief App-layer BLE security state machine (SW-01..04, RM-01/04, SEC-04).
 */
#include "ble_security.h"
#include "led.h"
#include "sha256.h"
#include "app_config.h"
#include "board_hal.h"

#include <string.h>
#include <stdio.h>

#define NV_KEY_SEC   0x0021    /* bumped: PIN now stored hashed, not plaintext  */

typedef struct {
    uint8_t salt[PIN_SALT_LEN];     /* per-device random salt                  */
    uint8_t hash[PIN_HASH_LEN];     /* iterated SHA-256 of (salt||PIN)         */
    uint8_t pin_is_default;         /* SW-03: forces a change on first connect */
    uint8_t ble_enabled;            /* RM-04 master switch                     */
    uint8_t fail_count;             /* consecutive wrong-PIN attempts          */
    uint8_t magic;                  /* 0xA6 once initialised                   */
} sec_nv_t;

static sec_nv_t  s_nv;
static bool      s_window_open;
static uint32_t  s_window_start;
static bool      s_connected;

/* PIN brute-force lockout (RAM; fail_count is persisted so a reboot can't
 * grant a free guessing window).                                             */
static bool      s_lockout_set;
static uint32_t  s_lockout_until;

/* ---- hashed-PIN helpers ----------------------------------------------- */
static void pin_hash(const uint8_t salt[PIN_SALT_LEN], const char *pin,
                     uint8_t out[PIN_HASH_LEN])
{
    sha256_ctx c;
    sha256_init(&c);
    sha256_update(&c, salt, PIN_SALT_LEN);
    sha256_update(&c, (const uint8_t *)pin, strlen(pin));
    sha256_final(&c, out);
    for (uint32_t i = 1; i < PIN_HASH_ITERS; i++) {   /* slow down guessing    */
        sha256_init(&c);
        sha256_update(&c, out, PIN_HASH_LEN);
        sha256_update(&c, salt, PIN_SALT_LEN);
        sha256_final(&c, out);
    }
}

static bool ct_equal(const uint8_t *a, const uint8_t *b, uint16_t n)
{
    uint8_t d = 0;
    for (uint16_t i = 0; i < n; i++) d |= (uint8_t)(a[i] ^ b[i]);
    return d == 0;                                    /* constant-time compare */
}

/* RM-01 remote-learning authorisation window.                                */
static uint32_t  s_auth_serial;     /* 0 = "accept the next new fob"          */
static uint32_t  s_auth_until;
static bool      s_auth_active;

/* ---- persistence ------------------------------------------------------ */
static void persist(void) { hal_nv_write(NV_KEY_SEC, &s_nv, sizeof(s_nv)); }

/* Generate a fresh salt and store the hash of `pin`. */
static void store_pin(const char *pin, bool is_default)
{
    hal_rand_fill(s_nv.salt, PIN_SALT_LEN);
    pin_hash(s_nv.salt, pin, s_nv.hash);
    s_nv.pin_is_default = is_default ? 1 : 0;
    persist();
}

static uint32_t lock_backoff(uint8_t fail_count)
{
    uint8_t over = (fail_count > PIN_FAIL_LOCK_THRESHOLD)
                   ? (uint8_t)(fail_count - PIN_FAIL_LOCK_THRESHOLD) : 0;
    if (over > PIN_LOCK_MAX_SHIFT) over = PIN_LOCK_MAX_SHIFT;
    return PIN_LOCK_BASE_MS << over;
}

static void apply_lockout(void)
{
    if (s_nv.fail_count >= PIN_FAIL_LOCK_THRESHOLD) {
        s_lockout_set   = true;
        s_lockout_until = hal_millis() + lock_backoff(s_nv.fail_count);
    }
}

void ble_sec_init(void)
{
    if (!hal_nv_read(NV_KEY_SEC, &s_nv, sizeof(s_nv)) || s_nv.magic != 0xA6) {
        memset(&s_nv, 0, sizeof(s_nv));
        s_nv.ble_enabled = 1;            /* shipped ON; remote can disable      */
        s_nv.fail_count  = 0;
        s_nv.magic       = 0xA6;
        store_pin(DEFAULT_PIN, true);    /* stores salt+hash, persists          */
    }
    s_window_open = false;
    s_connected   = false;
    s_auth_active = false;
    s_lockout_set = false;
    apply_lockout();                     /* re-arm lockout if it shipped locked */
}

/* ---- SW-04: advertise so the app shows MAC / serial ------------------- */
static void apply_adv_name(void)
{
    uint8_t mac[6];
    char    name[32];
    hal_get_mac(mac);
    /* e.g. "SEUK-Bollard A1B2" — last 2 MAC bytes disambiguate neighbours.   */
    snprintf(name, sizeof(name), "SEUK-Bollard %02X%02X", mac[4], mac[5]);
    hal_ble_set_scan_rsp_name(name);
}

/* ---- SW-01/02: hidden advertising + timed pairing window --------------- */
void ble_sec_open_pairing_window(void)
{
    if (!s_nv.ble_enabled) return;          /* RM-04: stays dark when OFF       */
    apply_adv_name();
    hal_ble_adv_start(BLE_PAIRING_WINDOW_MS);
    s_window_open  = true;
    s_window_start = hal_millis();
    led_set(LED_SOLID);                     /* SW-02: solid while open          */
}

bool ble_sec_pairing_window_open(void) { return s_window_open; }

/* §2: safely close the pairing window (stop advertising). */
void ble_sec_close_pairing_window(void)
{
    if (!s_window_open) return;
    hal_ble_adv_stop();
    s_window_open = false;
    if (led_get() == LED_SOLID) led_set(LED_OFF);
}

void ble_sec_task(void)
{
    uint32_t now = hal_millis();

    if (s_window_open && !s_connected &&
        (now - s_window_start) >= BLE_PAIRING_WINDOW_MS) {
        hal_ble_adv_stop();
        s_window_open = false;
        if (led_get() == LED_SOLID) led_set(LED_OFF);
    }

    if (s_auth_active && (int32_t)(now - s_auth_until) >= 0)
        s_auth_active = false;
}

/* ---- RM-04 / SEC-04: master BLE on/off -------------------------------- */
void ble_sec_set_enabled(bool enabled)
{
    if (s_nv.ble_enabled == (enabled ? 1 : 0)) return;
    s_nv.ble_enabled = enabled ? 1 : 0;
    persist();
    if (!enabled) {
        hal_ble_adv_stop();
        hal_ble_disconnect();
        s_window_open = false;
        led_set(LED_OFF);
    }
}

bool ble_sec_is_enabled(void) { return s_nv.ble_enabled != 0; }
void ble_sec_toggle(void)     { ble_sec_set_enabled(!ble_sec_is_enabled()); }

/* ---- PIN lifecycle ---------------------------------------------------- */
bool ble_sec_pin_is_default(void) { return s_nv.pin_is_default != 0; }

/* §1/§2/§8: is_initialized == 0 while the factory default PIN is in force,
 * 1 once a custom PIN has been written. (Stored as the inverse of
 * pin_is_default so a blank/erased flash reads as not-initialised.)          */
bool ble_sec_is_initialized(void) { return s_nv.pin_is_default == 0; }

bool ble_sec_pin_locked(void)
{
    if (!s_lockout_set) return false;
    if ((int32_t)(hal_millis() - s_lockout_until) >= 0) { s_lockout_set = false; return false; }
    return true;
}

bool ble_sec_verify_pin(const char *pin)
{
    if (!pin) return false;
    if (ble_sec_pin_locked()) return false;          /* refuse while locked     */

    uint8_t h[PIN_HASH_LEN];
    pin_hash(s_nv.salt, pin, h);
    if (ct_equal(h, s_nv.hash, PIN_HASH_LEN)) {
        if (s_nv.fail_count) { s_nv.fail_count = 0; persist(); }
        s_lockout_set = false;
        return true;
    }
    if (s_nv.fail_count < 255) { s_nv.fail_count++; persist(); }
    apply_lockout();                                 /* lock after THRESHOLD     */
    return false;
}

bool ble_sec_change_pin(const char *old_pin, const char *new_pin)
{
    if (!ble_sec_verify_pin(old_pin)) return false;  /* counts failures + locks  */
    if (!new_pin) return false;
    for (int i = 0; i < PIN_LEN; i++)                /* must be 6 digits         */
        if (new_pin[i] < '0' || new_pin[i] > '9') return false;
    if (new_pin[PIN_LEN] != '\0') return false;

    store_pin(new_pin, false);           /* new salt+hash; §2: is_initialized=1  */
    s_nv.fail_count = 0; s_lockout_set = false; persist();
    ble_sec_close_pairing_window();      /* §2: safely close the pairing window  */
    return true;
}

void ble_sec_reset_pin_to_default(void)
{
    store_pin(DEFAULT_PIN, true);        /* salt+hash of default; is_initialized=0 */
    s_nv.fail_count = 0; s_lockout_set = false; persist();
}

/* ---- RM-01 remote-learning authorisation ------------------------------ */
void ble_sec_authorise_remote(uint32_t serial, uint32_t ttl_ms)
{
    s_auth_serial = serial & 0x0FFFFFFFu;
    s_auth_until  = hal_millis() + ttl_ms;
    s_auth_active = true;
}

bool ble_sec_remote_is_authorised(uint32_t serial)
{
    if (!s_auth_active) return false;
    if ((int32_t)(hal_millis() - s_auth_until) >= 0) return false;
    return (s_auth_serial == 0) || (s_auth_serial == (serial & 0x0FFFFFFFu));
}

bool ble_sec_learn_window_open(void)
{
    return s_auth_active && (int32_t)(hal_millis() - s_auth_until) < 0;
}

void ble_sec_clear_authorisation(void) { s_auth_active = false; }

/* ---- connection events ------------------------------------------------ */
void ble_sec_on_connected(void)
{
    s_connected = true;
    led_set(LED_FLASH_SUCCESS);              /* SW-02: 2 s flash on success     */
    /* SW-03 is enforced in the DP handler: until the PIN is changed away from
     * the default, all control DPs are rejected (see app_main.c).            */
}

void ble_sec_on_disconnected(void)
{
    s_connected = false;
    if (s_window_open) led_set(LED_SOLID); else led_set(LED_OFF);
}
