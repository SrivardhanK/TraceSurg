/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BayesianTraceEngine, BayesianAttributionResult } from '../engine/bayesianEngine';
import { GitPullRequest, Search, CheckCircle2, AlertTriangle, ShieldAlert, Award, FileText } from 'lucide-react';

export const BayesianAttribution: React.FC = () => {
  const [sickCount, setSickCount] = useState<number>(7);
  const [selectedCluster, setSelectedCluster] = useState<string>('OUTBREAK-CLUSTER-2026-NW');

  const attributionResult: BayesianAttributionResult = BayesianTraceEngine.calculateAttribution(
    ['Store #101 Seattle', 'Store #102 Portland'],
    sickCount
  );

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              PHASE 3 UNCERTAINTY ATTRIBUTION
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Bayesian Belief Propagation • Maximum A Posteriori (MAP)
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Bayesian Upstream Source Attribution (Multi-Supplier Blends)
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            When consumers fall ill from multi-ingredient salads, standard database queries indiscriminately implicate every supplier farm. TraceSurg uses Bayesian network inference to isolate the single Maximum A Posteriori (MAP) root-cause field.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-950/60 border border-purple-500/50 rounded-xl text-center">
            <div className="text-[10px] text-purple-300 uppercase font-semibold">MAP Culprit Confidence</div>
            <div className="text-2xl font-extrabold text-white font-mono">{attributionResult.confidencePct}%</div>
          </div>
        </div>
      </div>

      {/* Cluster Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Active Epidemiological Cluster: {attributionResult.clusterId}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pacific Northwest CDC Clinical Isolate Matches (Listeria monocytogenes pulsotype LM-004)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Reported Sick Cases:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-mono font-bold text-xs border border-slate-700">
              {sickCount} Confirmed Patients
            </span>
          </div>
        </div>

        {/* MAP Candidate Ranking Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {attributionResult.candidates.map((c) => {
            const isMap = c.isMapSource;

            return (
              <div
                key={c.farmId}
                className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
                  isMap
                    ? 'bg-gradient-to-br from-purple-950/70 to-slate-900 border-purple-500 shadow-xl shadow-purple-950/50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}
              >
                {isMap && (
                  <div className="absolute top-0 right-0 bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl uppercase">
                    MAP Culprit
                  </div>
                )}

                <div className="text-xs font-mono font-bold text-slate-400">{c.farmId}</div>
                <div className="text-sm font-bold text-white mt-1">{c.farmName}</div>
                <div className="text-[11px] text-cyan-300">{c.commodity}</div>

                {/* Posterior Probability Gauge */}
                <div className="mt-4 p-2 bg-slate-950 rounded-lg">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Posterior P(Source)</span>
                    <span className={`font-mono font-bold ${isMap ? 'text-purple-400' : 'text-slate-300'}`}>
                      {c.posteriorProb}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isMap ? 'bg-purple-500' : 'bg-slate-600'}`}
                      style={{ width: `${c.posteriorProb}%` }}
                    ></div>
                  </div>
                </div>

                {/* Evidence List */}
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                    Attribution Factors:
                  </span>
                  {c.attributionEvidence.map((ev, idx) => (
                    <div key={idx} className="text-[10px] text-slate-400 flex items-start gap-1">
                      <span className="text-purple-400 shrink-0">•</span>
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Guidance Recommendation */}
        <div className="mt-4 p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-start gap-3">
          <Award className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">FDA Field Investigation Directive:</span>
            {attributionResult.investigationGuidance}
          </div>
        </div>
      </div>
    </div>
  );
};
