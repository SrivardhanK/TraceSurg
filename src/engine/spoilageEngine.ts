/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ColdChainLogPoint } from '../types/traceability';

export interface ThermalAbuseSummary {
  reeferId: string;
  totalDurationHours: number;
  thresholdTempC: number;
  peakTempC: number;
  totalDegreeHours: number;
  maxRelativeGrowthRate: number;
  quarantineTriggered: boolean;
  quarantineReason: string;
  recommendedAction: string;
}

export class SpoilageEngine {
  /**
   * Ratkowsky square-root growth model for Listeria monocytogenes:
   * sqrt(r) = b * (T - T_min)  =>  r = [b * (T - T_min)]^2
   * Parameters for Listeria:
   * T_min = -1.18°C (theoretical minimum growth temp)
   * b = 0.055 (°C^-1 hr^-0.5)
   * Baseline reference growth rate at 4.0°C:
   * r_base = [0.055 * (4.0 - (-1.18))]^2 = [0.055 * 5.18]^2 = 0.0811 hr^-1
   */
  private static readonly T_MIN = -1.18;
  private static readonly B_PARAM = 0.055;
  private static readonly T_THRESHOLD = 4.0; // 4°C FDA cold-chain limit

  /**
   * Calculates instantaneous growth rate relative to safe 4°C storage
   */
  public static calculateGrowthRate(temperatureC: number): number {
    if (temperatureC <= this.T_MIN) return 0;
    const r = Math.pow(this.B_PARAM * (temperatureC - this.T_MIN), 2);
    const r_base = Math.pow(this.B_PARAM * (this.T_THRESHOLD - this.T_MIN), 2);
    return Math.max(1.0, r / r_base);
  }

  /**
   * Simulates 24-hour IoT Reefer Telemetry with an adjustable cooling failure excursion
   */
  public static simulateReeferTelemetry(
    excursionStartHour: number = 6,
    excursionDurationHours: number = 6,
    peakExcursionTempC: number = 16.5
  ): { logs: ColdChainLogPoint[]; summary: ThermalAbuseSummary } {
    const logs: ColdChainLogPoint[] = [];
    let accumulatedDegreeHours = 0;
    let peakTemp = -999;
    let maxGrowthRatio = 1.0;

    const baseTemp = 3.2; // Normal reefer temp 3.2°C

    for (let hour = 0; hour <= 24; hour += 0.5) {
      let currentTemp = baseTemp + (Math.sin(hour * 0.8) * 0.3); // slight fluctuation
      let status: 'NORMAL' | 'REEFER_FAILURE' | 'RECOVERY' = 'NORMAL';

      const excursionEnd = excursionStartHour + excursionDurationHours;

      if (hour >= excursionStartHour && hour <= excursionEnd) {
        status = 'REEFER_FAILURE';
        // Rise towards peak
        const progress = (hour - excursionStartHour) / excursionDurationHours;
        const curve = Math.sin(progress * Math.PI); // 0 -> 1 -> 0 shape
        currentTemp = baseTemp + (peakExcursionTempC - baseTemp) * curve;
      } else if (hour > excursionEnd && hour <= excursionEnd + 3) {
        status = 'RECOVERY';
        const recoveryProgress = (hour - excursionEnd) / 3;
        currentTemp = baseTemp + (peakExcursionTempC - baseTemp) * 0.2 * (1 - recoveryProgress);
      }

      currentTemp = Math.round(currentTemp * 10) / 10;
      if (currentTemp > peakTemp) peakTemp = currentTemp;

      // Degree-Hours calculation: integral of max(0, T - T_threshold) * dt
      const dt = 0.5; // half-hour step
      const tempAboveThreshold = Math.max(0, currentTemp - this.T_THRESHOLD);
      accumulatedDegreeHours += tempAboveThreshold * dt;

      const growthRatio = Math.round(this.calculateGrowthRate(currentTemp) * 10) / 10;
      if (growthRatio > maxGrowthRatio) maxGrowthRatio = growthRatio;

      logs.push({
        timeIndexHours: hour,
        timestamp: new Date(Date.now() - (24 - hour) * 3600 * 1000).toISOString(),
        temperatureC: currentTemp,
        humidityPct: Math.round(85 + Math.random() * 8),
        latitude: 36.6 + (hour * 0.2),
        longitude: -121.6 + (hour * 0.1),
        coolingStatus: status,
        degreeHoursAccumulated: Math.round(accumulatedDegreeHours * 10) / 10,
        predictedGrowthRatio: growthRatio
      });
    }

    const DEGREE_HOURS_QUARANTINE_LIMIT = 15.0; // degree-hours threshold
    const quarantineTriggered = accumulatedDegreeHours >= DEGREE_HOURS_QUARANTINE_LIMIT || peakTemp >= 12.0;

    const summary: ThermalAbuseSummary = {
      reeferId: 'REEFER-TR-402',
      totalDurationHours: 24,
      thresholdTempC: this.T_THRESHOLD,
      peakTempC: peakTemp,
      totalDegreeHours: Math.round(accumulatedDegreeHours * 10) / 10,
      maxRelativeGrowthRate: maxGrowthRatio,
      quarantineTriggered,
      quarantineReason: quarantineTriggered
        ? `Thermal abuse excursion detected: ${accumulatedDegreeHours.toFixed(1)} degree-hours exceeded limit (${DEGREE_HOURS_QUARANTINE_LIMIT}°C·h). Peak temp ${peakTemp}°C breached 12°C critical control point.`
        : 'All telemetry within allowable HACCP cold-chain parameters.',
      recommendedAction: quarantineTriggered
        ? 'AUTOMATED [:QUARANTINED] STATUS APPLIED. Reject at receiving dock bay. Divert trailer to hold quarantine before any commingling into production flumes.'
        : 'ACCEPT INVENTORY: Maintain normal receiving CTE workflow.'
    };

    return { logs, summary };
  }

  /**
   * Continuous Stirred-Tank Reactor (CSTR) Exponential Dilution Decay
   * Equation: C(t) = C0 * exp(-t / tau)
   * where tau = V / Q (V = tank volume L, Q = rinse flow rate L/min)
   */
  public static calculateCstrDilution(
    initialPpm: number = 1000,
    tankVolumeLiters: number = 5000,
    flushRateLitersPerMin: number = 250,
    regulatoryLimitPpm: number = 5.0
  ): { timePoints: { minute: number; concentrationPpm: number; isSafe: boolean }[]; minutesToSafe: number } {
    const tau = tankVolumeLiters / flushRateLitersPerMin; // residence time in minutes
    const timePoints = [];
    let minutesToSafe = -1;

    for (let t = 0; t <= 120; t += 5) {
      const conc = initialPpm * Math.exp(-t / tau);
      const isSafe = conc <= regulatoryLimitPpm;
      if (isSafe && minutesToSafe === -1) {
        minutesToSafe = t;
      }
      timePoints.push({
        minute: t,
        concentrationPpm: Math.round(conc * 100) / 100,
        isSafe
      });
    }

    return {
      timePoints,
      minutesToSafe: minutesToSafe === -1 ? 120 : minutesToSafe
    };
  }
}
