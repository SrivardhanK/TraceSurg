/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldCheck, Network, FileSpreadsheet, Activity, ThermometerSnowflake, 
  Cpu, Presentation, Flame, GitPullRequest, Truck, Sparkles, Award
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scrapReductionPct: number;
  cipStatusValid: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  scrapReductionPct,
  cipStatusValid 
}) => {
  const navItems = [
    { id: 'visualizer', label: 'Surgical Recall DAG', icon: Network },
    { id: 'fda-audit', label: 'FDA 204 Exporter', icon: FileSpreadsheet },
    { id: 'chaos-falsifier', label: 'Adversarial Falsifier', icon: Flame },
    { id: 'bayesian', label: 'Bayesian Attribution', icon: GitPullRequest },
    { id: 'clc-retail', label: 'Calculated Lot Code', icon: Truck },
    { id: 'agentic-ingest', label: 'Agentic Paperwork', icon: Sparkles },
    { id: 'cold-chain', label: 'Cold-Chain IoT', icon: ThermometerSnowflake },
    { id: 'cstr-rework', label: 'CSTR & Rework', icon: Cpu },
    { id: 'benchmarks', label: 'SQL vs Graph', icon: Presentation },
    { id: 'mock-audit', label: 'FDA 483 Mock Defense', icon: Award },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Top Banner / Regulatory Status Bar */}
      <div className="bg-emerald-950/80 border-b border-emerald-800/40 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            FSMA RULE 204 (21 CFR § 1.1315)
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Production-Grade Reference Engine • Fresh-Cut RTE Romaine Salad Bowls
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span
              className={`w-2 h-2 rounded-full ${
                cipStatusValid ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500 animate-ping'
              }`}
            ></span>
            <span className={cipStatusValid ? 'text-emerald-300' : 'text-rose-400 font-bold'}>
              {cipStatusValid
                ? `CIP BARRIER VALID (${scrapReductionPct}% SCRAP REDUCED)`
                : 'CIP BARRIER BREACHED (DIRTY LINE)'}
            </span>
          </div>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-amber-300/90 text-[11px] hidden md:inline">
            Enforcement Window: July 20, 2028 (Retailers Mandating Now)
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('visualizer')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent">
                  TraceSurg
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                  v2.0 Enterprise Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                GS1 EPCIS 2.0 • CIP DAG Traversal • Bayesian MAP • 1-Click FDA Exporter
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex overflow-x-auto pb-2 gap-1.5 no-scrollbar border-t border-slate-800/80 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                    : 'text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
