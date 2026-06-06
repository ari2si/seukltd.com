/**
 * @file    keeloq.h
 * @brief   KeeLoq "code hopping" decryption + decoded-frame structure.
 *
 * KeeLoq is the de-facto rolling-code scheme used by automatic-gate / bollard
 * key fobs (Microchip HCS200/300/301 encoders). A transmitted frame carries:
 *   - 32-bit encrypted "hopping" portion (counter + discrimination + buttons)
 *   - 28-bit device serial number (fixed, identifies the fob)
 *   -  4-bit button status (fixed)
 *   - status bits (VLOW, RPT)
 *
 * The receiver derives each fob's 64-bit *device key* from the secret
 * manufacturer key + the fob serial, decrypts the hopping portion, and checks
 * the embedded rolling counter against the stored window.
 */
#ifndef KEELOQ_H
#define KEELOQ_H

#include <stdint.h>
#include <stdbool.h>

typedef struct {
    uint32_t serial;       /* 28-bit fob serial number                       */
    uint16_t counter;      /* decrypted 16-bit rolling counter               */
    uint8_t  buttons;      /* 4-bit button field (FOB_BTN_*)                  */
    uint8_t  disc_ok;      /* 1 if discrimination bits matched serial low10  */
    uint8_t  vlow;         /* battery-low flag from the fob                   */
    uint8_t  repeat;       /* repeat flag (button held)                      */
} keeloq_frame_t;

/* Decrypt a raw captured frame using the manufacturer key (app_config.h).
 * Returns true and fills *out when the frame is structurally valid.          */
bool keeloq_decode(uint64_t raw_frame, uint8_t nbits, keeloq_frame_t *out);

#endif /* KEELOQ_H */
