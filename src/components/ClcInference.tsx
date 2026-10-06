/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CalculatedLotCodeEngine, ClcInferenceResult } from '../engine/clcEngine';
import { Truck, CheckCircle2, ShieldCheck, Warehouse, ArrowRight, Activity, FileCheck } from 'lucide-react';

export const ClcInference: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState<string>('STORE-102-PORTLAND');

  const inference: ClcInferenceResult = CalculatedLotCodeEngine.inferStoreReceipt(selectedStore);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              OPTION B: LAST-MILE RETAIL TRACEABILITY
            </span>
            <span className="text-xs text-slate-400 font-mono">
              FIFO Warehouse Slotting • Route Depletion Inference
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Calculated Lot Code (CLC) Retail Inference Engine
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Retail grocery stores and restaurants refuse to scan individual cartons off delivery trucks. TraceSurg bypasses manual barcode scanning by deducing exact lot receipts through DC inventory depletion curves and dispatch sequence logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Select Retail Store:</span>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500"
          >
            <option value="STORE-101-SEATTLE">Store #101 (Seattle, WA)</option>
            <option value="STORE-102-PORTLAND">Store #102 (Portland, OR)</option>
            <option value="STORE-103-BOISE">Store #103 (Boise, ID)</option>
          </select>
        </div>
      </div>

      {/* Primary Inference Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Inferred Receipt for {inference.storeName}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Methodology: {inference.methodology.replace(/_/g, ' ')}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Statistical Confidence:</span>
            <div className="text-2xl font-extrabold text-amber-400 font-mono">
              {inference.confidenceScorePct}%
            </div>
          </div>
        </div>

        {/* Inferred Lot Code Box */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">
              Deducted Traceability Lot Code (TLC):
            </span>
            <span className="text-xl font-mono font-extrabold text-white mt-1 block">
              {inference.inferredLotId}
            </span>
            <span className="text-xs text-slate-400 mt-0.5 block">
              Romaine Salad Bowl Classic (4,200 bowls batch)
            </span>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-slate-300 border border-slate-800 max-w-md">
            <span className="text-amber-400 font-semibold block mb-1">Audit Justification:</span>
            {inference.probabilisticRanking[0]?.reasoning}
          </div>
        </div>

        {/* Probabilistic Depletion Distribution */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Warehouse Pick-Slot Probability Distribution:
          </span>
          <div className="space-y-2">
            {inference.probabilisticRanking.map((rank, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-white">{rank.lotId}</span>
                  <span className="font-mono text-amber-400 font-bold">{rank.probabilityPct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${rank.probabilityPct}%` }}
                  ></div>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{rank.reasoning}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Advisory Verdict */}
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-xs text-emerald-200 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{inference.regulatoryComplianceVerdict}</span>
        </div>
      </div>
    </div>
  );
};
