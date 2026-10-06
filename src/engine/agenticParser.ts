/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ParsedKdeResult {
  rawText: string;
  extractedTlc: string;
  commodity: string;
  quantity: number;
  unitOfMeasure: string;
  harvestDateUtc: string;
  supplierName: string;
  rawGln: string;
  glnCheckDigitValid: boolean;
  calculatedCheckDigit: number;
  normalizedGln: string;
  referenceDocType: string;
  referenceDocNumber: string;
  complianceScore: number;
  missingElements: string[];
  epcisJsonLd: Record<string, any>;
}

export class AgenticPaperworkParser {
  /**
   * GS1 Modulo-10 Check Digit Calculation algorithm for GLN (13 digits)
   */
  public static calculateGlnCheckDigit(gln12: string): number {
    const digits = gln12.replace(/\D/g, '').slice(0, 12);
    if (digits.length < 12) return -1;

    let sum = 0;
    // For 13-digit GLN, alternating weights from right to left (excluding check digit):
    // position 12 (rightmost of 12) has weight 3, pos 11 has weight 1, pos 10 has 3, etc.
    for (let i = 0; i < 12; i++) {
      const num = parseInt(digits[i], 10);
      const weight = (i % 2 === 0) ? 1 : 3;
      sum += num * weight;
    }

    const remainder = sum % 10;
    return remainder === 0 ? 0 : 10 - remainder;
  }

  /**
   * Validates if the 13th digit of a GLN matches GS1 Modulo-10
   */
  public static validateGln(gln13: string): { isValid: boolean; calculatedDigit: number; providedDigit: number } {
    const clean = gln13.replace(/\D/g, '');
    if (clean.length !== 13) {
      return { isValid: false, calculatedDigit: -1, providedDigit: -1 };
    }

    const first12 = clean.slice(0, 12);
    const provided = parseInt(clean[12], 10);
    const calculated = this.calculateGlnCheckDigit(first12);

    return {
      isValid: calculated === provided,
      calculatedDigit: calculated,
      providedDigit: provided
    };
  }

  /**
   * Parses messy unstructured supplier paperwork (simulating Gemini 3.8 Flash extraction)
   */
  public static parseSupplierPaperwork(text: string): ParsedKdeResult {
    // Regex heuristics for realistic extraction
    const tlcMatch = text.match(/(?:LOT|BATCH|TLC)[-:\s#]*([A-Z0-9-]+)/i);
    const glnMatch = text.match(/(?:GLN|LOCATION)[-:\s#]*([0-9]{13}|urn:epc:id:sgln:[0-9.]+)/i);
    const bolMatch = text.match(/(?:BOL|B\/L|MANIFEST|PO)[-:\s#]*([A-Z0-9-]+)/i);
    const qtyMatch = text.match(/([0-9,]+)\s*(LBS|POUNDS|CASES|BOXES|CARTONS|KG)/i);
    const commodityMatch = text.match(/(ROMAINE|SPINACH|LETTUCE|CHEESE|CABBAGE|GREENS|KALE)/i);
    const supplierMatch = text.match(/(?:GROWER|SUPPLIER|FARM)[-:\s]*([A-Za-z0-9\s,.]+?)(?:\n|Date|GLN|BOL)/i);

    const extractedTlc = tlcMatch ? tlcMatch[1].trim() : 'LOT-HARVEST-UNKNOWN';
    const commodity = commodityMatch ? `${commodityMatch[1].toUpperCase()} (FTL Produce)` : 'Fresh Romaine Lettuce (FTL)';
    const quantity = qtyMatch ? parseInt(qtyMatch[1].replace(/,/g, ''), 10) : 10000;
    const uom = qtyMatch ? (qtyMatch[2].toUpperCase().startsWith('LB') ? 'LBS' : 'CASES') : 'LBS';
    const supplierName = supplierMatch ? supplierMatch[1].trim() : 'Valley Ag Suppliers Inc';

    let rawGln = glnMatch ? glnMatch[1].trim() : '0860001000109';
    let digitsOnly = rawGln.replace(/\D/g, '');
    if (digitsOnly.length < 13) {
      digitsOnly = digitsOnly.padEnd(12, '0') + '0';
    }
    const glnCheck = this.validateGln(digitsOnly);

    const missing: string[] = [];
    if (!tlcMatch) missing.push('TLC (Traceability Lot Code)');
    if (!glnMatch) missing.push('GLN (Global Location Number)');
    if (!bolMatch) missing.push('BOL / Reference Document Number');
    if (!qtyMatch) missing.push('Quantity & Unit of Measure');

    const score = Math.max(25, 100 - missing.length * 20);

    const refDoc = bolMatch ? bolMatch[1].trim() : 'BOL-MANUAL-PENDING';
    const normalizedGln = `urn:epc:id:sgln:${digitsOnly.slice(0, 7)}.${digitsOnly.slice(7, 12)}.${digitsOnly.slice(12)}`;

    // Generate canonical GS1 EPCIS 2.0 JSON-LD ObjectEvent
    const epcisJsonLd = {
      "@context": "https://ref.gs1.org/standards/epcis/2.0.0/epcis-context.jsonld",
      "type": "ObjectEvent",
      "action": "ADD",
      "bizStep": "urn:epcglobal:cbv:bizstep:receiving",
      "disposition": "urn:epcglobal:cbv:disp:in_progress",
      "eventTime": new Date().toISOString(),
      "eventTimeZoneOffset": "-07:00",
      "epcList": [`urn:epc:id:sgtin:${digitsOnly.slice(0, 7)}.00010.${extractedTlc}`],
      "bizLocation": { "id": normalizedGln },
      "quantityList": [{
        "epcClass": `urn:epc:id:pat:${commodity.split(' ')[0]}`,
        "quantity": quantity,
        "uom": uom
      }],
      "fsqa:traceabilityLotCode": extractedTlc,
      "fsqa:tlcSourceGLN": normalizedGln,
      "fsqa:referenceDocument": {
        "type": "Bill of Lading",
        "identifier": refDoc
      },
      "fsqa:inboundKdeScore": score
    };

    return {
      rawText: text,
      extractedTlc,
      commodity,
      quantity,
      unitOfMeasure: uom,
      harvestDateUtc: new Date().toISOString(),
      supplierName,
      rawGln: digitsOnly,
      glnCheckDigitValid: glnCheck.isValid,
      calculatedCheckDigit: glnCheck.calculatedDigit,
      normalizedGln,
      referenceDocType: 'Bill of Lading',
      referenceDocNumber: refDoc,
      complianceScore: score,
      missingElements: missing,
      epcisJsonLd
    };
  }
}
