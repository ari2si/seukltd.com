/**
 * @file    remote_store.h
 * @brief   Persistent table of paired remotes + rolling-code counters.
 *
 * Implements the storage half of RM-01/02/03 and the replay protection that
 * SEC-02 relies on. Backed by the SoC flash KV store via board_hal.
 */
#ifndef REMOTE_STORE_H
#define REMOTE_STORE_H

#include <stdint.h>
#include <stdbool.h>

typedef struct {
    uint32_t serial;        /* 28-bit fob serial (0 = empty slot)            */
    uint16_t sync_counter;  /* last accepted rolling counter                 */
    uint8_t  flags;         /* bit0 = valid, bit1 = added-at-factory         */
    uint8_t  rsvd;
} remote_record_t;

#define REMOTE_FLAG_VALID    0x01
#define REMOTE_FLAG_FACTORY  0x02

void  remote_store_init(void);

/* Lookup; returns index >=0 if the serial is a paired remote, else -1.      */
int   remote_store_find(uint32_t serial);

/* Add a remote (RM-01/RM-03). Returns index, or -1 if full / already added. */
int   remote_store_add(uint32_t serial, bool factory);

/* Remove a remote by serial. Returns true if it existed.                    */
bool  remote_store_remove(uint32_t serial);

/* Update the stored rolling counter after an accepted press.                */
void  remote_store_update_counter(int index, uint16_t counter);

/* Wipe all remotes (used by a full factory reset).                          */
void  remote_store_clear_all(void);

int   remote_store_count(void);
const remote_record_t *remote_store_get(int index);

#endif /* REMOTE_STORE_H */
