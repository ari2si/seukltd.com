/**
 * @file  sha256.h
 * @brief Minimal SHA-256 (public-domain style) used to hash the stored PIN.
 */
#ifndef SHA256_H
#define SHA256_H

#include <stdint.h>
#include <stddef.h>

typedef struct {
    uint32_t state[8];
    uint64_t bitlen;
    uint8_t  data[64];
    uint32_t datalen;
} sha256_ctx;

void sha256_init(sha256_ctx *c);
void sha256_update(sha256_ctx *c, const uint8_t *data, size_t len);
void sha256_final(sha256_ctx *c, uint8_t out[32]);
void sha256(const uint8_t *data, size_t len, uint8_t out[32]);

#endif /* SHA256_H */
