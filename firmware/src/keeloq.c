/**
 * @file  keeloq.c
 * @brief KeeLoq cipher + rolling-code frame decode.
 *
 * The KeeLoq block cipher itself is the public, well-documented algorithm
 * (Microchip AN642 / HCS encoders). What is SECRET is only the 64-bit
 * manufacturer key (app_config.h, supplied by the factory). Nothing here
 * works without the correct key, so this file is safe to keep in source.
 *
 * >>> FACTORY MUST CONFIRM TWO THINGS <<<
 *   1. The key-derivation scheme of your encoder (Simple / Normal / Secure).
 *      The default below is "Normal learning"; swap derive_device_key() if
 *      your fobs use a different scheme.
 *   2. The exact bit order your RF capture produces in `raw_frame`. KeeLoq is
 *      transmitted LSB-first; the parser below assumes the capture has been
 *      assembled so that bit0 = first received bit (see README "RF capture").
 */
#include "keeloq.h"
#include "app_config.h"

#define KEELOQ_NLF   0x3A5C742Eu
#define BIT(x,n)     (((x) >> (n)) & 1u)
#define G5(x,a,b,c,d,e) (BIT(x,a) + BIT(x,b)*2 + BIT(x,c)*4 + BIT(x,d)*8 + BIT(x,e)*16)

/* ---- core cipher ------------------------------------------------------ */
static uint32_t keeloq_encrypt(uint32_t data, uint64_t key)
{
    uint32_t x = data;
    for (uint16_t r = 0; r < 528; r++) {
        uint32_t b = BIT(x,0) ^ BIT(x,16)
                   ^ (uint32_t)BIT(key, r & 63)
                   ^ BIT(KEELOQ_NLF, G5(x,1,9,20,26,31));
        x = (x >> 1) ^ (b << 31);
    }
    return x;
}

static uint32_t keeloq_decrypt(uint32_t data, uint64_t key)
{
    uint32_t x = data;
    for (uint16_t r = 0; r < 528; r++) {
        uint32_t b = BIT(x,31) ^ BIT(x,15)
                   ^ (uint32_t)BIT(key, (15 - r) & 63)
                   ^ BIT(KEELOQ_NLF, G5(x,0,8,19,25,30));
        x = (x << 1) ^ b;
    }
    return x;
}

/* ---- per-fob device key derivation ------------------------------------ */
/* Normal learning: derive the key from the fob serial. */
uint64_t keeloq_derive_key_normal(uint32_t serial)
{
    const uint64_t mfr = ((uint64_t)KEELOQ_MFR_KEY_HI << 32) | KEELOQ_MFR_KEY_LO;
    uint32_t s = serial & 0x0FFFFFFFu;            /* 28-bit serial            */
    uint32_t lo = keeloq_decrypt(s | 0x20000000u, mfr);
    uint32_t hi = keeloq_decrypt(s | 0x60000000u, mfr);
    return ((uint64_t)hi << 32) | lo;
}

/* Secure learning: derive the key from the 60-bit seed the fob sends during
 * learning. The two 32-bit halves of the seed are each decrypted with the
 * manufacturer key. >>> FACTORY: confirm this matches your encoder’s scheme. */
uint64_t keeloq_derive_key_secure(uint32_t seed_lo, uint32_t seed_hi)
{
    const uint64_t mfr = ((uint64_t)KEELOQ_MFR_KEY_HI << 32) | KEELOQ_MFR_KEY_LO;
    uint32_t lo = keeloq_decrypt(seed_lo, mfr);
    uint32_t hi = keeloq_decrypt(seed_hi & 0x0FFFFFFFu, mfr);
    return ((uint64_t)hi << 32) | lo;
}

uint32_t keeloq_serial_of(uint64_t raw_frame)
{
    return (uint32_t)((raw_frame >> 32) & 0x0FFFFFFFu);   /* [59:32]          */
}

/* ---- frame decode ----------------------------------------------------- */
bool keeloq_decode_with_key(uint64_t raw_frame, uint8_t nbits,
                            uint64_t device_key, keeloq_frame_t *out)
{
    if (!out) return false;
    if (nbits < 64) return false;                 /* HCS301 sends 66 bits     */

    /* Field extraction — see header notes; adjust offsets to your capture.
     * The lower 64 bits hold 32-bit hop + 28-bit serial + 4-bit buttons. The
     * extra HCS301 status bits (VLOW/RPT) sit at bit 64/65 which do not fit in
     * a 64-bit word; if you need them, widen the capture and pass them here.  */
    uint32_t hop     = (uint32_t)(raw_frame & 0xFFFFFFFFu);          /* [31:0]  */
    uint32_t serial  = (uint32_t)((raw_frame >> 32) & 0x0FFFFFFFu);  /* [59:32] */
    uint8_t  buttons = (uint8_t)((raw_frame >> 60) & 0x0Fu);         /* [63:60] */

    uint32_t dec  = keeloq_decrypt(hop, device_key);

    out->serial   = serial;
    out->counter  = (uint16_t)(dec & 0xFFFFu);
    out->buttons  = (uint8_t)((dec >> 28) & 0x0Fu);
    out->vlow     = 0;
    out->repeat   = 0;

    /* Discrimination check: the decrypted DISC field must equal the low 10
     * bits of the serial. This authenticates that the frame really came from
     * a fob holding the matching device key — the heart of replay safety.    */
    uint16_t disc = (uint16_t)((dec >> 16) & 0x3FFu);
    out->disc_ok  = (disc == (serial & 0x3FFu)) ? 1 : 0;

    /* If buttons in the fixed field and the encrypted field disagree, trust
     * the encrypted copy (the fixed field is unauthenticated).               */
    if (out->buttons == 0 && buttons != 0) out->buttons = buttons;

    return out->disc_ok != 0;
}

bool keeloq_decode(uint64_t raw_frame, uint8_t nbits, keeloq_frame_t *out)
{
    uint32_t serial = keeloq_serial_of(raw_frame);
    return keeloq_decode_with_key(raw_frame, nbits,
                                  keeloq_derive_key_normal(serial), out);
}

/* Keep the encrypt routine referenced so toolchains don't drop/ warn on it;
 * it is also useful for factory self-test vectors.                          */
uint32_t keeloq_selftest_encrypt(uint32_t d, uint64_t k) { return keeloq_encrypt(d, k); }
