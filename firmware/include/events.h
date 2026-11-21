/**
 * @file  events.h
 * @brief Tiny one-shot event channel for tamper/intrusion reporting.
 *
 * Modules post a tamper reason; app_main drains it and reports DP_TAMPER so the
 * app can alert the owner (anti-tamper push-down, or enclosure/RST opened).
 */
#ifndef EVENTS_H
#define EVENTS_H

#include <stdint.h>
#include <stdbool.h>

void events_init(void);
void events_post_tamper(uint8_t reason);     /* TAMPER_* from app_config.h     */
bool events_get_tamper(uint8_t *reason);     /* true once per posted event     */

#endif /* EVENTS_H */
