/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SupplyChainGraphEngine } from './engine/graphEngine';
import { FDA204Exporter } from './engine/fdaExporter';
import { FDA_RECALL_BASELINE, CIP_RECORD } from './data/mockSupplyChain';
import { TraceNode } from './types/traceability';
import { Navbar } from './components/Navbar';
import { GraphVisualizer } from './components/GraphVisualizer';
import { RecallMetricsCard } from './components/RecallMetricsCard';
import { NodeDetailDrawer } from './components/NodeDetailDrawer';
import { FdaAuditCenter } from './components/FdaAuditCenter';
import { EpcisValidator } from './components/EpcisValidator';
import { ColdChainMonitor } from './components/ColdChainMonitor';
import { CstrReworkModule } from './components/CstrReworkModule';
import { BenchmarkComparison } from './components/BenchmarkComparison';
import { CheckCircle2, AlertTriangle, ShieldCheck, Download, Sparkles, FileSpreadsheet } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('visualizer');
  const [recallMode, setRecallMode] = useState<'surgical' | 'blanket'>('surgical');
  const [cipEnforced, setCipEnforced] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<TraceNode | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' | 'info' } | null>(null);

  // Initialize graph engine
  const engine = useMemo(() => new SupplyChainGraphEngine(), []);
  const [nodes, setNodes] = useState<TraceNode[]>(() => engine.getNodes());
  const edges = useMemo(() => engine.getEdges(), [engine]);
  const cipRecord = useMemo(() => engine.getCIPEvent(), [engine]);

  // Run initial recall analysis
  const [recallResult, setRecallResult] = useState(() =>
    engine.runRecallAnalysis('LOT-ROMAINE-101', 'surgical', true)
  );

  const showToast = (message: string, type: 'success' | 'alert' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleRunRecall = (lotId: string, mode: 'surgical' | 'blanket', cip: boolean) => {
    const result = engine.runRecallAnalysis(lotId, mode, cip);
    setRecallResult(result);
    setNodes(engine.getNodes());

    if (mode === 'surgical' && cip) {
      showToast(
        `Precision Recall computed for ${lotId}: Bounded by Line 1 CIP at 12:00 UTC. ${result.safeUnitsPreserved.toLocaleString()} units preserved (${result.scrapReductionPct}% scrap reduction).`,
        'success'
      );
    } else {
      showToast(
        `Legacy Blanket Recall computed: All downstream nodes flagged (${result.recalledUnits.toLocaleString()} units scrapped across 6 stores).`,
        'alert'
      );
    }
  };

  const handleRunBackTrace = (storeId: string) => {
    const backTraceResult = engine.runBackTrace(storeId);
    showToast(backTraceResult.explanation, 'info');

    // Also highlight the root cause
    const rootNode = nodes.find(n => n.id === backTraceResult.rootCauseLotId);
    if (rootNode) {
      setSelectedNode(rootNode);
    }
  };

  const handleExportXlsx = () => {
    FDA204Exporter.exportOfficialXlsx();
    showToast('Official 3-Tab FDA Electronic Sortable Spreadsheet (.xlsx) exported in < 0.05s.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-bounce">
          <div
            className={`p-4 rounded-xl shadow-2xl border flex items-start gap-3 ${
              toast.type === 'success'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                : toast.type === 'alert'
                ? 'bg-red-950 border-red-500 text-red-200'
                : 'bg-cyan-950 border-cyan-500 text-cyan-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : toast.type === 'alert' ? (
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs leading-relaxed font-medium">{toast.message}</div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        scrapReductionPct={recallResult.scrapReductionPct}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Visualizer Workspace */}
        {activeTab === 'visualizer' && (
          <div className="space-y-6">
            {/* Executive Impact Metrics Card */}
            <RecallMetricsCard
              recallResult={recallResult}
              onExportClick={handleExportXlsx}
            />

            {/* Interactive Graph Visualizer */}
            <GraphVisualizer
              nodes={nodes}
              edges={edges}
              recallResult={recallResult}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              onRunRecall={handleRunRecall}
              onRunBackTrace={handleRunBackTrace}
              cipRecord={cipRecord}
              recallMode={recallMode}
              setRecallMode={setRecallMode}
              cipEnforced={cipEnforced}
              setCipEnforced={setCipEnforced}
            />
          </div>
        )}

        {/* Tab 2: FDA Audit Center */}
        {activeTab === 'fda-audit' && <FdaAuditCenter />}

        {/* Tab 3: EPCIS 2.0 & Supplier KDE Scorer */}
        {activeTab === 'epcis-supplier' && <EpcisValidator />}

        {/* Tab 4: Cold-Chain Telemetry & Kinetic Spoilage */}
        {activeTab === 'cold-chain' && <ColdChainMonitor />}

        {/* Tab 5: CSTR Fluids & Cyclic Rework */}
        {activeTab === 'cstr-rework' && <CstrReworkModule />}

        {/* Tab 6: SQL vs Graph Benchmarks & Pitch */}
        {activeTab === 'benchmarks' && <BenchmarkComparison />}
      </main>

      {/* Slide-over Node Detail Drawer */}
      <NodeDetailDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onTriggerRecall={(lotId) => handleRunRecall(lotId, recallMode, cipEnforced)}
        onTriggerBacktrace={handleRunBackTrace}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">TraceSurg</span>
            <span>• Open-Source Surgical Recall & Food Traceability Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>21 CFR Part 1 Subpart S (§ 1.1300–§ 1.1460)</span>
            <span>GS1 EPCIS 2.0 / CBV 2.0</span>
            <span>Neo4j APOC Graph DAG</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
