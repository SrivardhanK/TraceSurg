/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SpoilageEngine } from '../engine/spoilageEngine';
import { Cpu, RefreshCw, AlertTriangle, ShieldCheck, Layers, GitFork } from 'lucide-react';

export const CstrReworkModule: React.FC = () => {
  const [tankVolume, setTankVolume] = useState<number>(5000); // Liters
  const [flushRate, setFlushRate] = useState<number>(250);   // L/min
  const [initialPpm, setInitialPpm] = useState<number>(1000); // PPM residual allergen / pathogen
  const [safeLimitPpm, setSafeLimitPpm] = useState<number>(5.0); // PPM regulatory threshold

  const dilutionResult = useMemo(() => {
    return SpoilageEngine.calculateCstrDilution(initialPpm, tankVolume, flushRate, safeLimitPpm);
  }, [initialPpm, tankVolume, flushRate, safeLimitPpm]);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              PHASE 2 INDUSTRIAL HARDENING
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Fluid Residence Time Kinetics & Cycle-Breaking Traversal
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Continuous Fluid Dynamics (CSTR Tank Heel) & Rework DAG Unrolling
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Real food plants rarely process 1-to-1 discrete units. Bulk tanks have a 10% "heel" of liquid ingredients, and trimmings (rework) get reintroduced into subsequent batches, creating cyclic graph loops that crash standard DAG traversal engines.
          </p>
        </div>
      </div>

      {/* Two Column Layout: CSTR Simulator & Cyclic Rework Unroller */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Module 1: CSTR Tank Heel Residence Time Simulator */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>CSTR Tank Heel Exponential Dilution Curve</span>
              </h3>
              <p className="text-xs text-slate-400">
                Formula: <span className="font-mono text-cyan-300">C(t) = C₀ · e^(-t / τ)</span> where <span className="font-mono text-cyan-300">τ = V / Q</span>
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
              Safe @ {dilutionResult.minutesToSafe} min
            </span>
          </div>

          {/* Sliders */}
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Tank Heel Volume (V):</span>
                <span className="font-mono text-amber-300 font-bold">{tankVolume.toLocaleString()} Liters</span>
              </div>
              <input
                type="range"
                min="1000"
                max="20000"
                step="500"
                value={tankVolume}
                onChange={(e) => setTankVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Clean Flush / Inflow Rate (Q):</span>
                <span className="font-mono text-cyan-300 font-bold">{flushRate} L/min</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={flushRate}
                onChange={(e) => setFlushRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Initial Heel Contaminant / Allergen Concentration (C₀):</span>
                <span className="font-mono text-red-400 font-bold">{initialPpm} PPM</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={initialPpm}
                onChange={(e) => setInitialPpm(parseFloat(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>
          </div>

          {/* SVG Dilution Chart */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Residual Concentration vs. Flush Time (Minutes)</span>
              <span className="text-emerald-400 font-mono">Limit: {safeLimitPpm} PPM</span>
            </div>
            <svg viewBox="0 0 400 130" className="w-full h-32">
              <line x1="30" y1="10" x2="380" y2="10" stroke="#1e293b" />
              <line x1="30" y1="60" x2="380" y2="60" stroke="#1e293b" />
              <line x1="30" y1="110" x2="380" y2="110" stroke="#1e293b" />

              {/* Threshold line */}
              <line x1="30" y1="105" x2="380" y2="105" stroke="#10b981" strokeDasharray="3 3" />

              {/* Curve points */}
              {(() => {
                const maxConc = initialPpm;
                const points = dilutionResult.timePoints.map((pt) => {
                  const x = 30 + (pt.minute / 120) * 350;
                  const y = 110 - (pt.concentrationPpm / maxConc) * 100;
                  return `${x},${y}`;
                });
                return (
                  <path
                    d={`M ${points.join(' L ')}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />
                );
              })()}
            </svg>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono px-6">
              <span>0m</span>
              <span>30m</span>
              <span>60m</span>
              <span>90m</span>
              <span>120m</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg text-xs text-slate-300 border border-slate-800">
            <span className="text-emerald-400 font-semibold block mb-0.5">Physical Plant Takeaway:</span>
            Rather than discarding an entire 20,000L silo, the engine calculates that after <span className="font-bold text-white font-mono">{dilutionResult.minutesToSafe} minutes</span> of displacement flush, residual cross-contact drops below the 5 PPM threshold.
          </div>
        </div>

        {/* Module 2: Cycle-Breaking DAG Rework Loop Unroller */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GitFork className="w-4 h-4 text-cyan-400" />
                <span>Cyclic Rework Loop Resolution</span>
              </h3>
              <p className="text-xs text-slate-400">
                Time-indexed sequence layer unrolling: <span className="font-mono text-cyan-300">Batch₁ → Rework₁.₁ → Batch₃</span>
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono">
              ZERO INFINITE LOOPS
            </span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3 text-xs">
            <div className="text-amber-400 font-semibold">The Rework Problem in Food Plants:</div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              In pasta, bakery, or salad packaging, edge cuts and salad trim from Shift 1 are frequently gathered as "rework" and reintroduced into Shift 3. In naive graph algorithms, this creates a cyclic loop (<span className="font-mono text-cyan-300">A → B → A</span>) which causes infinite recursion or stack overflows.
            </p>

            <div className="border border-slate-800 rounded-lg p-3 bg-slate-900 font-mono text-[11px] text-slate-300 space-y-2">
              <div className="text-cyan-400">// Algorithm: Time-Indexed DAG Layering</div>
              <div className="text-slate-400">
                1. Split physical node into immutable temporal instances:
              </div>
              <div className="pl-3 text-white">
                <div>[Batch_1 @ 08:00 UTC] ──► [Trim_Rework_1.1 @ 11:00 UTC]</div>
                <div className="pl-16">└──► [Batch_3 @ 14:00 UTC]</div>
              </div>
              <div className="text-slate-400">
                2. Traversal guard: <span className="text-amber-300">assert timestamp(target) &gt; timestamp(source)</span>
              </div>
              <div className="text-emerald-400">
                3. Outcome: Preserves exact lot attribution while preventing cyclic query hang.
              </div>
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg text-emerald-300 text-[11px]">
              <span className="font-bold">FSQA Audit Impact:</span> When the FDA asks how trimming re-introduction is controlled, this algorithm provides mathematical proof that only batches genuinely exposed to the rework are bounded.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
