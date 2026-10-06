/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TraceNode, TraceEdge, CIPEvent, ReceivingKDE, TransformationKDE, ShippingKDE } from '../types/traceability';

export const FDA_RECALL_BASELINE = {
  recallNumber: 'F-1892-2024',
  classification: 'Class I',
  reason: 'Product tested positive for Listeria monocytogenes from environmental swab cross-contamination on harvest knife assembly.',
  commodity: 'Romaine Lettuce in Pre-Packaged Salad Kits',
  regulatoryCitation: '21 CFR Part 1 Subpart S (FSMA 204.1315)',
  openFdaApiSource: 'https://api.fda.gov/food/enforcement.json?search=classification:"Class+I"',
  suspectLotId: 'LOT-ROMAINE-101',
  sampleDate: '2026-10-02T06:30:00Z',
  firmName: 'Salinas Valley Greens LLC',
  distributionPattern: 'Distributed to fresh-cut processors and multi-state distribution centers.'
};

export const CIP_RECORD: CIPEvent = {
  id: 'CIP-EVT-20261002-L1',
  lineId: 'PROCESSING_LINE_1',
  facilityGln: 'urn:epc:id:sgln:0860004.00001.0',
  facilityName: 'Pacific Coast Fresh Foods - Facility #4',
  startTime: '2026-10-02T11:30:00Z',
  endTime: '2026-10-02T12:30:00Z',
  protocol: 'CIP-4-STAGE-RTE (Caustic Pre-Rinse + PAA Sanitize + Dwell)',
  operatorId: 'SAN-TECH-884 (M. Vance / Lead Cert)',
  chemicalUsed: 'Peracetic Acid (PAA) + Sterile Reverse-Osmosis Rinse',
  chemicalPpm: 210, // Target 150-250 ppm
  washTemperatureC: 68,
  atpSwabRLU: 8, // < 25 RLU is verified clean
  validated: true,
  notes: 'Full teardown of flume nozzles, centrifugal de-waterer, shredder blades, and weigh bucket. ATP bioluminescence swab: 8 RLU (PASS). Visual heel inspection: 0% residual biological matter.'
};

export const INITIAL_NODES: TraceNode[] = [
  // --- GROWERS / FARMS (Tier 1) ---
  {
    id: 'LOT-ROMAINE-101',
    label: 'Romaine Lot R-101 (Salinas)',
    type: 'farm_lot',
    facilityGln: 'urn:epc:id:sgln:0860001.00010.0',
    facilityName: 'Salinas Valley Greens (Field 4A)',
    tier: 'grower',
    commodity: 'Romaine Lettuce (FTL)',
    quantity: 12000,
    unitOfMeasure: 'LBS',
    timestamp: '2026-10-01T06:00:00Z',
    status: 'root_cause',
    tlcSourceGln: 'urn:epc:id:sgln:0860001.00010.0',
    tlcSourceName: 'Salinas Valley Greens',
    referenceDocType: 'HARVEST_LOG',
    referenceDocNumber: 'HL-2026-0941',
    pathogenRisk: 'POSITIVE: Listeria monocytogenes (CFU detected in field swab)',
    details: {
      harvestGPS: '36.6777° N, 121.6555° W',
      coolingTimestampUtc: '2026-10-01T08:15:00Z',
      coolingTempC: 2.8,
      soilAmendments: 'Composted Poultry - Batch 44-A (Verified Treated)'
    }
  },
  {
    id: 'LOT-ROMAINE-102',
    label: 'Romaine Lot R-102 (Yuma)',
    type: 'farm_lot',
    facilityGln: 'urn:epc:id:sgln:0860002.00020.0',
    facilityName: 'Yuma Valley Organics (Ranch 9)',
    tier: 'grower',
    commodity: 'Romaine Lettuce (FTL)',
    quantity: 10500,
    unitOfMeasure: 'LBS',
    timestamp: '2026-10-01T07:30:00Z',
    status: 'clean',
    tlcSourceGln: 'urn:epc:id:sgln:0860002.00020.0',
    tlcSourceName: 'Yuma Valley Organics',
    referenceDocType: 'HARVEST_LOG',
    referenceDocNumber: 'HL-2026-0812',
    pathogenRisk: 'NEGATIVE: Pathogen Screen Pass',
    details: {
      harvestGPS: '32.6926° N, 114.6277° W',
      coolingTimestampUtc: '2026-10-01T09:00:00Z',
      coolingTempC: 3.1
    }
  },
  {
    id: 'LOT-SPINACH-201',
    label: 'Spinach Lot SP-201 (Imperial)',
    type: 'farm_lot',
    facilityGln: 'urn:epc:id:sgln:0860003.00030.0',
    facilityName: 'Imperial Valley Spinach Co',
    tier: 'grower',
    commodity: 'Baby Spinach (FTL)',
    quantity: 8000,
    unitOfMeasure: 'LBS',
    timestamp: '2026-10-01T08:00:00Z',
    status: 'clean',
    tlcSourceGln: 'urn:epc:id:sgln:0860003.00030.0',
    tlcSourceName: 'Imperial Valley Spinach Co',
    referenceDocType: 'HARVEST_LOG',
    referenceDocNumber: 'HL-2026-0331',
    pathogenRisk: 'NEGATIVE: Pathogen Screen Pass',
    details: {
      harvestGPS: '32.8475° N, 115.5694° W',
      coolingTimestampUtc: '2026-10-01T09:45:00Z',
      coolingTempC: 2.9
    }
  },
  {
    id: 'LOT-ROMAINE-103',
    label: 'Romaine Lot R-103 (Salinas Clean Block)',
    type: 'farm_lot',
    facilityGln: 'urn:epc:id:sgln:0860001.00010.0',
    facilityName: 'Salinas Valley Greens (Field 7B)',
    tier: 'grower',
    commodity: 'Romaine Lettuce (FTL)',
    quantity: 14000,
    unitOfMeasure: 'LBS',
    timestamp: '2026-10-02T05:00:00Z',
    status: 'clean',
    tlcSourceGln: 'urn:epc:id:sgln:0860001.00010.0',
    tlcSourceName: 'Salinas Valley Greens',
    referenceDocType: 'HARVEST_LOG',
    referenceDocNumber: 'HL-2026-0955',
    pathogenRisk: 'NEGATIVE: Zero Pathogen Detected',
    details: {
      harvestGPS: '36.6811° N, 121.6420° W',
      coolingTimestampUtc: '2026-10-02T06:30:00Z',
      coolingTempC: 3.0
    }
  },

  // --- PROCESSOR / LINE 1 (Tier 2) ---
  {
    id: 'PROC-FACILITY-PCFF',
    label: 'Line 1 Cut & Wash Plant',
    type: 'facility',
    facilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    facilityName: 'Pacific Coast Fresh Foods Plant #4',
    tier: 'processor',
    commodity: 'Ready-to-Eat Salad Processor',
    quantity: 0,
    unitOfMeasure: 'BOWLS',
    timestamp: '2026-10-02T07:00:00Z',
    status: 'neutral',
    details: {
      sqfCertification: 'Level 3 SQF #98421',
      fdaEstablishmentId: 'FEI-3004819921',
      waterChlorinePpm: 4.5,
      lineSpeedBpm: 60
    }
  },
  {
    id: 'CIP-EVT-NODE',
    label: 'Validated Clean-in-Place (CIP)',
    type: 'sanitation_event',
    facilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    facilityName: 'Pacific Coast Fresh Foods Plant #4',
    tier: 'processor',
    commodity: 'Sanitation Barrier Break',
    quantity: 0,
    unitOfMeasure: 'BOWLS',
    timestamp: '2026-10-02T12:00:00Z',
    status: 'safe_post_cip',
    cipVerified: true,
    details: {
      protocol: 'CIP-4-STAGE-RTE',
      atpSwabRLU: 8,
      chemicalPpm: 210,
      chemical: 'Peracetic Acid (PAA)',
      operator: 'SAN-TECH-884'
    }
  },
  {
    id: 'LOT-SALAD-S501',
    label: 'Salad Bowl Lot S-501 (Shift A)',
    type: 'processor_lot',
    facilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    facilityName: 'Pacific Coast Fresh Foods Plant #4',
    tier: 'processor',
    commodity: 'Romaine Salad Bowl Classic (FTL)',
    quantity: 4200,
    unitOfMeasure: 'BOWLS',
    timestamp: '2026-10-02T10:30:00Z',
    status: 'recalled',
    tlcSourceGln: 'urn:epc:id:sgln:0860004.00001.0',
    tlcSourceName: 'Pacific Coast Fresh Foods',
    referenceDocType: 'BOL',
    referenceDocNumber: 'TR-BATCH-501-A',
    pathogenRisk: 'CROSS-CONTAMINATED: Commingled with LOT-ROMAINE-101 before CIP',
    details: {
      gtin: '00850021449012',
      shift: 'Shift A (Morning)',
      packagingTime: '10:30:00 UTC',
      cleanInPlaceBarrier: 'PRODUCED BEFORE CIP SANITATION'
    }
  },
  {
    id: 'LOT-SALAD-S502',
    label: 'Salad Bowl Lot S-502 (Shift B)',
    type: 'processor_lot',
    facilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    facilityName: 'Pacific Coast Fresh Foods Plant #4',
    tier: 'processor',
    commodity: 'Romaine Salad Bowl Classic (FTL)',
    quantity: 4500,
    unitOfMeasure: 'BOWLS',
    timestamp: '2026-10-02T14:30:00Z',
    status: 'safe_post_cip',
    tlcSourceGln: 'urn:epc:id:sgln:0860004.00001.0',
    tlcSourceName: 'Pacific Coast Fresh Foods',
    referenceDocType: 'BOL',
    referenceDocNumber: 'TR-BATCH-502-B',
    pathogenRisk: 'SAFE: Produced after validated 12:00:00 CIP flush on Line 1',
    details: {
      gtin: '00850021449012',
      shift: 'Shift B (Afternoon)',
      packagingTime: '14:30:00 UTC',
      cleanInPlaceBarrier: 'CLEAN LINE CONFIRMED: 0% Cross-contamination heel'
    }
  },
  {
    id: 'LOT-SALAD-S503',
    label: 'Salad Family Pack Lot S-503 (Shift B)',
    type: 'processor_lot',
    facilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    facilityName: 'Pacific Coast Fresh Foods Plant #4',
    tier: 'processor',
    commodity: 'Salad Bowl Family Pack (FTL)',
    quantity: 3800,
    unitOfMeasure: 'BOWLS',
    timestamp: '2026-10-02T16:00:00Z',
    status: 'safe_post_cip',
    tlcSourceGln: 'urn:epc:id:sgln:0860004.00001.0',
    tlcSourceName: 'Pacific Coast Fresh Foods',
    referenceDocType: 'BOL',
    referenceDocNumber: 'TR-BATCH-503-B',
    pathogenRisk: 'SAFE: Clean line post-CIP',
    details: {
      gtin: '00850021449029',
      shift: 'Shift B (Afternoon Pack)',
      packagingTime: '16:00:00 UTC'
    }
  },

  // --- DISTRIBUTION CENTERS (Tier 3) ---
  {
    id: 'DC-NORTH-50',
    label: 'Northern Regional DC #1',
    type: 'facility',
    facilityGln: 'urn:epc:id:sgln:0860005.00050.0',
    facilityName: 'Pacific North Logistics DC',
    tier: 'distributor',
    commodity: 'Refrigerated Cold-Storage DC',
    quantity: 0,
    unitOfMeasure: 'PALLETS',
    timestamp: '2026-10-02T18:00:00Z',
    status: 'neutral',
    details: {
      location: 'Portland, OR',
      avgDockTempC: 3.4
    }
  },
  {
    id: 'DC-SOUTH-60',
    label: 'Southern Regional DC #2',
    type: 'facility',
    facilityGln: 'urn:epc:id:sgln:0860006.00060.0',
    facilityName: 'Southwest Fresh Logistics DC',
    tier: 'distributor',
    commodity: 'Refrigerated Cold-Storage DC',
    quantity: 0,
    unitOfMeasure: 'PALLETS',
    timestamp: '2026-10-02T19:30:00Z',
    status: 'neutral',
    details: {
      location: 'Ontario, CA',
      avgDockTempC: 3.2
    }
  },
  {
    id: 'PALLET-SSCC-901',
    label: 'Pallet SSCC-901 (Holding S-501)',
    type: 'shipment_pallet',
    facilityGln: 'urn:epc:id:sgln:0860005.00050.0',
    facilityName: 'In-Transit to North DC',
    tier: 'distributor',
    commodity: 'Pallet of 4,200 Bowls (S-501)',
    quantity: 4200,
    unitOfMeasure: 'BOWLS',
    timestamp: '2026-10-02T19:00:00Z',
    status: 'recalled',
    referenceDocType: 'ASN',
    referenceDocNumber: 'ASN-PCFF-2026-441',
    details: {
      sscc: '001086000490100012',
      trailerId: 'REEFER-TR-401',
      reeferTempAvgC: 3.6
    }
  },
  {
    id: 'PALLET-SSCC-902',
    label: 'Pallet SSCC-902 (Holding S-502)',
    type: 'shipment_pallet',
    facilityGln: 'urn:epc:id:sgln:0860005.00050.0',
    facilityName: 'In-Transit to North DC',
    tier: 'distributor',
    commodity: 'Pallet of 4,500 Bowls (S-502)',
    quantity: 4500,
    unitOfMeasure: 'BOWLS',
    timestamp: '2026-10-02T21:00:00Z',
    status: 'safe_post_cip',
    referenceDocType: 'ASN',
    referenceDocNumber: 'ASN-PCFF-2026-442',
    details: {
      sscc: '001086000490100029',
      trailerId: 'REEFER-TR-402',
      reeferTempAvgC: 3.4
    }
  },
  {
    id: 'PALLET-SSCC-903',
    label: 'Pallet SSCC-903 (Holding S-503)',
    type: 'shipment_pallet',
    facilityGln: 'urn:epc:id:sgln:0860006.00060.0',
    facilityName: 'In-Transit to South DC',
    tier: 'distributor',
    commodity: 'Pallet of 3,800 Bowls (S-503)',
    quantity: 3800,
    unitOfMeasure: 'BOWLS',
    timestamp: '2026-10-02T22:30:00Z',
    status: 'safe_post_cip',
    referenceDocType: 'ASN',
    referenceDocNumber: 'ASN-PCFF-2026-443',
    details: {
      sscc: '001086000490100036',
      trailerId: 'REEFER-TR-403',
      reeferTempAvgC: 3.1
    }
  },

  // --- RETAIL GROCERY STORES (Tier 4) ---
  {
    id: 'STORE-101-SEATTLE',
    label: 'Store #101 (Seattle, WA)',
    type: 'retail_store',
    facilityGln: 'urn:epc:id:sgln:0860007.00101.0',
    facilityName: 'Metro Market Seattle',
    tier: 'retail',
    commodity: 'Retail Fresh Produce Shelf',
    quantity: 2100,
    unitOfMeasure: 'BOWLS',
    timestamp: '2026-10-03T05:00:00Z',
    status: 'recalled',
    referenceDocType: 'BOL',
    referenceDocNumber: 'BOL-ND-8810',
    pathogenRisk: 'SURGICAL RECALL TARGET: Stocking S-501',
    details: {
      receivedLot: 'LOT-SALAD-S501',
      storeManager: 'K. Jensen',
      shelfDisplayLocation: 'Aisle 1 - Grab & Go RTE'
    }
  },
  {
    id: 'STORE-102-PORTLAND',
    label: 'Store #102 (Portland, OR)',
    type: 'retail_store',
    facilityGln: 'urn:epc:id:sgln:0860007.00102.0',
    facilityName: 'Cascadia Grocers Portland',
    tier: 'retail',
    commodity: 'Retail Fresh Produce Shelf',
    quantity: 2100,
    unitOfMeasure: 'BOWLS',
    timestamp: '2026-10-03T06:15:00Z',
    status: 'recalled',
    referenceDocType: 'BOL',
    referenceDocNumber: 'BOL-ND-8811',
    pathogenRisk: 'SURGICAL RECALL TARGET: Stocking S-501',
    details: {
      receivedLot: 'LOT-SALAD-S501',
      storeManager: 'D. Miller',
      shelfDisplayLocation: 'Chilled Deli Section'
    }
  },
  {
    id: 'STORE-103-BOISE',
    label: 'Store #103 (Boise, ID)',
    type: 'retail_store',
    facilityGln: 'urn:epc:id:sgln:0860007.00103.0',
    facilityName: 'Mountain Fresh Boise',
    tier: 'retail',
    commodity: 'Retail Fresh Produce Shelf',
    quantity: 4500,
    unitOfMeasure: 'BOWLS',
    timestamp: '2026-10-03T07:45:00Z',
    status: 'safe_post_cip',
    referenceDocType: 'BOL',
    referenceDocNumber: 'BOL-ND-8812',
    pathogenRisk: 'SAFE: Received only post-CIP clean lot S-502',
    details: {
      receivedLot: 'LOT-SALAD-S502',
      storeManager: 'R. Davis'
    }
  },
  {
    id: 'STORE-201-LA',
    label: 'Store #201 (Los Angeles, CA)',
    type: 'retail_store',
    facilityGln: 'urn:epc:id:sgln:0860008.00201.0',
    facilityName: 'Coastal Harvest Los Angeles',
    tier: 'retail',
    commodity: 'Retail Fresh Produce Shelf',
    quantity: 1900,
    unitOfMeasure: 'BOWLS',
    timestamp: '2026-10-03T06:30:00Z',
    status: 'safe_post_cip',
    referenceDocType: 'BOL',
    referenceDocNumber: 'BOL-SD-9901',
    pathogenRisk: 'SAFE: Received post-CIP clean lot S-503',
    details: {
      receivedLot: 'LOT-SALAD-S503',
      storeManager: 'A. Chen'
    }
  },
  {
    id: 'STORE-202-SANDIEGO',
    label: 'Store #202 (San Diego, CA)',
    type: 'retail_store',
    facilityGln: 'urn:epc:id:sgln:0860008.00202.0',
    facilityName: 'Pacific Rim Market San Diego',
    tier: 'retail',
    commodity: 'Retail Fresh Produce Shelf',
    quantity: 1900,
    unitOfMeasure: 'BOWLS',
    timestamp: '2026-10-03T07:00:00Z',
    status: 'safe_post_cip',
    referenceDocType: 'BOL',
    referenceDocNumber: 'BOL-SD-9902',
    pathogenRisk: 'SAFE: Received post-CIP clean lot S-503',
    details: {
      receivedLot: 'LOT-SALAD-S503',
      storeManager: 'E. Morales'
    }
  },
  {
    id: 'STORE-203-PHOENIX',
    label: 'Store #203 (Phoenix, AZ)',
    type: 'retail_store',
    facilityGln: 'urn:epc:id:sgln:0860008.00203.0',
    facilityName: 'Desert Sun Organic Phoenix',
    tier: 'retail',
    commodity: 'Retail Fresh Produce Shelf',
    quantity: 0,
    unitOfMeasure: 'BOWLS',
    timestamp: '2026-10-03T08:30:00Z',
    status: 'safe_post_cip',
    referenceDocType: 'BOL',
    referenceDocNumber: 'BOL-SD-9903',
    pathogenRisk: 'SAFE: Scheduled shipment isolated',
    details: {
      receivedLot: 'SCHEDULED_SPLIT',
      storeManager: 'T. Wright'
    }
  }
];

export const INITIAL_EDGES: TraceEdge[] = [
  // Shift A Commingling into S-501 (Tainted path)
  {
    id: 'E-R101-S501',
    source: 'LOT-ROMAINE-101',
    target: 'LOT-SALAD-S501',
    type: 'COMMINGLED_INTO',
    timestamp: '2026-10-02T08:30:00Z',
    activeContaminationPath: true,
    notes: 'Shift A blend: 12,000 lbs contaminated Romaine fed into flume wash hopper.'
  },
  {
    id: 'E-R102-S501',
    source: 'LOT-ROMAINE-102',
    target: 'LOT-SALAD-S501',
    type: 'COMMINGLED_INTO',
    timestamp: '2026-10-02T09:15:00Z',
    activeContaminationPath: true,
    notes: 'Shift A blend: 10,500 lbs Yuma Romaine commingled on same line.'
  },
  {
    id: 'E-SP201-S501',
    source: 'LOT-SPINACH-201',
    target: 'LOT-SALAD-S501',
    type: 'COMMINGLED_INTO',
    timestamp: '2026-10-02T09:45:00Z',
    activeContaminationPath: true,
    notes: 'Shift A blend: 8,000 lbs Baby Spinach commingled into finished salad.'
  },

  // Sanitation boundary between Shift A and Shift B
  {
    id: 'E-S501-CIP',
    source: 'LOT-SALAD-S501',
    target: 'CIP-EVT-NODE',
    type: 'PROCESSED_AFTER_CIP',
    timestamp: '2026-10-02T11:30:00Z',
    activeContaminationPath: false,
    notes: 'Shift A ends. Line halts for full 4-stage CIP wash and sanitization.'
  },
  {
    id: 'E-CIP-S502',
    source: 'CIP-EVT-NODE',
    target: 'LOT-SALAD-S502',
    type: 'PROCESSED_AFTER_CIP',
    timestamp: '2026-10-02T12:30:00Z',
    activeContaminationPath: false,
    notes: 'CIP complete (8 RLU swab). Shift B begins on verified clean line.'
  },

  // Shift B clean processing
  {
    id: 'E-R103-S502',
    source: 'LOT-ROMAINE-103',
    target: 'LOT-SALAD-S502',
    type: 'TRANSFORMED_INTO',
    timestamp: '2026-10-02T13:30:00Z',
    activeContaminationPath: false,
    notes: 'Shift B clean transformation: 14,000 lbs Salinas Block 7B into S-502 & S-503.'
  },
  {
    id: 'E-R103-S503',
    source: 'LOT-ROMAINE-103',
    target: 'LOT-SALAD-S503',
    type: 'TRANSFORMED_INTO',
    timestamp: '2026-10-02T15:00:00Z',
    activeContaminationPath: false,
    notes: 'Shift B clean transformation into family pack bowls.'
  },

  // Processor to Pallet Aggregation
  {
    id: 'E-S501-P901',
    source: 'LOT-SALAD-S501',
    target: 'PALLET-SSCC-901',
    type: 'PACKED_INTO',
    timestamp: '2026-10-02T11:00:00Z',
    activeContaminationPath: true,
    notes: 'Packed 4,200 bowls of S-501 onto Pallet SSCC-901.'
  },
  {
    id: 'E-S502-P902',
    source: 'LOT-SALAD-S502',
    target: 'PALLET-SSCC-902',
    type: 'PACKED_INTO',
    timestamp: '2026-10-02T15:30:00Z',
    activeContaminationPath: false,
    notes: 'Packed 4,500 bowls of clean S-502 onto Pallet SSCC-902.'
  },
  {
    id: 'E-S503-P903',
    source: 'LOT-SALAD-S503',
    target: 'PALLET-SSCC-903',
    type: 'PACKED_INTO',
    timestamp: '2026-10-02T17:00:00Z',
    activeContaminationPath: false,
    notes: 'Packed 3,800 bowls of clean S-503 onto Pallet SSCC-903.'
  },

  // Pallet to DC
  {
    id: 'E-P901-DCNORTH',
    source: 'PALLET-SSCC-901',
    target: 'DC-NORTH-50',
    type: 'SHIPPED_TO',
    timestamp: '2026-10-02T19:30:00Z',
    activeContaminationPath: true,
    notes: 'Reefer Trailer 401 delivers SSCC-901 to Northern DC.'
  },
  {
    id: 'E-P902-DCNORTH',
    source: 'PALLET-SSCC-902',
    target: 'DC-NORTH-50',
    type: 'SHIPPED_TO',
    timestamp: '2026-10-02T21:30:00Z',
    activeContaminationPath: false,
    notes: 'Reefer Trailer 402 delivers clean SSCC-902 to Northern DC.'
  },
  {
    id: 'E-P903-DCSOUTH',
    source: 'PALLET-SSCC-903',
    target: 'DC-SOUTH-60',
    type: 'SHIPPED_TO',
    timestamp: '2026-10-02T23:00:00Z',
    activeContaminationPath: false,
    notes: 'Reefer Trailer 403 delivers clean SSCC-903 to Southern DC.'
  },

  // DC to Stores (Delivery of S-501 - Affected)
  {
    id: 'E-DCNORTH-S101',
    source: 'DC-NORTH-50',
    target: 'STORE-101-SEATTLE',
    type: 'SHIPPED_TO',
    timestamp: '2026-10-03T04:30:00Z',
    activeContaminationPath: true,
    notes: 'Dispatch 2,100 bowls of S-501 to Seattle Store #101.'
  },
  {
    id: 'E-DCNORTH-S102',
    source: 'DC-NORTH-50',
    target: 'STORE-102-PORTLAND',
    type: 'SHIPPED_TO',
    timestamp: '2026-10-03T05:45:00Z',
    activeContaminationPath: true,
    notes: 'Dispatch 2,100 bowls of S-501 to Portland Store #102.'
  },

  // DC to Stores (Delivery of S-502 & S-503 - Safe Post-CIP)
  {
    id: 'E-DCNORTH-S103',
    source: 'DC-NORTH-50',
    target: 'STORE-103-BOISE',
    type: 'SHIPPED_TO',
    timestamp: '2026-10-03T07:15:00Z',
    activeContaminationPath: false,
    notes: 'Dispatch 4,500 bowls of clean S-502 to Boise Store #103.'
  },
  {
    id: 'E-DCSOUTH-S201',
    source: 'DC-SOUTH-60',
    target: 'STORE-201-LA',
    type: 'SHIPPED_TO',
    timestamp: '2026-10-03T06:00:00Z',
    activeContaminationPath: false,
    notes: 'Dispatch 1,900 bowls of clean S-503 to LA Store #201.'
  },
  {
    id: 'E-DCSOUTH-S202',
    source: 'DC-SOUTH-60',
    target: 'STORE-202-SANDIEGO',
    type: 'SHIPPED_TO',
    timestamp: '2026-10-03T06:30:00Z',
    activeContaminationPath: false,
    notes: 'Dispatch 1,900 bowls of clean S-503 to San Diego Store #202.'
  }
];

// 21 CFR § 1.1335 Receiving KDE records
export const RECEIVING_KDES: ReceivingKDE[] = [
  {
    tlc: 'LOT-ROMAINE-101',
    commodity: 'Romaine Lettuce (FTL)',
    quantity: 12000,
    unit: 'LBS',
    dateReceivedUtc: '2026-10-01T14:30:00Z',
    receivingFacilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    receivingFacilityName: 'Pacific Coast Fresh Foods Plant #4',
    tlcSourceGln: 'urn:epc:id:sgln:0860001.00010.0',
    tlcSourceName: 'Salinas Valley Greens (Field 4A)',
    tlcSourceRefDocType: 'Bill of Lading (BOL)',
    tlcSourceRefDocNumber: 'BOL-SVG-2026-9041',
    lotLocationDescription: 'Cooler Room Bay 2 (Target 2-4°C)',
    pathogenStatus: 'ALERT: Class I Recall Origin (Listeria monocytogenes)'
  },
  {
    tlc: 'LOT-ROMAINE-102',
    commodity: 'Romaine Lettuce (FTL)',
    quantity: 10500,
    unit: 'LBS',
    dateReceivedUtc: '2026-10-01T15:15:00Z',
    receivingFacilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    receivingFacilityName: 'Pacific Coast Fresh Foods Plant #4',
    tlcSourceGln: 'urn:epc:id:sgln:0860002.00020.0',
    tlcSourceName: 'Yuma Valley Organics (Ranch 9)',
    tlcSourceRefDocType: 'Bill of Lading (BOL)',
    tlcSourceRefDocNumber: 'BOL-YVO-2026-8819',
    lotLocationDescription: 'Cooler Room Bay 3 (Target 2-4°C)',
    pathogenStatus: 'NEGATIVE (Clean Inbound)'
  },
  {
    tlc: 'LOT-SPINACH-201',
    commodity: 'Baby Spinach (FTL)',
    quantity: 8000,
    unit: 'LBS',
    dateReceivedUtc: '2026-10-01T16:00:00Z',
    receivingFacilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    receivingFacilityName: 'Pacific Coast Fresh Foods Plant #4',
    tlcSourceGln: 'urn:epc:id:sgln:0860003.00030.0',
    tlcSourceName: 'Imperial Valley Spinach Co',
    tlcSourceRefDocType: 'Purchase Order (PO)',
    tlcSourceRefDocNumber: 'PO-IVS-2026-3392',
    lotLocationDescription: 'Cooler Room Bay 1 (Target 2-4°C)',
    pathogenStatus: 'NEGATIVE (Clean Inbound)'
  },
  {
    tlc: 'LOT-ROMAINE-103',
    commodity: 'Romaine Lettuce (FTL)',
    quantity: 14000,
    unit: 'LBS',
    dateReceivedUtc: '2026-10-02T08:00:00Z',
    receivingFacilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    receivingFacilityName: 'Pacific Coast Fresh Foods Plant #4',
    tlcSourceGln: 'urn:epc:id:sgln:0860001.00010.0',
    tlcSourceName: 'Salinas Valley Greens (Field 7B)',
    tlcSourceRefDocType: 'Bill of Lading (BOL)',
    tlcSourceRefDocNumber: 'BOL-SVG-2026-9055',
    lotLocationDescription: 'Cooler Room Bay 4 (Target 2-4°C)',
    pathogenStatus: 'NEGATIVE (Clean Inbound)'
  }
];

// 21 CFR § 1.1340 Transformation KDE records (Exploded multi-row format matching FDA template)
export const TRANSFORMATION_KDES: TransformationKDE[] = [
  // Shift A: 3 input TLCs exploded for LOT-SALAD-S501
  {
    transformationEventId: 'TR-EVT-20261002-001',
    facilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    facilityName: 'Pacific Coast Fresh Foods Plant #4',
    lineId: 'LINE-1-RTE',
    transformationDateTimeUtc: '2026-10-02T10:30:00Z',
    inputTlc: 'LOT-ROMAINE-101',
    inputCommodity: 'Romaine Lettuce',
    inputQuantity: 4000,
    inputUnit: 'LBS',
    outputTlc: 'LOT-SALAD-S501',
    outputCommodity: 'Romaine Salad Bowl Classic (FTL)',
    outputQuantity: 4200,
    outputUnit: 'BOWLS',
    cleanInPlaceVerified: false,
    shift: 'Shift A (08:00 - 11:30 UTC)'
  },
  {
    transformationEventId: 'TR-EVT-20261002-001',
    facilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    facilityName: 'Pacific Coast Fresh Foods Plant #4',
    lineId: 'LINE-1-RTE',
    transformationDateTimeUtc: '2026-10-02T10:30:00Z',
    inputTlc: 'LOT-ROMAINE-102',
    inputCommodity: 'Romaine Lettuce',
    inputQuantity: 3500,
    inputUnit: 'LBS',
    outputTlc: 'LOT-SALAD-S501',
    outputCommodity: 'Romaine Salad Bowl Classic (FTL)',
    outputQuantity: 4200,
    outputUnit: 'BOWLS',
    cleanInPlaceVerified: false,
    shift: 'Shift A (08:00 - 11:30 UTC)'
  },
  {
    transformationEventId: 'TR-EVT-20261002-001',
    facilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    facilityName: 'Pacific Coast Fresh Foods Plant #4',
    lineId: 'LINE-1-RTE',
    transformationDateTimeUtc: '2026-10-02T10:30:00Z',
    inputTlc: 'LOT-SPINACH-201',
    inputCommodity: 'Baby Spinach',
    inputQuantity: 2500,
    inputUnit: 'LBS',
    outputTlc: 'LOT-SALAD-S501',
    outputCommodity: 'Romaine Salad Bowl Classic (FTL)',
    outputQuantity: 4200,
    outputUnit: 'BOWLS',
    cleanInPlaceVerified: false,
    shift: 'Shift A (08:00 - 11:30 UTC)'
  },

  // Shift B: After 12:00 UTC CIP sanitation break on Line 1
  {
    transformationEventId: 'TR-EVT-20261002-002',
    facilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    facilityName: 'Pacific Coast Fresh Foods Plant #4',
    lineId: 'LINE-1-RTE',
    transformationDateTimeUtc: '2026-10-02T14:30:00Z',
    inputTlc: 'LOT-ROMAINE-103',
    inputCommodity: 'Romaine Lettuce (Clean Field 7B)',
    inputQuantity: 7000,
    inputUnit: 'LBS',
    outputTlc: 'LOT-SALAD-S502',
    outputCommodity: 'Romaine Salad Bowl Classic (FTL)',
    outputQuantity: 4500,
    outputUnit: 'BOWLS',
    cleanInPlaceVerified: true,
    shift: 'Shift B (Post-CIP 12:00:00 UTC Break)'
  },
  {
    transformationEventId: 'TR-EVT-20261002-003',
    facilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    facilityName: 'Pacific Coast Fresh Foods Plant #4',
    lineId: 'LINE-1-RTE',
    transformationDateTimeUtc: '2026-10-02T16:00:00Z',
    inputTlc: 'LOT-ROMAINE-103',
    inputCommodity: 'Romaine Lettuce (Clean Field 7B)',
    inputQuantity: 6000,
    inputUnit: 'LBS',
    outputTlc: 'LOT-SALAD-S503',
    outputCommodity: 'Salad Bowl Family Pack (FTL)',
    outputQuantity: 3800,
    outputUnit: 'BOWLS',
    cleanInPlaceVerified: true,
    shift: 'Shift B (Post-CIP 12:00:00 UTC Break)'
  }
];

// 21 CFR § 1.1345 Shipping KDE records
export const SHIPPING_KDES: ShippingKDE[] = [
  {
    shippedTlc: 'LOT-SALAD-S501',
    commodity: 'Romaine Salad Bowl Classic (FTL)',
    quantityShipped: 4200,
    unit: 'BOWLS',
    shipmentDateUtc: '2026-10-02T18:30:00Z',
    shippingFacilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    shippingFacilityName: 'Pacific Coast Fresh Foods Plant #4',
    consigneeGln: 'urn:epc:id:sgln:0860005.00050.0',
    consigneeName: 'Pacific North Logistics DC',
    carrierName: 'ColdWay Express Logistics',
    billOfLading: 'BOL-PCFF-99401',
    trailerAssetId: 'REEFER-TR-401',
    destinationCity: 'Portland, OR'
  },
  {
    shippedTlc: 'LOT-SALAD-S501',
    commodity: 'Romaine Salad Bowl Classic (FTL)',
    quantityShipped: 2100,
    unit: 'BOWLS',
    shipmentDateUtc: '2026-10-03T04:30:00Z',
    shippingFacilityGln: 'urn:epc:id:sgln:0860005.00050.0',
    shippingFacilityName: 'Pacific North Logistics DC',
    consigneeGln: 'urn:epc:id:sgln:0860007.00101.0',
    consigneeName: 'Metro Market Seattle',
    carrierName: 'Northwest Local Drayage',
    billOfLading: 'BOL-ND-8810',
    trailerAssetId: 'REEFER-LOCAL-12',
    destinationCity: 'Seattle, WA'
  },
  {
    shippedTlc: 'LOT-SALAD-S501',
    commodity: 'Romaine Salad Bowl Classic (FTL)',
    quantityShipped: 2100,
    unit: 'BOWLS',
    shipmentDateUtc: '2026-10-03T05:45:00Z',
    shippingFacilityGln: 'urn:epc:id:sgln:0860005.00050.0',
    shippingFacilityName: 'Pacific North Logistics DC',
    consigneeGln: 'urn:epc:id:sgln:0860007.00102.0',
    consigneeName: 'Cascadia Grocers Portland',
    carrierName: 'Northwest Local Drayage',
    billOfLading: 'BOL-ND-8811',
    trailerAssetId: 'REEFER-LOCAL-14',
    destinationCity: 'Portland, OR'
  },
  {
    shippedTlc: 'LOT-SALAD-S502',
    commodity: 'Romaine Salad Bowl Classic (FTL)',
    quantityShipped: 4500,
    unit: 'BOWLS',
    shipmentDateUtc: '2026-10-02T21:00:00Z',
    shippingFacilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    shippingFacilityName: 'Pacific Coast Fresh Foods Plant #4',
    consigneeGln: 'urn:epc:id:sgln:0860005.00050.0',
    consigneeName: 'Pacific North Logistics DC',
    carrierName: 'ColdWay Express Logistics',
    billOfLading: 'BOL-PCFF-99402',
    trailerAssetId: 'REEFER-TR-402',
    destinationCity: 'Portland, OR'
  },
  {
    shippedTlc: 'LOT-SALAD-S502',
    commodity: 'Romaine Salad Bowl Classic (FTL)',
    quantityShipped: 4500,
    unit: 'BOWLS',
    shipmentDateUtc: '2026-10-03T07:15:00Z',
    shippingFacilityGln: 'urn:epc:id:sgln:0860005.00050.0',
    shippingFacilityName: 'Pacific North Logistics DC',
    consigneeGln: 'urn:epc:id:sgln:0860007.00103.0',
    consigneeName: 'Mountain Fresh Boise',
    carrierName: 'Intermountain Freight',
    billOfLading: 'BOL-ND-8812',
    trailerAssetId: 'REEFER-INTER-29',
    destinationCity: 'Boise, ID'
  },
  {
    shippedTlc: 'LOT-SALAD-S503',
    commodity: 'Salad Bowl Family Pack (FTL)',
    quantityShipped: 3800,
    unit: 'BOWLS',
    shipmentDateUtc: '2026-10-02T22:30:00Z',
    shippingFacilityGln: 'urn:epc:id:sgln:0860004.00001.0',
    shippingFacilityName: 'Pacific Coast Fresh Foods Plant #4',
    consigneeGln: 'urn:epc:id:sgln:0860006.00060.0',
    consigneeName: 'Southwest Fresh Logistics DC',
    carrierName: 'Desert Cold Fleet',
    billOfLading: 'BOL-PCFF-99403',
    trailerAssetId: 'REEFER-TR-403',
    destinationCity: 'Ontario, CA'
  }
];

// GS1 EPCIS 2.0 JSON-LD Document Sample
export const EPCIS_JSONLD_SAMPLE = {
  "@context": [
    "https://ref.gs1.org/standards/epcis/2.0.0/epcis-context.jsonld",
    {
      "fsqa": "urn:fsqa:schema:extension:"
    }
  ],
  "isA": "EPCISDocument",
  "schemaVersion": "2.0",
  "creationDate": "2026-10-02T12:35:00Z",
  "epcisHeader": {
    "epcisMasterData": {
      "vocabularyList": [
        {
          "type": "urn:epcglobal:epcis:vtype:BusinessLocation",
          "vocabularyElementList": [
            {
              "id": "urn:epc:id:sgln:0860004.00001.0",
              "attributes": [
                { "id": "cbv:facilityType", "attribute": "Fresh-Cut Ready-to-Eat Processor" },
                { "id": "cbv:addressCity", "attribute": "Salinas, CA" }
              ]
            }
          ]
        }
      ]
    }
  },
  "epcisBody": {
    "eventList": [
      {
        "type": "TransformationEvent",
        "eventTime": "2026-10-02T10:30:00Z",
        "eventTimeZoneOffset": "-07:00",
        "inputEPCList": [
          "urn:epc:id:sgtin:0860001.00010.LOT-ROMAINE-101",
          "urn:epc:id:sgtin:0860002.00020.LOT-ROMAINE-102",
          "urn:epc:id:sgtin:0860003.00030.LOT-SPINACH-201"
        ],
        "outputEPCList": [
          "urn:epc:id:sgtin:0850021.44901.LOT-SALAD-S501"
        ],
        "bizStep": "urn:epcglobal:cbv:bizstep:commissioning",
        "disposition": "urn:epcglobal:cbv:disp:in_progress",
        "readPoint": { "id": "urn:epc:id:sgln:0860004.00001.LINE1" },
        "bizLocation": { "id": "urn:epc:id:sgln:0860004.00001.0" },
        "fsqa:cleanInPlaceVerified": false,
        "fsqa:shiftId": "SHIFT_A"
      },
      {
        "type": "ObjectEvent",
        "action": "OBSERVE",
        "eventTime": "2026-10-02T12:00:00Z",
        "eventTimeZoneOffset": "-07:00",
        "epcList": [
          "urn:epc:id:line:0860004.00001.LINE1"
        ],
        "bizStep": "urn:epcglobal:cbv:bizstep:sanitizing",
        "disposition": "urn:epcglobal:cbv:disp:active",
        "bizLocation": { "id": "urn:epc:id:sgln:0860004.00001.0" },
        "fsqa:sanitationProtocol": "CIP-4-STAGE-RTE",
        "fsqa:chemicalConcentrationPpm": 210,
        "fsqa:atpSwabRLU": 8,
        "fsqa:washTemperatureC": 68,
        "fsqa:operatorId": "SAN-TECH-884",
        "fsqa:validatedPass": true
      },
      {
        "type": "TransformationEvent",
        "eventTime": "2026-10-02T14:30:00Z",
        "eventTimeZoneOffset": "-07:00",
        "inputEPCList": [
          "urn:epc:id:sgtin:0860001.00010.LOT-ROMAINE-103"
        ],
        "outputEPCList": [
          "urn:epc:id:sgtin:0850021.44901.LOT-SALAD-S502"
        ],
        "bizStep": "urn:epcglobal:cbv:bizstep:commissioning",
        "disposition": "urn:epcglobal:cbv:disp:in_progress",
        "readPoint": { "id": "urn:epc:id:sgln:0860004.00001.LINE1" },
        "bizLocation": { "id": "urn:epc:id:sgln:0860004.00001.0" },
        "fsqa:cleanInPlaceVerified": true,
        "fsqa:shiftId": "SHIFT_B"
      }
    ]
  }
};
