/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RECEIVING_KDES, TRANSFORMATION_KDES, SHIPPING_KDES, CIP_RECORD, FDA_RECALL_BASELINE } from '../data/mockSupplyChain';
import { FDA204Exporter } from '../engine/fdaExporter';
import { FileSpreadsheet, Download, CheckCircle, ShieldCheck, FileText, Search, ArrowDownUp, Info } from 'lucide-react';

export const FdaAuditCenter: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'receiving' | 'transformation' | 'shipping' | 'plan' | 'cip'>('receiving');
  const [searchFilter, setSearchFilter] = useState('');

  const handleDownloadXlsx = () => {
    FDA204Exporter.exportOfficialXlsx('FDA_FSMA204_PacificCoastFreshFoods_SaladRecall.xlsx');
  };

  const writtenPlanText = FDA204Exporter.generateWrittenTraceabilityPlan();

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              OFFICIAL 21 CFR § 1.1315 TEMPLATE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              24-Hour Mandate • Generated in 0.04s
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            FDA Electronic Sortable Spreadsheet & Traceability Plan
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Under FSMA Rule 204, covered entities must furnish an electronic, sortable spreadsheet with distinct worksheets for Receiving (§ 1.1335), Transformation (§ 1.1340), and Shipping (§ 1.1345) within 24 hours of an inquiry.
          </p>
        </div>

        <button
          onClick={handleDownloadXlsx}
          className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950 flex items-center gap-2.5 transition-all whitespace-nowrap cursor-pointer"
        >
          <Download className="w-4 h-4 text-emerald-200" />
          <span>Download Multi-Tab .xlsx Workbook</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('receiving')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'receiving'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Tab 1: Receiving KDEs (§ 1.1335)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
              {RECEIVING_KDES.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('transformation')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'transformation'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Tab 2: Transformation KDEs (§ 1.1340)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
              {TRANSFORMATION_KDES.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('shipping')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'shipping'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Tab 3: Shipping KDEs (§ 1.1345)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
              {SHIPPING_KDES.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('cip')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'cip'
                ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CIP Sanitation Audit Log</span>
          </button>

          <button
            onClick={() => setActiveSubTab('plan')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'plan'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Traceability Plan (§ 1.1315(a))</span>
          </button>
        </div>

        {/* Search within table */}
        {activeSubTab !== 'plan' && activeSubTab !== 'cip' && (
          <div className="relative hidden md:block w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter lot, GLN, BOL..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Receiving KDEs Table */}
      {activeSubTab === 'receiving' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-white">Receiving Critical Tracking Event (CTE) - 21 CFR § 1.1335</span>
            <span>Columns strictly sortable & filterable per FDA guideline</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Traceability Lot Code (TLC)</th>
                  <th className="py-2.5 px-3">Commodity Description</th>
                  <th className="py-2.5 px-3">Qty & Unit</th>
                  <th className="py-2.5 px-3">Received UTC</th>
                  <th className="py-2.5 px-3">TLC Source GLN</th>
                  <th className="py-2.5 px-3">TLC Source Facility</th>
                  <th className="py-2.5 px-3">Ref Doc (BOL/PO)</th>
                  <th className="py-2.5 px-3">Storage Bay</th>
                  <th className="py-2.5 px-3">Pathogen Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {RECEIVING_KDES.filter(r => 
                  r.tlc.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  r.tlcSourceName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  r.tlcSourceRefDocNumber.toLowerCase().includes(searchFilter.toLowerCase())
                ).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-mono font-bold text-white">{row.tlc}</td>
                    <td className="py-2.5 px-3">{row.commodity}</td>
                    <td className="py-2.5 px-3 font-mono">{row.quantity.toLocaleString()} {row.unit}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{row.dateReceivedUtc}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-cyan-300">{row.tlcSourceGln}</td>
                    <td className="py-2.5 px-3">{row.tlcSourceName}</td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">{row.tlcSourceRefDocType} #{row.tlcSourceRefDocNumber}</td>
                    <td className="py-2.5 px-3 text-slate-400">{row.lotLocationDescription}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.pathogenStatus.includes('ALERT')
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {row.pathogenStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Transformation KDEs Table */}
      {activeSubTab === 'transformation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-white">Transformation Critical Tracking Event (CTE) - 21 CFR § 1.1340</span>
            <span className="text-amber-300/90 font-mono">Multi-input lots exploded into separate linked rows</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Event ID & Line</th>
                  <th className="py-2.5 px-3">DateTime (UTC)</th>
                  <th className="py-2.5 px-3">Input TLC</th>
                  <th className="py-2.5 px-3">Input Qty</th>
                  <th className="py-2.5 px-3">Output TLC</th>
                  <th className="py-2.5 px-3">Output Finished Commodity</th>
                  <th className="py-2.5 px-3">Output Qty</th>
                  <th className="py-2.5 px-3">CIP Verified?</th>
                  <th className="py-2.5 px-3">Production Shift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {TRANSFORMATION_KDES.filter(t =>
                  t.inputTlc.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  t.outputTlc.toLowerCase().includes(searchFilter.toLowerCase())
                ).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-mono font-bold text-white">
                      <div>{row.transformationEventId}</div>
                      <div className="text-[10px] text-cyan-400 font-normal">{row.lineId}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{row.transformationDateTimeUtc}</td>
                    <td className="py-2.5 px-3 font-mono text-amber-300 font-semibold">{row.inputTlc}</td>
                    <td className="py-2.5 px-3 font-mono">{row.inputQuantity.toLocaleString()} {row.inputUnit}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">{row.outputTlc}</td>
                    <td className="py-2.5 px-3">{row.outputCommodity}</td>
                    <td className="py-2.5 px-3 font-mono">{row.outputQuantity.toLocaleString()} {row.outputUnit}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.cleanInPlaceVerified
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {row.cleanInPlaceVerified ? 'YES (Line Sanitized)' : 'NO (Pre-Clean)'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{row.shift}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Shipping KDEs Table */}
      {activeSubTab === 'shipping' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-white">Shipping Critical Tracking Event (CTE) - 21 CFR § 1.1345</span>
            <span>Outbound custody handoff to Distribution Centers and Stores</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Shipped TLC</th>
                  <th className="py-2.5 px-3">Commodity</th>
                  <th className="py-2.5 px-3">Qty Shipped</th>
                  <th className="py-2.5 px-3">Ship DateTime (UTC)</th>
                  <th className="py-2.5 px-3">Consignee Name & GLN</th>
                  <th className="py-2.5 px-3">Carrier Name</th>
                  <th className="py-2.5 px-3">Bill of Lading #</th>
                  <th className="py-2.5 px-3">Trailer / Asset ID</th>
                  <th className="py-2.5 px-3">Destination</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {SHIPPING_KDES.filter(s =>
                  s.shippedTlc.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  s.consigneeName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  s.billOfLading.toLowerCase().includes(searchFilter.toLowerCase())
                ).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-mono font-bold text-white">{row.shippedTlc}</td>
                    <td className="py-2.5 px-3">{row.commodity}</td>
                    <td className="py-2.5 px-3 font-mono">{row.quantityShipped.toLocaleString()} {row.unit}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{row.shipmentDateUtc}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white">{row.consigneeName}</div>
                      <div className="text-[10px] font-mono text-cyan-300">{row.consigneeGln}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{row.carrierName}</td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">{row.billOfLading}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{row.trailerAssetId}</td>
                    <td className="py-2.5 px-3 text-slate-300">{row.destinationCity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: CIP Sanitation Record */}
      {activeSubTab === 'cip' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Clean-in-Place (CIP) Sanitation Audit & Boundary Verification</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Physical biological evidence preventing recall query bleed across Shift A and Shift B
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
              VERIFIED EFFECTIVE (8 RLU)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="text-xs text-slate-400">Chemical Concentration</span>
              <div className="text-lg font-bold text-white mt-1">{CIP_RECORD.chemicalPpm} PPM</div>
              <span className="text-[11px] text-cyan-300">{CIP_RECORD.chemicalUsed}</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="text-xs text-slate-400">ATP Bioluminescence Swab</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">{CIP_RECORD.atpSwabRLU} RLU</div>
              <span className="text-[11px] text-slate-400">FDA / GFSI Pass Boundary: &lt; 25 RLU</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="text-xs text-slate-400">Wash Water Temperature</span>
              <div className="text-lg font-bold text-white mt-1">{CIP_RECORD.washTemperatureC}°C</div>
              <span className="text-[11px] text-slate-400">Caustic alkaline thermal flush</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-2">
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">Sanitation Event ID:</span>
              <span className="font-mono text-white">{CIP_RECORD.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">Equipment Line:</span>
              <span className="font-mono text-cyan-300">{CIP_RECORD.lineId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">Execution Window:</span>
              <span className="font-mono text-white">{CIP_RECORD.startTime} to {CIP_RECORD.endTime}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">Certified Sanitation Operator:</span>
              <span className="font-mono text-white">{CIP_RECORD.operatorId}</span>
            </div>
            <div className="pt-2">
              <span className="text-slate-400 block mb-1">Director of Sanitation Sign-off Notes:</span>
              <p className="text-slate-200 bg-slate-900 p-2.5 rounded border border-slate-800 leading-relaxed font-mono text-[11px]">
                {CIP_RECORD.notes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Written Traceability Plan (§ 1.1315(a)) */}
      {activeSubTab === 'plan' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Written Traceability Plan (21 CFR § 1.1315(a))</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Mandatory document required prior to reviewing electronic sortable spreadsheet
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono">
              FORM 483 READY
            </span>
          </div>

          <pre className="bg-slate-950 p-4 rounded-lg text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-[500px]">
            {writtenPlanText}
          </pre>
        </div>
      )}
    </div>
  );
};
