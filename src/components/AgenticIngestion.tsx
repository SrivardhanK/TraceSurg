/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AgenticPaperworkParser, ParsedKdeResult } from '../engine/agenticParser';
import { FileText, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Code2, Copy, Check, Calculator } from 'lucide-react';

export const AgenticIngestion: React.FC = () => {
  const SAMPLE_TICKET_1 = `DELIVERY MANIFEST / HARVEST RECEIPT
GROWER: Salinas Valley Greens LLC
FIELD LOCATION: Field 4A, Salinas Valley CA
GLN: 0860001000109
DATE: 2026-10-01 06:00 UTC
LOT CODE: LOT-ROMAINE-101
COMMODITY: Fresh Romaine Lettuce (FTL)
NET WEIGHT: 12,000 LBS
COOLING: Pre-cooled to 2.8C via Hydro-vac #2
CARRIER: ColdRoute Express
BOL NUMBER: BOL-SVG-2026-9041
TRAILER: TR-994
DRIVER SIGNATURE: [Signed]`;

  const SAMPLE_TICKET_2 = `HANDWRITTEN PACKING SLIP
From: Yuma Valley Organics
To: Pacific Coast Fresh Foods Plant 4
B/L: BOL-YVO-2026-8819
Batch/Lot: LOT-ROMAINE-102
Commodity: Organic Romaine Hearts
Qty: 10,500 LBS (525 cartons)
Location Number: 0860002000208
Notes: Harvested morning shift, wash water chlorine tested 4.2 ppm.`;

  const SAMPLE_TICKET_3 = `MESSY SUPPLIER INVOICE (MISSING DATA)
Vendor: Valley Farm Co
Product: Spinach
Qty: 5000 LBS
Lot: LOT-SPIN-99
Note: Driver forgot BOL paper copy. Will email later.`;

  const [inputText, setInputText] = useState(SAMPLE_TICKET_1);
  const [parsedResult, setParsedResult] = useState<ParsedKdeResult>(() =>
    AgenticPaperworkParser.parseSupplierPaperwork(SAMPLE_TICKET_1)
  );
  const [copied, setCopied] = useState(false);

  const handleParse = (text: string) => {
    setInputText(text);
    const res = AgenticPaperworkParser.parseSupplierPaperwork(text);
    setParsedResult(res);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(parsedResult.epcisJsonLd, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mod-10 Arithmetic step decomposition
  const digits12 = parsedResult.rawGln.slice(0, 12).split('');
  const weights = [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3];
  const products = digits12.map((d, i) => parseInt(d, 10) * weights[i]);
  const sum = products.reduce((acc, p) => acc + p, 0);
  const mod = sum % 10;
  const expectedCheck = mod === 0 ? 0 : 10 - mod;

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
              OPTION D: AGENTIC ERP / PAPERWORK INGESTOR
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Unstructured Text & PDF Extraction • GS1 Mod-10 Verification
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Agentic Supplier Paperwork Ingestion Engine
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Small growers cannot afford $30k enterprise EDI integrations; they send messy packing slips and emails. TraceSurg parses unstructured supplier documents, validates GS1 GLN check-digits, and converts them directly into canonical GS1 EPCIS 2.0 JSON-LD.
          </p>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">FSMA 204 Quality Score</div>
            <div
              className={`text-2xl font-extrabold font-mono ${
                parsedResult.complianceScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {parsedResult.complianceScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 whitespace-nowrap">Load Preset Paperwork:</span>
        <button
          onClick={() => handleParse(SAMPLE_TICKET_1)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap"
        >
          Salinas Valley Delivery Manifest (Clean)
        </button>
        <button
          onClick={() => handleParse(SAMPLE_TICKET_2)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap"
        >
          Yuma Handwritten Packing Slip
        </button>
        <button
          onClick={() => handleParse(SAMPLE_TICKET_3)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap"
        >
          Messy Invoice (Missing KDEs)
        </button>
      </div>

      {/* Two Column Layout: Raw Input on Left, Extracted EPCIS on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column: Raw Document Editor */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" />
              <span>Raw Supplier Document Text / OCR Feed</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Live Parser Active</span>
          </div>

          <textarea
            rows={12}
            value={inputText}
            onChange={(e) => handleParse(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-500 leading-relaxed resize-none"
            placeholder="Paste raw supplier paperwork text here..."
          />

          {/* Missing elements alert */}
          {parsedResult.missingElements.length > 0 && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg text-xs text-red-300">
              <span className="font-bold block mb-1">Dock Receiving Warning:</span>
              Missing mandatory FSMA 204 elements: {parsedResult.missingElements.join(', ')}.
            </div>
          )}
        </div>

        {/* Right Column: Extracted KDEs & Generated EPCIS 2.0 JSON-LD */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Extracted GS1 EPCIS 2.0 Inbound ObjectEvent</span>
            </span>
            <button
              onClick={handleCopyJson}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1 font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          {/* Extracted KDE Summary Chips */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-slate-950 rounded border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">TLC (Traceability Lot):</span>
              <span className="font-mono text-white font-bold">{parsedResult.extractedTlc}</span>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Quantity & UOM:</span>
              <span className="font-mono text-white font-bold">{parsedResult.quantity.toLocaleString()} {parsedResult.unitOfMeasure}</span>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">GS1 Mod-10 Check Digit:</span>
              <span className={`font-mono font-bold ${parsedResult.glnCheckDigitValid ? 'text-emerald-400' : 'text-amber-400'}`}>
                {parsedResult.glnCheckDigitValid ? 'VALID (MATCH)' : `Calculated: ${parsedResult.calculatedCheckDigit}`}
              </span>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Reference Doc (BOL):</span>
              <span className="font-mono text-amber-300 font-bold">{parsedResult.referenceDocNumber}</span>
            </div>
          </div>

          {/* JSON-LD Preview */}
          <pre className="bg-slate-950 p-3 rounded-lg text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 max-h-52">
            {JSON.stringify(parsedResult.epcisJsonLd, null, 2)}
          </pre>
        </div>
      </div>

      {/* DECONSTRUCTED GS1 MODULO-10 ARITHMETIC CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Under The Hood: Live GS1 Modulo-10 Check-Digit Arithmetic Breakdown</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">ISO/IEC 15420 Barcode Standard</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The 13th digit of any GS1 Global Location Number (GLN) is an authenticated mathematical check-digit calculated using alternating weights (1, 3, 1, 3...):
        </p>

        {/* Step-by-Step Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border border-slate-800 rounded-lg">
            <thead className="bg-slate-950 text-slate-400 text-[11px]">
              <tr>
                <th className="p-1.5 border-r border-slate-800">Position</th>
                {digits12.map((_, i) => (
                  <th key={i} className="p-1.5 font-mono">P{i + 1}</th>
                ))}
                <th className="p-1.5 text-teal-300 border-l border-slate-800">Sum</th>
                <th className="p-1.5 text-emerald-400">10 - (Sum mod 10)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
              <tr>
                <td className="p-1.5 font-semibold text-slate-400 border-r border-slate-800">Digit (d)</td>
                {digits12.map((d, i) => (
                  <td key={i} className="p-1.5 text-white font-bold">{d}</td>
                ))}
                <td className="p-1.5 font-bold text-teal-300 border-l border-slate-800">{sum}</td>
                <td className="p-1.5 font-bold text-emerald-400 text-sm">{expectedCheck}</td>
              </tr>
              <tr className="bg-slate-950/50 text-slate-500 text-[10px]">
                <td className="p-1.5 border-r border-slate-800">Weight (w)</td>
                {weights.map((w, i) => (
                  <td key={i} className="p-1.5">×{w}</td>
                ))}
                <td className="p-1.5 border-l border-slate-800">mod 10 = {mod}</td>
                <td className="p-1.5 text-emerald-300">Target Check Digit</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-[11px] text-slate-400 font-mono pt-1">
          Formula: <span className="text-white">Check Digit = (10 - (∑ (dᵢ × wᵢ) mod 10)) mod 10</span> &rarr; Computed: <span className="text-emerald-400 font-bold">{expectedCheck}</span> | Provided in Paperwork: <span className="text-amber-300 font-bold">{parsedResult.rawGln[12] || 'N/A'}</span> &rarr; Verdict: <span className={parsedResult.glnCheckDigitValid ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{parsedResult.glnCheckDigitValid ? 'PASSED DOCK CHECK' : 'MISMATCH (REJECT PAPERWORK)'}</span>
        </div>
      </div>
    </div>
  );
};
