/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CIPEvent } from '../types/traceability';
import { ShieldAlert, AlertTriangle, CheckCircle2, Flame, RefreshCw, Zap, Award } from 'lucide-react';

interface ChaosFalsifierProps {
  currentCip: CIPEvent;
  onUpdateCip: (updated: CIPEvent) => void;
  onResetCip: () => void;
}

export const ChaosFalsifier: React.FC<ChaosFalsifierProps> = ({
  currentCip,
  onUpdateCip,
  onResetCip
}) => {
  const [atpScore, setAtpScore] = useState<number>(currentCip.atpSwabRLU);
  const [chemicalPpm, setChemicalPpm] = useState<number>(currentCip.chemicalPpm);
  const [washTemp, setWashTemp] = useState<number>(currentCip.washTemperatureC);

  const isAtpFail = atpScore >= 25; // > 25 RLU fails FDA/GFSI hygiene standards
  const isChemicalFail = chemicalPpm < 150; // < 150 ppm fails PAA sanitizer lethality
  const isTempFail = washTemp < 55; // < 55°C fails caustic detergent dissolution

  const isCipInvalid = isAtpFail || isChemicalFail || isTempFail;

  const handleApplyChaos = (newAtp: number, newPpm: number, newTemp: number) => {
    setAtpScore(newAtp);
    setChemicalPpm(newPpm);
    setWashTemp(newTemp);

    const validated = newAtp < 25 && newPpm >= 150 && newTemp >= 55;
    onUpdateCip({
      ...currentCip,
      atpSwabRLU: newAtp,
      chemicalPpm: newPpm,
      washTemperatureC: newTemp,
      validated,
      notes: validated
        ? 'Validated clean line break. Physical heel & biofilm eradicated (8 RLU PASS).'
        : `CRITICAL SANITATION DEFICIENCY DETECTED: ATP Swab ${newAtp} RLU (limit <25), Chemical Titration ${newPpm} PPM (target 150-250). Traversal boundary invalidated—Shift B exposed to cross-contamination!`
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              AGENT 2: ADVERSARIAL CHAOS INJECTOR
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Falsification Stress-Testing • Dirty CIP & Boundary Bleed
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Sanitation Boundary Falsifier & Stress-Testing Suite
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            In food safety, software fails when humans fake wash logs. This engine allows you to inject dirty line breaks (high ATP swabs, diluted chemicals) to verify that the graph engine dynamically refuses to prune clean batches and safely widens the recall.
          </p>
        </div>

        <button
          onClick={() => {
            handleApplyChaos(8, 210, 68);
            onResetCip();
          }}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Validated CIP Baseline</span>
        </button>
      </div>

      {/* Live Status Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between shadow-xl ${
          isCipInvalid
            ? 'bg-rose-950/40 border-rose-500 text-rose-200'
            : 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
        }`}
      >
        <div className="flex items-center gap-3">
          {isCipInvalid ? (
            <Flame className="w-6 h-6 text-rose-400 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          )}
          <div>
            <div className="text-sm font-bold">
              {isCipInvalid
                ? 'CIP SANITATION BARRIER BREACHED: BOUNDARY PRUNING DISABLED'
                : 'CIP SANITATION BARRIER FULLY VALIDATED: RECALL BOUNDED SAFELY'}
            </div>
            <div className="text-xs opacity-90 mt-0.5">
              {isCipInvalid
                ? 'Shift B is NO LONGER protected! Residual biofilms or product heels on Line 1 mean Shift B must be recalled.'
                : 'Shift B is mathematically proven safe. ATP swab (8 RLU) confirms physical line clearance.'}
            </div>
          </div>
        </div>

        <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-black/40 border border-current">
          {isCipInvalid ? 'BOUNDARY: FAIL' : 'BOUNDARY: PASS'}
        </span>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* ATP Swab Slider */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold">ATP Bioluminescence Swab</span>
            <span className={`font-mono font-bold ${isAtpFail ? 'text-rose-400' : 'text-emerald-400'}`}>
              {atpScore} RLU {isAtpFail ? '(FAILED >25)' : '(PASS)'}
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="120"
            step="2"
            value={atpScore}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              handleApplyChaos(val, chemicalPpm, washTemp);
            }}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">
            Measures residual adenosine triphosphate on conveyor belt & weigh hoppers. Limit is 25 RLU.
          </p>
        </div>

        {/* Chemical PAA Concentration */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold">Sanitizer Concentration (PAA)</span>
            <span className={`font-mono font-bold ${isChemicalFail ? 'text-rose-400' : 'text-cyan-400'}`}>
              {chemicalPpm} PPM {isChemicalFail ? '(FAILED <150)' : '(PASS)'}
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="300"
            step="10"
            value={chemicalPpm}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              handleApplyChaos(atpScore, val, washTemp);
            }}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">
            Peracetic acid titration in wash flume nozzles. Must maintain 150-250 PPM for microbial lethality.
          </p>
        </div>

        {/* Wash Water Temp */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold">Caustic Wash Temperature</span>
            <span className={`font-mono font-bold ${isTempFail ? 'text-rose-400' : 'text-amber-400'}`}>
              {washTemp}°C {isTempFail ? '(FAILED <55)' : '(PASS)'}
            </span>
          </div>
          <input
            type="range"
            min="30"
            max="85"
            step="1"
            value={washTemp}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              handleApplyChaos(atpScore, chemicalPpm, val);
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">
            Hot water alkali rinse temperature. Must exceed 55°C to emulsify vegetable oils and fats.
          </p>
        </div>
      </div>

      {/* Preset Falsification Scenarios */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-rose-400" />
          <span>One-Click Adversarial Attack Scenarios (Antigravity Falsifier Bench)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => handleApplyChaos(68, 80, 42)}
            className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/60 cursor-pointer transition-all hover:bg-slate-900"
          >
            <div className="text-xs font-bold text-rose-400 flex items-center justify-between">
              <span>Attack 1: "The Diluted Chemical Wash"</span>
              <span className="text-[10px] bg-rose-500/20 px-1.5 py-0.2 rounded font-mono">ATP: 68 RLU</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Sanitation technician ran out of PAA drum. Line washed with cold water and 80 PPM chemical. Tests whether the recall engine catches the breach.
            </p>
          </div>

          <div
            onClick={() => handleApplyChaos(44, 200, 65)}
            className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/60 cursor-pointer transition-all hover:bg-slate-900"
          >
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Attack 2: "The Biofilm Heel Failure"</span>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded font-mono">ATP: 44 RLU</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Chemical was strong (200 PPM), but centrifugal shredder had organic build-up (44 RLU). Tests edge-pruning refusal.
            </p>
          </div>

          <div
            onClick={() => handleApplyChaos(8, 210, 68)}
            className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/60 cursor-pointer transition-all hover:bg-slate-900"
          >
            <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
              <span>Restore: "Gold Standard Validation"</span>
              <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded font-mono">ATP: 8 RLU</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Perfect 4-stage CIP: 68°C caustic flush, 210 PPM PAA, 8 RLU swab. Re-enables surgical precision bounding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
