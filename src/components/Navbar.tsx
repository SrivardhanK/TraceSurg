/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Network, FileSpreadsheet, Activity, ThermometerSnowflake, Cpu, Presentation, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scrapReductionPct: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, scrapReductionPct }) => {
  const navItems = [
    { id: 'visualizer', label: 'Surgical Recall DAG', icon: Network },
    { id: 'fda-audit', label: 'FDA 204 Exporter (§ 1.1315)', icon: FileSpreadsheet },
    { id: 'epcis-supplier', label: 'GS1 EPCIS 2.0 & Supplier KDE', icon: Activity },
    { id: 'cold-chain', label: 'Cold-Chain IoT (Ratkowsky)', icon: ThermometerSnowflake },
    { id: 'cstr-rework', label: 'CSTR Fluids & Rework', icon: Cpu },
    { id: 'benchmarks', label: 'SQL vs Graph & Pitch', icon: Presentation },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Top Banner / Regulatory Status Bar */}
      <div className="bg-emerald-950/80 border-b border-emerald-800/40 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            FSMA RULE 204 READY
          </span>
          <span className="text-slate-300 hidden sm:inline">
            21 CFR Part 1 Subpart S (§ 1.1315) • Compliance Benchmark: Fresh-Cut Ready-to-Eat (RTE) Leafy Greens
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CIP BOUNDARY: ENFORCED ({scrapReductionPct}% SCRAP REDUCTION)</span>
          </div>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-amber-300/90 text-[11px] hidden md:inline">
            Enforcement Window: July 20, 2028 (Tier-1 Retailers Mandating Now)
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
                  Open-Source FSQA Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                GS1 EPCIS 2.0 • DAG Sanitation Pruning • 1-Click FDA Sortable Spreadsheet
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="flex lg:hidden overflow-x-auto pb-2 gap-1 no-scrollbar border-t border-slate-800/80 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
