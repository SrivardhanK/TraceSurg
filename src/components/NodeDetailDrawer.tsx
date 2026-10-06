/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TraceNode } from '../types/traceability';
import { X, ShieldAlert, CheckCircle, MapPin, FileText, Calendar, Building, Package, ArrowRight, Activity } from 'lucide-react';

interface NodeDetailDrawerProps {
  node: TraceNode | null;
  onClose: () => void;
  onTriggerRecall: (lotId: string) => void;
  onTriggerBacktrace: (storeId: string) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  onClose,
  onTriggerRecall,
  onTriggerBacktrace
}) => {
  if (!node) return null;

  const isRootCause = node.status === 'root_cause';
  const isRecalled = node.status === 'recalled';
  const isSafe = node.status === 'safe_post_cip';
  const isCip = node.id === 'CIP-EVT-NODE';

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 md:w-[420px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 overflow-y-auto p-5 text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                isRootCause
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : isCip
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : isRecalled
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
              }`}
            >
              {isRootCause ? 'ROOT CAUSE SUSPECT' : isCip ? 'CIP SANITATION EVENT' : node.status.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 font-mono">{node.tier}</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">{node.id}</h3>
          <p className="text-xs text-slate-300">{node.label}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Attributes */}
      <div className="space-y-4 mt-4">
        {/* Commodity & Inventory */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>Commodity & Volume (FTL Covered)</span>
          </div>
          <div className="text-sm font-bold text-white">{node.commodity}</div>
          {node.quantity > 0 && (
            <div className="text-xs text-slate-400 mt-0.5">
              Current Volume: <span className="font-mono text-white">{node.quantity.toLocaleString()}</span> {node.unitOfMeasure}
            </div>
          )}
        </div>

        {/* Facility & Location (GS1 GLN) */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Building className="w-3.5 h-3.5" />
            <span>Facility Location (21 CFR § 1.1330)</span>
          </div>
          <div className="text-xs font-semibold text-white">{node.facilityName}</div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5 break-all">
            GLN: {node.facilityGln}
          </div>
        </div>

        {/* FSMA 204 TLC Source & Reference Document */}
        {node.tlcSourceGln && (
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>TLC Source & Ref Document (§ 1.1315)</span>
            </div>
            <div className="text-xs text-white">
              <span className="text-slate-400">Assigned By:</span> {node.tlcSourceName || 'N/A'}
            </div>
            <div className="text-[11px] font-mono text-slate-400 break-all mt-0.5">
              Source GLN: {node.tlcSourceGln}
            </div>
            {node.referenceDocType && (
              <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400">Reference Doc:</span>{' '}
                <span className="font-mono text-amber-300">{node.referenceDocType} #{node.referenceDocNumber}</span>
              </div>
            )}
          </div>
        )}

        {/* Pathogen / Safety Status */}
        {node.pathogenRisk && (
          <div
            className={`p-3 rounded-lg border ${
              isRootCause || isRecalled
                ? 'bg-red-950/30 border-red-500/40 text-red-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold mb-1">
              {isRootCause || isRecalled ? <ShieldAlert className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
              <span>FSQA Biological Risk Evaluation</span>
            </div>
            <div className="text-xs">{node.pathogenRisk}</div>
          </div>
        )}

        {/* Details & Physical Telemetry */}
        {node.details && (
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-xs font-semibold text-slate-400 mb-2">Technical Telemetry & Details</div>
            <div className="space-y-1.5 text-xs">
              {Object.entries(node.details).map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-slate-800/50 pb-1">
                  <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="font-mono text-white text-right">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>Event Timestamp (UTC):</span>
          <span className="font-mono text-slate-200">{node.timestamp}</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          {node.type === 'farm_lot' && (
            <button
              onClick={() => onTriggerRecall(node.id)}
              className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-amber-950"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Simulate Recall Blast From This Farm Lot</span>
            </button>
          )}

          {node.type === 'retail_store' && (
            <button
              onClick={() => onTriggerBacktrace(node.id)}
              className="w-full py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-cyan-950"
            >
              <Activity className="w-4 h-4" />
              <span>Run Upstream Back-Trace From This Store</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
