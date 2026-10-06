/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SpoilageEngine } from '../engine/spoilageEngine';
import { ThermometerSnowflake, AlertTriangle, ShieldCheck, Play, RotateCcw, Activity, Info, Check, Calculator } from 'lucide-react';

export const ColdChainMonitor: React.FC = () => {
  const [excursionStart, setExcursionStart] = useState<number>(6);
  const [excursionDuration, setExcursionDuration] = useState<number>(6);
  const [peakTemp, setPeakTemp] = useState<number>(16.5);

  const simulation = useMemo(() => {
    return SpoilageEngine.simulateReeferTelemetry(excursionStart, excursionDuration, peakTemp);
  }, [excursionStart, excursionDuration, peakTemp]);

  const { logs, summary } = simulation;

  // Live Math Deconstruction for Ratkowsky:
  // r = [0.055 * (T - (-1.18))]^2
  const T_min = -1.18;
  const b = 0.055;
  const T_base = 4.0;
  const r_base = Math.pow(b * (T_base - T_min), 2); // 0.0811
  const deltaT = peakTemp - T_min;
  const bracket = b * deltaT;
  const r_peak = Math.pow(bracket, 2);
  const relativeMultiplier = (r_peak / r_base).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              PHASE 2 IOT PREDICTIVE ENGINE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Ratkowsky Kinetic Growth • Thermal Degree-Hours • Pre-Dock Quarantine
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Predictive Cold-Chain Telemetry & Kinetic Spoilage Engine
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Cold-chain excursions do not require waiting for customer illness or 48-hour lab cultures. TraceSurg numerically integrates thermal degree-hours to automatically attach a <span className="text-red-400 font-mono font-bold">[:QUARANTINED]</span> status before ingredients ever touch the receiving dock.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 ${
              summary.quarantineTriggered
                ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-lg shadow-red-950'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {summary.quarantineTriggered ? (
              <>
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                <span>[:QUARANTINED] APPLIED</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>IN-SPEC (ACCEPT AT DOCK)</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Interactive Excursion Parameter Controls (Reefer Asset #TR-402)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Excursion Start Time:</span>
              <span className="font-mono text-cyan-400 font-bold">{excursionStart}:00 hrs</span>
            </div>
            <input
              type="range"
              min="2"
              max="16"
              step="1"
              value={excursionStart}
              onChange={(e) => setExcursionStart(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Transit timeline hour when cooling system fails</span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Excursion Duration:</span>
              <span className="font-mono text-cyan-400 font-bold">{excursionDuration} hours</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={excursionDuration}
              onChange={(e) => setExcursionDuration(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Continuous hours until auxiliary cooling restored</span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Peak Container Temperature:</span>
              <span className="font-mono text-red-400 font-bold">{peakTemp.toFixed(1)}°C</span>
            </div>
            <input
              type="range"
              min="4.5"
              max="24.0"
              step="0.5"
              value={peakTemp}
              onChange={(e) => setPeakTemp(parseFloat(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Max temperature recorded inside cargo headspace</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">Total Thermal Degree-Hours</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {summary.totalDegreeHours} <span className="text-xs text-slate-400 font-normal">°C·h</span>
          </div>
          <span className="text-[11px] text-slate-400">
            HACCP Limit: <span className="font-mono text-amber-300">15.0 °C·h</span>
          </span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">Peak Temperature</span>
          <div className={`text-2xl font-extrabold mt-1 ${summary.peakTempC > 12 ? 'text-red-400' : 'text-emerald-400'}`}>
            {summary.peakTempC}°C
          </div>
          <span className="text-[11px] text-slate-400">
            Critical Threshold: <span className="font-mono text-slate-300">4.0°C</span>
          </span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">Ratkowsky Growth Multiplier</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">
            {summary.maxRelativeGrowthRate}x
          </div>
          <span className="text-[11px] text-slate-400">Relative to safe 4°C storage</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">Receiving Disposition</span>
          <div
            className={`text-sm font-bold mt-2 ${
              summary.quarantineTriggered ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {summary.quarantineTriggered ? 'REJECT & QUARANTINE' : 'CLEARED FOR RECEIPT'}
          </div>
          <span className="text-[10px] text-slate-500">Neo4j pre-dock rule</span>
        </div>
      </div>

      {/* DECONSTRUCTED LIVE FORMULA ARITHMETIC CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Under The Hood: Live Deconstructed Ratkowsky Kinetic Arithmetic</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">USDA-ARS Microbiological Model</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Formula 1: Ratkowsky */}
          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <span className="text-amber-300 font-bold block">1. Ratkowsky Square-Root Equation:</span>
            <div className="font-mono text-slate-300 bg-slate-900 p-2 rounded border border-slate-800 text-[11px]">
              r = [ b · (T - T_min) ]²
            </div>
            <div className="text-slate-400 text-[11px] space-y-1">
              <div>Parameters for <em>Listeria monocytogenes</em>:</div>
              <div>• Minimum theoretical growth temp (T_min): <span className="font-mono text-white">-1.18°C</span></div>
              <div>• Kinetic rate coefficient (b): <span className="font-mono text-white">0.055 °C⁻¹·h⁻⁰·⁵</span></div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-cyan-300">
              Live substitution at peak {peakTemp}°C:<br />
              r = [ 0.055 · ({peakTemp} - (-1.18)) ]² = [ 0.055 · {deltaT.toFixed(2)} ]² = {r_peak.toFixed(4)} h⁻¹<br />
              <span className="text-amber-400 font-bold">Relative to safe 4°C: {relativeMultiplier}x pathogen reproduction speed!</span>
            </div>
          </div>

          {/* Formula 2: Thermal Degree Hours */}
          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <span className="text-emerald-300 font-bold block">2. Thermal Abuse Degree-Hours Integral:</span>
            <div className="font-mono text-slate-300 bg-slate-900 p-2 rounded border border-slate-800 text-[11px]">
              Degree-Hours = ∫ max(0, T(t) - 4.0°C) dt
            </div>
            <div className="text-slate-400 text-[11px] space-y-1">
              <div>HACCP Cold-Chain Action Rule:</div>
              <div>• Baseline cold threshold: <span className="font-mono text-white">4.0°C</span></div>
              <div>• Maximum allowable critical degree-hours: <span className="font-mono text-white">15.0 °C·h</span></div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-cyan-300">
              Integrated area under curve over 24 hours:<br />
              Cumulative Score: <span className="text-white font-bold">{summary.totalDegreeHours} °C·h</span><br />
              <span className={summary.quarantineTriggered ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {summary.quarantineTriggered ? 'BREACH: Exceeded 15.0 °C·h limit! Auto-quarantine enforced.' : 'WITHIN LIMIT: Safe for intake.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Telemetry Curve Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div>
            <h3 className="text-sm font-bold text-white">24-Hour IoT Reefer Temperature Telemetry Waveform</h3>
            <p className="text-xs text-slate-400">
              Sensor readings against 4°C safe baseline and 12°C HACCP critical control point
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-0.5 bg-cyan-400"></span>
              <span>Reefer Temp (°C)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-0.5 bg-emerald-400 border-b border-dashed"></span>
              <span>4°C Safe Baseline</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-400">
              <span className="w-3 h-0.5 bg-red-400 border-b border-dashed"></span>
              <span>12°C Excursion Limit</span>
            </div>
          </div>
        </div>

        {/* Chart View */}
        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 800 240" className="w-full h-64 min-w-[650px] bg-slate-950 rounded-lg p-2">
            {/* Grid Lines */}
            <line x1="50" y1="20" x2="780" y2="20" stroke="#1e293b" />
            <line x1="50" y1="75" x2="780" y2="75" stroke="#1e293b" />
            <line x1="50" y1="130" x2="780" y2="130" stroke="#1e293b" />
            <line x1="50" y1="185" x2="780" y2="185" stroke="#1e293b" />

            {/* Y Axis Labels */}
            <text x="40" y="25" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">20°C</text>
            <text x="40" y="80" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">15°C</text>
            <text x="40" y="135" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">10°C</text>
            <text x="40" y="190" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">5°C</text>

            {/* 4°C Safe Limit (Y = 196) */}
            <line x1="50" y1="196" x2="780" y2="196" stroke="#10b981" strokeDasharray="3 3" strokeWidth="1.5" />

            {/* 12°C Limit (Y = 108) */}
            <line x1="50" y1="108" x2="780" y2="108" stroke="#ef4444" strokeDasharray="3 3" strokeWidth="1.5" />

            {/* Path mapping */}
            {(() => {
              const points = logs.map((log) => {
                const x = 50 + (log.timeIndexHours / 24) * 730;
                const y = 240 - (log.temperatureC / 20) * 220;
                return `${x},${y}`;
              });
              const pathD = `M ${points.join(' L ')}`;

              return (
                <path
                  d={pathD}
                  fill="none"
                  stroke={summary.quarantineTriggered ? '#ef4444' : '#06b6d4'}
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />
              );
            })()}

            {/* Hour X-Axis Markers */}
            {[0, 4, 8, 12, 16, 20, 24].map((h) => {
              const x = 50 + (h / 24) * 730;
              return (
                <g key={h}>
                  <line x1={x} y1="215" x2={x} y2="222" stroke="#475569" />
                  <text x={x} y="235" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">
                    {h}h
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Webhook Output Simulation */}
        <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
            <span>Automated Pre-Dock Graph Webhook Dispatch</span>
            <span className="text-[10px] text-cyan-400">IOT_EVENT_LISTENER_ACTIVE</span>
          </div>
          <div className="mt-2 text-slate-300 leading-relaxed">
            {summary.quarantineTriggered ? (
              <span className="text-red-400">
                [ALERT] Cold-chain excursion detected for container #REEFER-TR-402 ({summary.totalDegreeHours} Degree-Hours).
                Neo4j query executed: <span className="text-amber-300">MATCH (lot:Lot &#123;asset_id: 'REEFER-TR-402'&#125;) SET lot.status = 'QUARANTINED'</span>. Dock intake locked.
              </span>
            ) : (
              <span className="text-emerald-400">
                [INFO] Reefer telemetry nominal. Mean temperature {logs[0]?.temperatureC || 3.2}°C. Lot approved for regular dock unloading.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
