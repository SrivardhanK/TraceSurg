/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FarmPrior {
  farmId: string;
  farmName: string;
  fieldGln: string;
  commodity: string;
  historicalComplianceScore: number; // 0 to 100
  recentRainEvent: boolean;
  wildlifeIntrusionHistory: boolean;
  waterSourceType: 'DEEP_WELL_UV' | 'OPEN_CANAL' | 'TESTED_AQUIFER';
  priorContaminationProb: number; // Prior P(Contaminated)
}

export interface RetailOutbreakCluster {
  clusterId: string;
  storeName: string;
  city: string;
  casesCount: number;
  reportedPathogen: string;
  consumedFinishedLots: string[];
}

export interface BayesianAttributionResult {
  clusterId: string;
  totalSickCases: number;
  candidates: {
    farmId: string;
    farmName: string;
    commodity: string;
    priorProb: number;
    likelihood: number;
    posteriorProb: number; // Normalized P(Farm | Sick Cases)
    isMapSource: boolean; // Maximum A Posteriori
    attributionEvidence: string[];
  }[];
  mapFarmId: string;
  confidencePct: number;
  investigationGuidance: string;
}

export class BayesianTraceEngine {
  private static readonly FARMS: FarmPrior[] = [
    {
      farmId: 'LOT-ROMAINE-101',
      farmName: 'Salinas Valley Greens (Field 4A)',
      fieldGln: 'urn:epc:id:sgln:0860001.00010.0',
      commodity: 'Romaine Lettuce',
      historicalComplianceScore: 84,
      recentRainEvent: true, // Storm runoff increases pathogen risk
      wildlifeIntrusionHistory: true, // Deer activity near canal
      waterSourceType: 'OPEN_CANAL',
      priorContaminationProb: 0.18
    },
    {
      farmId: 'LOT-ROMAINE-102',
      farmName: 'Yuma Valley Organics (Ranch 9)',
      fieldGln: 'urn:epc:id:sgln:0860002.00020.0',
      commodity: 'Romaine Lettuce',
      historicalComplianceScore: 96,
      recentRainEvent: false,
      wildlifeIntrusionHistory: false,
      waterSourceType: 'DEEP_WELL_UV',
      priorContaminationProb: 0.04
    },
    {
      farmId: 'LOT-SPINACH-201',
      farmName: 'Imperial Valley Spinach Co',
      fieldGln: 'urn:epc:id:sgln:0860003.00030.0',
      commodity: 'Baby Spinach',
      historicalComplianceScore: 92,
      recentRainEvent: false,
      wildlifeIntrusionHistory: false,
      waterSourceType: 'TESTED_AQUIFER',
      priorContaminationProb: 0.06
    },
    {
      farmId: 'LOT-CHEESE-401',
      farmName: 'Sierra Foothills Creamery',
      fieldGln: 'urn:epc:id:sgln:0860010.00015.0',
      commodity: 'Shredded Asiago Cheese',
      historicalComplianceScore: 98,
      recentRainEvent: false,
      wildlifeIntrusionHistory: false,
      waterSourceType: 'DEEP_WELL_UV',
      priorContaminationProb: 0.02
    }
  ];

  /**
   * Reverse Bayesian belief propagation:
   * P(Farm_i | Cluster) = [ P(Cluster | Farm_i) * P(Farm_i) ] / Sum_j [ P(Cluster | Farm_j) * P(Farm_j) ]
   */
  public static calculateAttribution(
    sickStores: string[] = ['Store #101 Seattle', 'Store #102 Portland'],
    totalSickCases: number = 7
  ): BayesianAttributionResult {
    // Likelihood weighting based on exposure across the sick stores
    // In our scenario, Farm 1 (Salinas 101) was in 100% of the sick bowl batches
    const rawScores = this.FARMS.map((farm) => {
      let likelihood = 0.15; // baseline exposure
      const evidence: string[] = [];

      if (farm.farmId === 'LOT-ROMAINE-101') {
        likelihood = 0.92; // Romaine 101 present in all positive consumer samples
        evidence.push('Present in 100% of reported patient meal purchase logs');
        if (farm.recentRainEvent) evidence.push('Heavy storm runoff recorded 48h pre-harvest (CFR 112.43 alert)');
        if (farm.waterSourceType === 'OPEN_CANAL') evidence.push('Open agricultural water canal without secondary sanitation');
        if (farm.wildlifeIntrusionHistory) evidence.push('Documented deer ingress on adjacent parcel');
      } else if (farm.farmId === 'LOT-ROMAINE-102') {
        likelihood = 0.35;
        evidence.push('Present in 50% of suspect meals (Shift A commingled component)');
        evidence.push('UV water treatment records 100% verified nominal');
      } else if (farm.farmId === 'LOT-SPINACH-201') {
        likelihood = 0.28;
        evidence.push('Present in 40% of suspect meals');
        evidence.push('Negative pre-harvest pathogen swab certificates on file');
      } else {
        likelihood = 0.05;
        evidence.push('Finished cheese batch tested negative across 3 retain samples');
      }

      const unnormalizedPosterior = likelihood * farm.priorContaminationProb;

      return {
        farmId: farm.farmId,
        farmName: farm.farmName,
        commodity: farm.commodity,
        priorProb: farm.priorContaminationProb,
        likelihood,
        unnormalizedPosterior,
        attributionEvidence: evidence
      };
    });

    // Normalize probabilities to sum to 1.0 (100%)
    const sumUnnormalized = rawScores.reduce((acc, r) => acc + r.unnormalizedPosterior, 0);

    const candidates = rawScores.map((c) => ({
      farmId: c.farmId,
      farmName: c.farmName,
      commodity: c.commodity,
      priorProb: Math.round(c.priorProb * 1000) / 10,
      likelihood: Math.round(c.likelihood * 1000) / 10,
      posteriorProb: Math.round((c.unnormalizedPosterior / (sumUnnormalized || 1)) * 1000) / 10,
      isMapSource: false,
      attributionEvidence: c.attributionEvidence
    }));

    // Find MAP (Maximum A Posteriori)
    let mapCandidate = candidates[0];
    for (const c of candidates) {
      if (c.posteriorProb > mapCandidate.posteriorProb) {
        mapCandidate = c;
      }
    }
    mapCandidate.isMapSource = true;

    return {
      clusterId: 'OUTBREAK-CLUSTER-2026-NW',
      totalSickCases,
      candidates,
      mapFarmId: mapCandidate.farmId,
      confidencePct: mapCandidate.posteriorProb,
      investigationGuidance: `Maximum A Posteriori (MAP) probability isolates ${mapCandidate.farmName} with ${mapCandidate.posteriorProb}% confidence. Recommended action: Direct FDA CFSAN field inspectors immediately to Salinas Valley Greens Field 4A irrigation headgates rather than auditing all 4 independent suppliers simultaneously.`
    };
  }
}
