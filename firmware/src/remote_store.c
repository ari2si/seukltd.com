/**
 * @file  remote_store.c
 * @brief Flash-backed table of paired fobs + rolling-code counters.
 */
#include "remote_store.h"
#include "app_config.h"
#include "board_hal.h"

#define NV_KEY_REMOTES   0x0010   /* flash KV slot for the remote table       */

static remote_record_t s_tbl[MAX_REMOTES];

static void persist(void)
{
    hal_nv_write(NV_KEY_REMOTES, s_tbl, sizeof(s_tbl));
}

void remote_store_init(void)
{
    if (!hal_nv_read(NV_KEY_REMOTES, s_tbl, sizeof(s_tbl))) {
        for (int i = 0; i < MAX_REMOTES; i++) {
            s_tbl[i].serial = 0;
            s_tbl[i].flags  = 0;
        }
        persist();
    }
}

int remote_store_find(uint32_t serial)
{
    serial &= 0x0FFFFFFFu;
    for (int i = 0; i < MAX_REMOTES; i++)
        if ((s_tbl[i].flags & REMOTE_FLAG_VALID) && s_tbl[i].serial == serial)
            return i;
    return -1;
}

int remote_store_add(uint32_t serial, bool factory)
{
    serial &= 0x0FFFFFFFu;
    int existing = remote_store_find(serial);
    if (existing >= 0) return -1;                 /* already paired           */

    for (int i = 0; i < MAX_REMOTES; i++) {
        if (!(s_tbl[i].flags & REMOTE_FLAG_VALID)) {
            s_tbl[i].serial       = serial;
            s_tbl[i].sync_counter = 0;            /* learned on first press   */
            s_tbl[i].flags        = REMOTE_FLAG_VALID |
                                    (factory ? REMOTE_FLAG_FACTORY : 0);
            persist();
            return i;
        }
    }
    return -1;                                    /* table full               */
}

bool remote_store_remove(uint32_t serial)
{
    int i = remote_store_find(serial);
    if (i < 0) return false;
    s_tbl[i].serial = 0;
    s_tbl[i].flags  = 0;
    persist();
    return true;
}

void remote_store_update_counter(int index, uint16_t counter)
{
    if (index < 0 || index >= MAX_REMOTES) return;
    s_tbl[index].sync_counter = counter;
    persist();
}

void remote_store_set_key(int index, uint64_t device_key)
{
    if (index < 0 || index >= MAX_REMOTES) return;
    s_tbl[index].device_key = device_key;
    persist();
}

void remote_store_clear_all(void)
{
    for (int i = 0; i < MAX_REMOTES; i++) {
        s_tbl[i].serial = 0;
        s_tbl[i].flags  = 0;
    }
    persist();
}

int remote_store_count(void)
{
    int n = 0;
    for (int i = 0; i < MAX_REMOTES; i++)
        if (s_tbl[i].flags & REMOTE_FLAG_VALID) n++;
    return n;
}

const remote_record_t *remote_store_get(int index)
{
    if (index < 0 || index >= MAX_REMOTES) return 0;
    return &s_tbl[index];
}
