/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from 'xlsx';
import { RECEIVING_KDES, TRANSFORMATION_KDES, SHIPPING_KDES, FDA_RECALL_BASELINE, CIP_RECORD } from '../data/mockSupplyChain';

export interface FDAExportOptions {
  suspectLotId?: string;
  filterRecalledOnly?: boolean;
}

export class FDA204Exporter {
  /**
   * Generates and downloads the official 3-tab FDA Electronic Sortable Spreadsheet (.xlsx)
   * conforming to 21 CFR § 1.1315, § 1.1335, § 1.1340, and § 1.1345.
   */
  public static exportOfficialXlsx(filename: string = 'FDA_FSMA204_Electronic_Sortable_Spreadsheet.xlsx') {
    const wb = XLSX.utils.book_new();

    // 1. Audit Summary Tab
    const summaryData = [
      { Parameter: 'Regulatory Citation', Value: '21 CFR Part 1 Subpart S (§ 1.1315)' },
      { Parameter: 'Compliance Mandate', Value: 'FDA Food Traceability Rule (FSMA 204)' },
      { Parameter: 'Enforcement Deadline', Value: 'July 20, 2028 (Tier-1 Retailers Enforcing Now)' },
      { Parameter: 'Commodity Under Investigation', Value: 'Fresh-Cut Ready-to-Eat (RTE) Romaine Salad Bowls (FTL)' },
      { Parameter: 'Recall Reference Event', Value: FDA_RECALL_BASELINE.recallNumber },
      { Parameter: 'Pathogen Adulterant', Value: 'Listeria monocytogenes (CFU > 0 Zero Tolerance)' },
      { Parameter: 'Suspect Root-Cause Lot (TLC)', Value: FDA_RECALL_BASELINE.suspectLotId },
      { Parameter: 'Clean-in-Place (CIP) Validation', Value: 'VERIFIED: 12:00:00 UTC (ATP 8 RLU, PAA 210 ppm)' },
      { Parameter: 'Query Generation Turnaround', Value: '< 0.05 seconds (Sub-second vs 24-hr mandate)' },
      { Parameter: 'Export Timestamp UTC', Value: new Date().toISOString() }
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'FDA Audit Summary');

    // 2. Tab 1: Receiving KDEs (21 CFR § 1.1335)
    const receivingRows = RECEIVING_KDES.map(r => ({
      'Traceability Lot Code (TLC)': r.tlc,
      'Commodity Description': r.commodity,
      'Quantity Received': r.quantity,
      'Unit of Measure': r.unit,
      'Date/Time Received (UTC)': r.dateReceivedUtc,
      'Receiving Facility GLN': r.receivingFacilityGln,
      'Receiving Facility Name': r.receivingFacilityName,
      'TLC Source GLN (§ 1.1315)': r.tlcSourceGln,
      'TLC Source Facility Name': r.tlcSourceName,
      'TLC Source Ref Doc Type': r.tlcSourceRefDocType,
      'TLC Source Ref Doc Number': r.tlcSourceRefDocNumber,
      'Physical Storage Bay Location': r.lotLocationDescription,
      'Pathogen / Inbound Status': r.pathogenStatus
    }));
    const wsReceiving = XLSX.utils.json_to_sheet(receivingRows);
    XLSX.utils.book_append_sheet(wb, wsReceiving, 'Receiving KDEs (§ 1.1335)');

    // 3. Tab 2: Transformation KDEs (21 CFR § 1.1340)
    const transformationRows = TRANSFORMATION_KDES.map(t => ({
      'Transformation Event ID': t.transformationEventId,
      'Facility GLN': t.facilityGln,
      'Facility Name': t.facilityName,
      'Processing Line ID': t.lineId,
      'Transformation DateTime (UTC)': t.transformationDateTimeUtc,
      'Input TLC (§ 1.1340)': t.inputTlc,
      'Input Commodity': t.inputCommodity,
      'Input Quantity Used': t.inputQuantity,
      'Input Unit': t.inputUnit,
      'Output Finished TLC (§ 1.1340)': t.outputTlc,
      'Output Finished Commodity': t.outputCommodity,
      'Output Quantity Produced': t.outputQuantity,
      'Output Unit': t.outputUnit,
      'CIP Sanitation Verified': t.cleanInPlaceVerified ? 'YES (Post-Clean Line)' : 'NO (Pre-Clean Commingled)',
      'Production Shift': t.shift
    }));
    const wsTransformation = XLSX.utils.json_to_sheet(transformationRows);
    XLSX.utils.book_append_sheet(wb, wsTransformation, 'Transform KDEs (§ 1.1340)');

    // 4. Tab 3: Shipping KDEs (21 CFR § 1.1345)
    const shippingRows = SHIPPING_KDES.map(s => ({
      'Shipped TLC': s.shippedTlc,
      'Commodity Description': s.commodity,
      'Quantity Shipped': s.quantityShipped,
      'Unit of Measure': s.unit,
      'Shipment DateTime (UTC)': s.shipmentDateUtc,
      'Shipping Facility GLN': s.shippingFacilityGln,
      'Shipping Facility Name': s.shippingFacilityName,
      'Consignee GLN (§ 1.1345)': s.consigneeGln,
      'Consignee Name': s.consigneeName,
      'Carrier Name': s.carrierName,
      'Bill of Lading (BOL) #': s.billOfLading,
      'Trailer / Container Asset ID': s.trailerAssetId,
      'Destination City/State': s.destinationCity
    }));
    const wsShipping = XLSX.utils.json_to_sheet(shippingRows);
    XLSX.utils.book_append_sheet(wb, wsShipping, 'Shipping KDEs (§ 1.1345)');

    // 5. Tab 4: Clean-in-Place (CIP) Validation Record
    const cipData = [
      { Metric: 'Sanitation Event ID', Value: CIP_RECORD.id },
      { Metric: 'Line ID', Value: CIP_RECORD.lineId },
      { Metric: 'Facility GLN', Value: CIP_RECORD.facilityGln },
      { Metric: 'Sanitation Start UTC', Value: CIP_RECORD.startTime },
      { Metric: 'Sanitation Completion UTC', Value: CIP_RECORD.endTime },
      { Metric: 'Sanitation Protocol', Value: CIP_RECORD.protocol },
      { Metric: 'Chemical Titration', Value: `${CIP_RECORD.chemicalPpm} PPM (${CIP_RECORD.chemicalUsed})` },
      { Metric: 'Wash Water Temperature', Value: `${CIP_RECORD.washTemperatureC}°C` },
      { Metric: 'ATP Bioluminescence Swab', Value: `${CIP_RECORD.atpSwabRLU} RLU (PASS: < 25 RLU)` },
      { Metric: 'Certified Operator ID', Value: CIP_RECORD.operatorId },
      { Metric: 'Regulatory Boundary Verdict', Value: 'HARD STOP: Cross-contamination path severed for Shift B' },
      { Metric: 'QA Director Notes', Value: CIP_RECORD.notes }
    ];
    const wsCip = XLSX.utils.json_to_sheet(cipData);
    XLSX.utils.book_append_sheet(wb, wsCip, 'Sanitation CIP Audit');

    // Trigger download in browser
    XLSX.writeFile(wb, filename);
  }

  /**
   * Generates the Written Traceability Plan required by 21 CFR § 1.1315(a)
   */
  public static generateWrittenTraceabilityPlan(): string {
    return `# FDA FSMA RULE 204 WRITTEN TRACEABILITY PLAN
Regulation: 21 CFR § 1.1315(a) | Pacific Coast Fresh Foods Plant #4
Commodity Covered: Fresh-Cut Ready-to-Eat (RTE) Romaine Salad Bowls (Food Traceability List - FTL)

--------------------------------------------------------------------------------
1. PROCEDURES USED TO MAINTAIN RECORDS & ASSIGN TRACEABILITY LOT CODES (TLC)
--------------------------------------------------------------------------------
(a) Inbound Raw Material Receiving (§ 1.1335):
    - Upon arrival at the receiving bay, all raw materials on the Food Traceability List (FTL)
      are immediately matched with the supplier's Bill of Lading (BOL) or Advance Shipping Notice (ASN).
    - The inbound lot code assigned by the grower/packer is entered as the primary TLC.
    - If the supplier does not provide an acceptable TLC, our receiving system generates a TLC
      formatted as 'TLC-[GLN_PREFIX]-[DATE]-[SEQ]'.
    - Key Data Elements (KDEs) recorded include: Date/time received, quantity, UOM, TLC Source GLN,
      and TLC Source Reference Document type and number.

(b) Transformation & Lot Creation (§ 1.1340):
    - When raw ingredients are introduced into processing, a new finished TLC is generated at the pack stage.
    - Format: 'LOT-SALAD-S[SHIFT_CODE][SEQ]' (e.g., LOT-SALAD-S501).
    - Multi-input BOM records associate each component TLC (Romaine, Spinach, Cheese) with the output TLC.
    - Line clearance and sanitation breaks are logged as timestamped boundary events.

(c) Shipping (§ 1.1345):
    - Each finished pallet is assigned an SSCC-18 serialized barcode linked to the finished TLC.
    - Outbound shipments capture: Shipped TLC, consignee GLN, carrier name, trailer asset ID, and BOL.

--------------------------------------------------------------------------------
2. IDENTIFICATION OF TLC SOURCES & REFERENCE DOCUMENTS (§ 1.1315(a)(1))
--------------------------------------------------------------------------------
- All suppliers of FTL items are contractually required to register their Global Location Number (GLN)
  and include their GLN and Reference Document (BOL or PO) on every manifest.
- Our internal database cross-references the supplier's USDA/FDA establishment registration number.
- TLC Source GLN for Farm 1: urn:epc:id:sgln:0860001.00010.0 (Salinas Valley Greens Field 4A)
- TLC Source GLN for Farm 2: urn:epc:id:sgln:0860002.00020.0 (Yuma Valley Organics Ranch 9)
- TLC Source GLN for Farm 3: urn:epc:id:sgln:0860003.00030.0 (Imperial Valley Spinach Co)

--------------------------------------------------------------------------------
3. POINT OF CONTACT FOR TRACEABILITY QUESTIONS (§ 1.1315(a)(2))
--------------------------------------------------------------------------------
Primary FSQA Officer: Dr. Aris Thorne / Marcus Vance, Director of Plant Quality & Sanitation
Phone: +1 (831) 555-0199 | Emergency 24/7 Hotline: +1 (831) 555-0911
Email: fsqa-compliance@pacificcoastfreshfoods.example.com
Facility Address: 1400 Industrial Way, Salinas, CA 93901 (GLN: urn:epc:id:sgln:0860004.00001.0)
24-Hour Response SLA: Automated electronic sortable spreadsheet generated in < 2 seconds.

--------------------------------------------------------------------------------
4. GROWER FIELD MAPPING & HARVEST IDENTIFICATION (§ 1.1315(a)(3))
--------------------------------------------------------------------------------
- Field 4A (Salinas): GPS 36.6777° N, 121.6555° W | Water Source: Tested Well #2 (UV Disinfected)
- Field 7B (Salinas): GPS 36.6811° N, 121.6420° W | Water Source: Tested Well #1 (Deep Aquifer)
- Ranch 9 (Yuma): GPS 32.6926° N, 114.6277° W | Water Source: Deep Well A
- Field 12 (Imperial): GPS 32.8475° N, 115.5694° W | Water Source: Closed Pipe Irrigation

--------------------------------------------------------------------------------
5. CLEAN-IN-PLACE (CIP) SANITATION BOUNDARY PROTOCOL
--------------------------------------------------------------------------------
- Processing lines are sanitized between shifts or lots of differing origin under SOP-SAN-004.
- Requirements for Validated Line Clearance:
  1. Complete physical drain and visual inspection (zero residual "heel").
  2. Alkaline pre-rinse at 65°C followed by Peracetic Acid (PAA) at 150-250 ppm.
  3. Minimum dwell time: 20 minutes.
  4. Rapid ATP bioluminescence swab score MUST be < 25 RLU.
  5. Recorded into GS1 EPCIS event broker as an authorized SanitizationEvent.
`;
  }
}
