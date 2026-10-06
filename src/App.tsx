/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SupplyChainGraphEngine } from './engine/graphEngine';
import { FDA204Exporter } from './engine/fdaExporter';
import { CIP_RECORD, ALL_SCENARIOS, SCENARIO_ROMAINE, CommodityScenario } from './data/mockSupplyChain';
import { TraceNode, CIPEvent } from './types/traceability';
import { Navbar } from './components/Navbar';
import { GraphVisualizer } from './components/GraphVisualizer';
import { RecallMetricsCard } from './components/RecallMetricsCard';
import { NodeDetailDrawer } from './components/NodeDetailDrawer';
import { FdaAuditCenter } from './components/FdaAuditCenter';
import { ColdChainMonitor } from './components/ColdChainMonitor';
import { CstrReworkModule } from './components/CstrReworkModule';
import { BenchmarkComparison } from './components/BenchmarkComparison';
import { ChaosFalsifier } from './components/ChaosFalsifier';
import { BayesianAttribution } from './components/BayesianAttribution';
import { ClcInference } from './components/ClcInference';
import { AgenticIngestion } from './components/AgenticIngestion';
import { MockInspection } from './components/MockInspection';
import { DocumentationCenter } from './components/DocumentationCenter';
import { CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('visualizer');
  const [currentScenarioId, setCurrentScenarioId] = useState<string>('romaine-salad');
  const [recallMode, setRecallMode] = useState<'surgical' | 'blanket'>('surgical');

  const currentScenario = useMemo(() => {
    return ALL_SCENARIOS[currentScenarioId] || SCENARIO_ROMAINE;
  }, [currentScenarioId]);

  const [cipRecord, setCipRecord] = useState<CIPEvent>({ ...currentScenario.cipRecord });
  const [cipEnforced, setCipEnforced] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<TraceNode | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' | 'info' } | null>(null);

  // Initialize graph engine with current scenario and CIP record
  const engine = useMemo(() => {
    return new SupplyChainGraphEngine(currentScenario.nodes, currentScenario.edges, cipRecord);
  }, [currentScenario, cipRecord]);

  const [nodes, setNodes] = useState<TraceNode[]>(() => engine.getNodes());
  const edges = useMemo(() => engine.getEdges(), [engine]);

  // Run initial recall analysis
  const [recallResult, setRecallResult] = useState(() =>
    engine.runRecallAnalysis(currentScenario.openFdaBaseline.suspectLotId, recallMode, cipRecord.validated && cipEnforced)
  );

  const showToast = (message: string, type: 'success' | 'alert' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleSelectScenario = (scenarioId: string) => {
    const sc = ALL_SCENARIOS[scenarioId] || SCENARIO_ROMAINE;
    setCurrentScenarioId(scenarioId);
    setCipRecord({ ...sc.cipRecord });
    const newEngine = new SupplyChainGraphEngine(sc.nodes, sc.edges, sc.cipRecord);
    const result = newEngine.runRecallAnalysis(
      sc.openFdaBaseline.suspectLotId,
      recallMode,
      sc.cipRecord.validated && cipEnforced
    );
    setRecallResult(result);
    setNodes(newEngine.getNodes());
    setSelectedNode(null);
    showToast(`Loaded scenario: ${sc.name} • ${sc.hazardPathogen}`, 'info');
  };

  const handleRunRecall = (lotId: string, mode: 'surgical' | 'blanket', cip: boolean) => {
    const isEffectivelyEnforced = cip && cipRecord.validated;
    const result = engine.runRecallAnalysis(lotId, mode, isEffectivelyEnforced);
    setRecallResult(result);
    setNodes(engine.getNodes());

    if (mode === 'surgical' && isEffectivelyEnforced) {
      showToast(
        `Precision Recall computed for ${lotId}: Bounded by Line CIP. ${result.safeUnitsPreserved.toLocaleString()} units preserved (${result.scrapReductionPct}% scrap reduction).`,
        'success'
      );
    } else if (mode === 'surgical' && !cipRecord.validated) {
      showToast(
        `ADVERSARIAL BREACH DETECTED: Line failed sanitation (ATP: ${cipRecord.atpSwabRLU} RLU). Recall forced to expand to Shift B!`,
        'alert'
      );
    } else {
      showToast(
        `Legacy Blanket Recall computed: All downstream nodes flagged (${result.recalledUnits.toLocaleString()} units scrapped across 6 stores).`,
        'alert'
      );
    }
  };

  const handleUpdateCip = (updated: CIPEvent) => {
    setCipRecord(updated);
    const result = engine.runRecallAnalysis(
      recallResult.suspectLotId,
      recallMode,
      updated.validated && cipEnforced
    );
    setRecallResult(result);
    setNodes(engine.getNodes());

    if (!updated.validated) {
      showToast(
        `Adversarial attack applied: Line sanitation invalidated. Recalling Shift B!`,
        'alert'
      );
    } else {
      showToast(`Clean baseline restored: ${updated.atpSwabRLU} RLU ATP swab verified.`, 'success');
    }
  };

  const handleResetCip = () => {
    setCipRecord({ ...currentScenario.cipRecord });
    const result = engine.runRecallAnalysis(currentScenario.openFdaBaseline.suspectLotId, 'surgical', true);
    setRecallResult(result);
    setNodes(engine.getNodes());
  };

  const handleRunBackTrace = (storeId: string) => {
    const backTraceResult = engine.runBackTrace(storeId);
    showToast(backTraceResult.explanation, 'info');

    const rootNode = nodes.find(n => n.id === backTraceResult.rootCauseLotId);
    if (rootNode) {
      setSelectedNode(rootNode);
    }
  };

  const handleExportXlsx = () => {
    FDA204Exporter.exportOfficialXlsx(
      `FDA_FSMA204_${currentScenario.id.toUpperCase()}_Recall_Report.xlsx`,
      currentScenario
    );
    showToast(`Official 4-Tab FDA Electronic Sortable Spreadsheet for ${currentScenario.name} exported in < 0.05s.`, 'success');
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
                ? 'bg-rose-950 border-rose-500 text-rose-200'
                : 'bg-cyan-950 border-cyan-500 text-cyan-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : toast.type === 'alert' ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
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
        cipStatusValid={cipRecord.validated}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Visualizer Workspace */}
        {activeTab === 'visualizer' && (
          <div className="space-y-6">
            <RecallMetricsCard
              recallResult={recallResult}
              onExportClick={handleExportXlsx}
            />

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
              currentScenarioId={currentScenarioId}
              onSelectScenario={handleSelectScenario}
            />
          </div>
        )}

        {/* Tab 2: Documentation & Systems Architecture Dossier */}
        {activeTab === 'documentation' && <DocumentationCenter />}

        {/* Tab 3: FDA Audit Center */}
        {activeTab === 'fda-audit' && <FdaAuditCenter scenario={currentScenario} />}

        {/* Tab 4: Adversarial Chaos Falsifier */}
        {activeTab === 'chaos-falsifier' && (
          <ChaosFalsifier
            currentCip={cipRecord}
            onUpdateCip={handleUpdateCip}
            onResetCip={handleResetCip}
          />
        )}

        {/* Tab 5: Bayesian Upstream Attribution */}
        {activeTab === 'bayesian' && <BayesianAttribution />}

        {/* Tab 6: Calculated Lot Code Last-Mile */}
        {activeTab === 'clc-retail' && <ClcInference />}

        {/* Tab 7: Agentic Paperwork Ingestion */}
        {activeTab === 'agentic-ingest' && <AgenticIngestion />}

        {/* Tab 8: Cold-Chain Telemetry & Kinetic Spoilage */}
        {activeTab === 'cold-chain' && <ColdChainMonitor />}

        {/* Tab 9: CSTR Fluids & Cyclic Rework */}
        {activeTab === 'cstr-rework' && <CstrReworkModule />}

        {/* Tab 10: SQL vs Graph Benchmarks & Pitch */}
        {activeTab === 'benchmarks' && <BenchmarkComparison />}

        {/* Tab 11: FDA 483 Mock Defense */}
        {activeTab === 'mock-audit' && <MockInspection />}
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
            <span className="font-bold text-slate-300">TraceSurg Enterprise</span>
            <span>• Open-Source Surgical Recall & Food Traceability Platform</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>21 CFR Part 1 Subpart S (§ 1.1300–§ 1.1460)</span>
            <span>GS1 EPCIS 2.0 / CBV 2.0</span>
            <span>Bayesian MAP Inference</span>
            <span>Neo4j APOC Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
