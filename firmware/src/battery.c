/**
 * @file  battery.c
 * @brief Battery monitoring + State-of-Charge mapping (spec §7).
 */
#include "battery.h"
#include "app_config.h"
#include "board_hal.h"

#define SAMPLE_INTERVAL_MS   2000u

static uint16_t     s_mv;
static batt_state_t s_state = BATT_OK;
static batt_state_t s_last_reported = BATT_OK;
static bool         s_changed;
static uint32_t     s_next_sample;

/* Multi-point voltage->% table (spec §7). Lithium's flat curve makes a
 * piecewise-linear table far more accurate than a single linear map.
 * >>> FACTORY: refine these break-points from a real discharge test.        */
typedef struct { uint16_t mv; uint8_t pct; } soc_pt_t;
static const soc_pt_t k_soc[] = {
    { 25200, 100 },
    { 24000,  85 },
    { 22800,  70 },
    { 21000,  50 },   /* spec anchor                                          */
    { 20000,  30 },
    { 19000,  12 },
    { 18000,   0 },   /* operational floor / lockout                          */
};
#define SOC_N (sizeof(k_soc) / sizeof(k_soc[0]))

void battery_init(void)
{
    s_mv = hal_adc_read_mv(ADC_CH_BATTERY);
    s_state = s_last_reported = BATT_OK;
    s_changed = false;
    s_next_sample = 0;
}

static void recompute_state(void)
{
    batt_state_t st;
    if      (s_mv < BATT_LOCKOUT_MV) st = BATT_LOCKOUT;   /* < 18 V            */
    else if (s_mv < BATT_LOW_WARN_MV) st = BATT_LOW;      /* < 19 V            */
    else                              st = BATT_OK;

    if (st != s_state) {
        s_state   = st;
        s_changed = true;
    }
}

void battery_sample_under_load(void)
{
    /* §7: reading taken while the motor draws current avoids surface-charge
     * over-reads. Average a few samples to reject motor-noise transients.    */
    uint32_t acc = 0;
    for (int i = 0; i < 4; i++) acc += hal_adc_read_mv(ADC_CH_BATTERY);
    s_mv = (uint16_t)(acc / 4);
    recompute_state();
}

void battery_task(void)
{
    uint32_t now = hal_millis();
    if ((int32_t)(now - s_next_sample) < 0) return;
    s_next_sample = now + SAMPLE_INTERVAL_MS;

    s_mv = hal_adc_read_mv(ADC_CH_BATTERY);   /* resting sample               */
    recompute_state();
}

uint16_t battery_voltage_mv(void) { return s_mv; }

uint8_t battery_soc_percent(void)
{
    if (s_mv >= k_soc[0].mv)        return 100;
    if (s_mv <= k_soc[SOC_N-1].mv)  return 0;
    for (unsigned i = 0; i < SOC_N - 1; i++) {
        if (s_mv <= k_soc[i].mv && s_mv > k_soc[i+1].mv) {
            uint16_t hi_mv = k_soc[i].mv,   lo_mv = k_soc[i+1].mv;
            uint8_t  hi_p  = k_soc[i].pct,  lo_p  = k_soc[i+1].pct;
            uint32_t span  = hi_mv - lo_mv;
            uint32_t up    = s_mv - lo_mv;
            return (uint8_t)(lo_p + (uint32_t)(hi_p - lo_p) * up / span);
        }
    }
    return 0;
}

batt_state_t battery_state(void) { return s_state; }

bool battery_up_allowed(void) { return s_state != BATT_LOCKOUT; }   /* §7      */

bool battery_state_changed(void)
{
    if (s_state != s_last_reported || s_changed) {
        s_last_reported = s_state;
        s_changed = false;
        return true;
    }
    return false;
}
