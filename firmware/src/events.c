/**
 * @file  events.c
 * @brief One-shot tamper event channel (see events.h).
 */
#include "events.h"

static volatile uint8_t s_tamper;    /* 0 = none, else last reason             */

void events_init(void) { s_tamper = 0; }

void events_post_tamper(uint8_t reason)
{
    if (reason) s_tamper = reason;   /* last-writer-wins; drained by app_main   */
}

bool events_get_tamper(uint8_t *reason)
{
    uint8_t r = s_tamper;
    if (!r) return false;
    s_tamper = 0;
    if (reason) *reason = r;
    return true;
}
