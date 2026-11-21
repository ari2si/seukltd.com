/**
 * @file  led.h
 * @brief Status LED-strip patterns (spec §6 + SW-02 feedback).
 */
#ifndef LED_H
#define LED_H

typedef enum {
    LED_OFF = 0,
    LED_SOLID,          /* §6: solid ON while the 3-min pairing window is open */
    LED_MOVING,         /* §6: actuator moving — 0.5 s ON / 1.0 s OFF          */
    LED_FAULT,          /* §6: fault / low battery — 0.2 s ON / 0.2 s OFF      */
    LED_FLASH_SUCCESS,  /* SW-02: 2 s flash burst on a successful action       */
    LED_BLINK_SLOW,     /* idle heartbeat                                      */
} led_pattern_t;

void          led_init(void);
void          led_set(led_pattern_t pattern);
led_pattern_t led_get(void);
void          led_task(void);   /* call from the main loop; non-blocking     */

#endif /* LED_H */
