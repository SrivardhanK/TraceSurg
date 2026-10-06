/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Types conforming to GS1 EPCIS 2.0, CBV 2.0, and FDA FSMA Rule 204 (21 CFR Part 1 Subpart S)

export type NodeType = 'farm_lot' | 'processor_lot' | 'facility' | 'sanitation_event' | 'shipment_pallet' | 'retail_store';

export type NodeStatus = 'clean' | 'root_cause' | 'recalled' | 'safe_post_cip' | 'quarantined_iot' | 'neutral';

export interface TraceNode {
  id: string; // e.g., 'LOT-ROMAINE-101'
  label: string;
  type: NodeType;
  facilityGln: string;
  facilityName: string;
  tier: 'grower' | 'processor' | 'distributor' | 'retail';
  commodity: string;
  quantity: number;
  unitOfMeasure: 'LBS' | 'CASES' | 'PALLETS' | 'BOWLS' | 'PACKS' | 'JARS' | 'TUBS' | 'WHEELS';
  timestamp: string; // ISO 8601 UTC
  status: NodeStatus;
  tlcSourceGln?: string;
  tlcSourceName?: string;
  referenceDocType?: 'BOL' | 'ASN' | 'PO' | 'HARVEST_LOG' | 'SANITATION_RECORD';
  referenceDocNumber?: string;
  pathogenRisk?: string;
  cipVerified?: boolean;
  x?: number;
  y?: number;
  details?: Record<string, any>;
}

export interface TraceEdge {
  id: string;
  source: string;
  target: string;
  type: 'COMMINGLED_INTO' | 'TRANSFORMED_INTO' | 'SHIPPED_TO' | 'PACKED_INTO' | 'PROCESSED_AFTER_CIP';
  timestamp: string;
  activeContaminationPath: boolean;
  notes?: string;
}

export interface CIPEvent {
  id: string;
  lineId: string;
  facilityGln: string;
  facilityName: string;
  startTime: string; // ISO UTC
  endTime: string;   // ISO UTC
  protocol: string;  // e.g. 'CIP-4-STAGE-RTE'
  operatorId: string;
  chemicalUsed: string; // e.g. 'Peracetic Acid (PAA)'
  chemicalPpm: number;  // e.g. 210 ppm (target: 200 ppm)
  washTemperatureC: number; // e.g. 68°C
  atpSwabRLU: number;   // e.g. 8 RLU (pass limit: < 25 RLU)
  validated: boolean;
  notes: string;
}

export interface ReceivingKDE {
  tlc: string;
  commodity: string;
  quantity: number;
  unit: string;
  dateReceivedUtc: string;
  receivingFacilityGln: string;
  receivingFacilityName: string;
  tlcSourceGln: string;
  tlcSourceName: string;
  tlcSourceRefDocType: string;
  tlcSourceRefDocNumber: string;
  lotLocationDescription: string;
  pathogenStatus: string;
}

export interface TransformationKDE {
  transformationEventId: string;
  facilityGln: string;
  facilityName: string;
  lineId: string;
  transformationDateTimeUtc: string;
  inputTlc: string;
  inputCommodity: string;
  inputQuantity: number;
  inputUnit: string;
  outputTlc: string;
  outputCommodity: string;
  outputQuantity: number;
  outputUnit: string;
  cleanInPlaceVerified: boolean;
  shift: string;
}

export interface ShippingKDE {
  shippedTlc: string;
  commodity: string;
  quantityShipped: number;
  unit: string;
  shipmentDateUtc: string;
  shippingFacilityGln: string;
  shippingFacilityName: string;
  consigneeGln: string;
  consigneeName: string;
  carrierName: string;
  billOfLading: string;
  trailerAssetId: string;
  destinationCity: string;
}

export interface RecallAnalysisResult {
  suspectLotId: string;
  traversalTimeMs: number;
  mode: 'surgical' | 'blanket';
  rootCauseNodes: string[];
  recalledNodes: string[];
  safePostCipNodes: string[];
  totalInventoryUnits: number;
  recalledUnits: number;
  safeUnitsPreserved: number;
  scrapReductionPct: number;
  financialScrapLossBlanket: number;
  financialScrapLossSurgical: number;
  financialDollarsSaved: number;
  cipBoundaryEnforced: boolean;
  cipTimestamp?: string;
  cipEventDetails?: CIPEvent;
  affectedStoresCount: number;
  affectedDcsCount: number;
}

export interface ColdChainLogPoint {
  timeIndexHours: number;
  timestamp: string;
  temperatureC: number;
  humidityPct: number;
  latitude: number;
  longitude: number;
  coolingStatus: 'NORMAL' | 'REEFER_FAILURE' | 'RECOVERY';
  degreeHoursAccumulated: number;
  predictedGrowthRatio: number; // Ratkowsky model relative growth
}

export interface BenchmarkMetrics {
  eventCount: number;
  sqlLatencyMs: number;
  graphLatencyMs: number;
  speedupFactor: number;
  sqlMemoryMb: number;
  graphMemoryMb: number;
  sqlQueryComplexity: string;
  graphQueryComplexity: string;
}
