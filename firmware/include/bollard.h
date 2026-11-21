/**
 * @file  bollard.h
 * @brief Actuator control: relays, stroke-limit switches, obstruction
 *        detection + auto-reversal, and battery lockout (spec §4, §5, §7, §9).
 */
#ifndef BOLLARD_H
#define BOLLARD_H

#include <stdbool.h>

typedef enum {
    BOLLARD_STOP = 0,
    BOLLARD_UP,
    BOLLARD_DOWN,
} bollard_cmd_t;

/* Status reported to the Tuya app in real time (spec §9). */
typedef enum {
    BST_LOWERED = 0,   /* resting at lower limit                              */
    BST_RAISED,        /* resting at upper limit                              */
    BST_RISING,        /* moving up                                          */
    BST_LOWERING,      /* moving down                                        */
    BST_STOPPED,       /* stopped mid-travel by command                      */
    BST_OBSTRUCTED,    /* obstruction tripped; auto-retracting               */
    BST_LOCKED,        /* UP refused — battery lockout (spec §7)             */
} bollard_status_t;

void             bollard_init(void);
void             bollard_command(bollard_cmd_t cmd);
bollard_status_t bollard_status(void);
bool             bollard_is_moving(void);
void             bollard_task(void);   /* state machine; call from main loop  */

/* True once after the reported status changes (drives the status DP).        */
bool             bollard_status_changed(void);

#endif /* BOLLARD_H */
