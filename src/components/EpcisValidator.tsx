/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EPCIS_JSONLD_SAMPLE } from '../data/mockSupplyChain';
import { CheckCircle2, AlertTriangle, FileCode, Check, ShieldCheck, ArrowRight, UploadCloud, Search } from 'lucide-react';

export const EpcisValidator: React.FC = () => {
  const [activeJsonTab, setActiveJsonTab] = useState<'sample' | 'supplier-audit'>('supplier-audit');

  // Supplier Inbound ASN Audit cases
  const [supplierSubmissions, setSupplierSubmissions] = useState([
    {
      id: 'ASN-SVG-2026-9041',
      supplier: 'Salinas Valley Greens',
      gln: 'urn:epc:id:sgln:0860001.00010.0',
      commodity: 'Romaine Lettuce',
      kdesPresent: ['TLC', 'TLC_SOURCE_GLN', 'HARVEST_DATE', 'BOL_NUMBER', 'LOCATION_DESC', 'QTY_UOM', 'FIELD_GPS', 'COOLING_TEMP'],
      kdesMissing: [],
      score: 100,
      status: 'APPROVED',
      notes: 'Fully compliant with 21 CFR § 1.1335. Complete farm mapping metadata provided.'
    },
    {
      id: 'ASN-YVO-2026-8819',
      supplier: 'Yuma Valley Organics',
      gln: 'urn:epc:id:sgln:0860002.00020.0',
      commodity: 'Romaine Lettuce',
      kdesPresent: ['TLC', 'TLC_SOURCE_GLN', 'HARVEST_DATE', 'BOL_NUMBER', 'QTY_UOM'],
      kdesMissing: ['FIELD_GPS', 'COOLING_TEMP'],
      score: 87.5,
      status: 'WARNING',
      notes: 'Missing field GPS coordinates and cooling timestamp. Accepted with supplier corrective action notice.'
    },
    {
      id: 'ASN-LEGACY-7721',
      supplier: 'Midland Fresh Farms',
      gln: 'urn:epc:id:sgln:0860009.00001.0',
      commodity: 'Red Cabbage',
      kdesPresent: ['TLC', 'QTY_UOM', 'HARVEST_DATE'],
      kdesMissing: ['TLC_SOURCE_GLN', 'BOL_NUMBER', 'LOCATION_DESC', 'FIELD_GPS', 'COOLING_TEMP'],
      score: 37.5,
      status: 'REJECTED_AT_DOCK',
      notes: 'CRITICAL FAILURE: Missing TLC Source GLN and TLC Source Reference Document. Violates 21 CFR § 1.1315. Reject at dock before receipt.'
    }
  ]);

  const allMandatoryKdes = [
    { code: 'TLC', label: 'Traceability Lot Code' },
    { code: 'TLC_SOURCE_GLN', label: 'TLC Source GLN (§ 1.1315)' },
    { code: 'HARVEST_DATE', label: 'Harvest DateTime UTC' },
    { code: 'BOL_NUMBER', label: 'Ref Doc (BOL / ASN)' },
    { code: 'QTY_UOM', label: 'Quantity & Unit of Measure' },
    { code: 'LOCATION_DESC', label: 'Physical Storage Location' },
    { code: 'FIELD_GPS', label: 'Grower Field GPS Coordinates' },
    { code: 'COOLING_TEMP', label: 'Cooling Dwell Timestamp' },
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              GS1 EPCIS 2.0 & CBV 2.0 CANONICAL LAYER
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Inbound Dock Verification • Zero Vendor Lock-in
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Supplier FSQA Quality & Inbound KDE Completeness Scorer
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Real food plant recalls frequently start with missing Key Data Elements on supplier ASNs. TraceSurg scores inbound records against FSMA 204 rules to stop un-traceable inventory at the dock door.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveJsonTab('supplier-audit')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeJsonTab === 'supplier-audit'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Supplier KDE Audits</span>
          </button>
          <button
            onClick={() => setActiveJsonTab('sample')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeJsonTab === 'sample'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 bg-slate-800 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>GS1 JSON-LD Schema</span>
          </button>
        </div>
      </div>

      {activeJsonTab === 'supplier-audit' && (
        <div className="space-y-4">
          {/* Supplier Audit Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supplierSubmissions.map((sub) => {
              const isApproved = sub.status === 'APPROVED';
              const isWarning = sub.status === 'WARNING';
              const isRejected = sub.status === 'REJECTED_AT_DOCK';

              return (
                <div
                  key={sub.id}
                  className={`p-4 rounded-xl border bg-slate-900 shadow-xl ${
                    isApproved
                      ? 'border-emerald-500/40'
                      : isWarning
                      ? 'border-amber-500/40'
                      : 'border-red-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-mono text-xs font-bold text-white">{sub.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isApproved
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {sub.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="text-sm font-bold text-white">{sub.supplier}</div>
                    <div className="text-[11px] font-mono text-cyan-300 mt-0.5">{sub.commodity}</div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">{sub.gln}</div>
                  </div>

                  {/* Score Gauge */}
                  <div className="mt-4 p-2.5 bg-slate-950 rounded-lg">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">FSMA 204 KDE Score</span>
                      <span
                        className={`font-mono font-bold ${
                          isApproved ? 'text-emerald-400' : isWarning ? 'text-amber-400' : 'text-red-400'
                        }`}
                      >
                        {sub.score}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isApproved ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${sub.score}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Missing Elements */}
                  {sub.kdesMissing.length > 0 && (
                    <div className="mt-3">
                      <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider block mb-1">
                        Missing Required KDEs:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {sub.kdesMissing.map((m) => (
                          <span
                            key={m}
                            className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-mono"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="mt-3 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                    {sub.notes}
                  </p>
                </div>
              );
            })}
          </div>

          {/* KDE Checklist Reference */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-2">
              Mandatory Inbound Key Data Element (KDE) Matrix for FTL Produce
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {allMandatoryKdes.map((kde) => (
                <div key={kde.code} className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{kde.code}</span>
                  </div>
                  <div className="text-slate-300 text-[11px] mt-0.5">{kde.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeJsonTab === 'sample' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Canonical GS1 EPCIS 2.0 JSON-LD Document</h3>
              <p className="text-xs text-slate-400">
                TransformationEvent, ObjectEvent, and custom bizStep: sanitizing (CIP Line Flush)
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
              EPCIS 2.0.0 Standard
            </span>
          </div>

          <pre className="bg-slate-950 p-4 rounded-lg text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-[550px]">
            {JSON.stringify(EPCIS_JSONLD_SAMPLE, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
