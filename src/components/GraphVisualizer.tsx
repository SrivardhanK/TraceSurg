/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { TraceNode, TraceEdge, RecallAnalysisResult, CIPEvent } from '../types/traceability';
import { CommodityScenario, ALL_SCENARIOS } from '../data/mockSupplyChain';
import { 
  AlertTriangle, ShieldCheck, CheckCircle2, Search, Sliders, RefreshCw, 
  ArrowRight, Info, Eye, Layers, Sparkles, X, ChevronRight, Lock, Check,
  Play, Pause, SkipForward, SkipBack, Compass, HelpCircle, GitBranch, Settings2,
  FileCode, Calendar, MapPin
} from 'lucide-react';

interface GraphVisualizerProps {
  nodes: TraceNode[];
  edges: TraceEdge[];
  recallResult: RecallAnalysisResult;
  selectedNode: TraceNode | null;
  setSelectedNode: (node: TraceNode | null) => void;
  onRunRecall: (lotId: string, mode: 'surgical' | 'blanket', cipEnforced: boolean) => void;
  onRunBackTrace: (storeId: string) => void;
  cipRecord: CIPEvent;
  recallMode: 'surgical' | 'blanket';
  setRecallMode: (mode: 'surgical' | 'blanket') => void;
  cipEnforced: boolean;
  setCipEnforced: (val: boolean) => void;
  currentScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  nodes,
  edges,
  recallResult,
  selectedNode,
  setSelectedNode,
  onRunRecall,
  onRunBackTrace,
  cipRecord,
  recallMode,
  setRecallMode,
  cipEnforced,
  setCipEnforced,
  currentScenarioId,
  onSelectScenario
}) => {
  const [showCypherSnippet, setShowCypherSnippet] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<TraceEdge | null>(null);

  // Custom Outbreak Injection Modal
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customLotInput, setCustomLotInput] = useState('LOT-CUSTOM-99');
  const [customPathogen, setCustomPathogen] = useState('Listeria monocytogenes');
  const [customAtp, setCustomAtp] = useState(8);
  const [customPpm, setCustomPpm] = useState(210);

  // 9-Stage CTE Lifecycle Timeline & Stepper
  const [currentCteStage, setCurrentCteStage] = useState<number>(8); // default to final state (Stage 8)
  const [isPlayingCte, setIsPlayingCte] = useState<boolean>(false);

  // Layout node positions organized into 4 logical tiers
  const nodePositions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {
      // Tier 1: Growers (1st 4 nodes)
      'LOT-ROMAINE-101': { x: 90, y: 100 },
      'LOT-ROMAINE-102': { x: 90, y: 240 },
      'LOT-SPINACH-201': { x: 90, y: 380 },
      'LOT-ROMAINE-103': { x: 90, y: 550 },

      // Cheese Scenario Tier 1
      'LOT-MILK-701': { x: 90, y: 120 },
      'LOT-MILK-702': { x: 90, y: 320 },
      'LOT-MILK-703': { x: 90, y: 530 },

      // Melon Scenario Tier 1
      'LOT-CANTALOUPE-801': { x: 90, y: 120 },
      'LOT-HONEYDEW-802': { x: 90, y: 320 },
      'LOT-PINEAPPLE-803': { x: 90, y: 530 },

      // Salmon Scenario Tier 1
      'LOT-SALMON-501': { x: 90, y: 120 },
      'LOT-SALMON-502': { x: 90, y: 320 },
      'LOT-SALMON-503': { x: 90, y: 530 },

      // Sprouted Seed / Nut Butter Tier 1
      'LOT-SPROUT-601': { x: 90, y: 120 },
      'LOT-SPROUT-602': { x: 90, y: 320 },
      'LOT-SPROUT-603': { x: 90, y: 530 },

      // Tier 2: Processor & CIP
      'PROC-FACILITY-PCFF': { x: 390, y: 90 },
      'LOT-SALAD-S501': { x: 410, y: 220 },
      'CIP-EVT-NODE': { x: 410, y: 370 },
      'LOT-SALAD-S502': { x: 410, y: 500 },
      'LOT-SALAD-S503': { x: 410, y: 630 },

      // Tier 3: Pallets & DCs
      'PALLET-SSCC-901': { x: 720, y: 210 },
      'PALLET-SSCC-902': { x: 720, y: 480 },
      'PALLET-SSCC-903': { x: 720, y: 620 },
      'DC-NORTH-50': { x: 800, y: 100 },
      'DC-SOUTH-60': { x: 800, y: 720 },

      // Tier 4: Retail Stores
      'STORE-101-SEATTLE': { x: 1060, y: 140 },
      'STORE-102-PORTLAND': { x: 1060, y: 270 },
      'STORE-103-BOISE': { x: 1060, y: 420 },
      'STORE-201-LA': { x: 1060, y: 560 },
      'STORE-202-SANDIEGO': { x: 1060, y: 680 },
      'STORE-203-PHOENIX': { x: 1060, y: 790 },
    };
    return pos;
  }, []);

  // 9-Stage Critical Tracking Event (CTE) Lifecycle Definitions
  const CTE_STAGES = [
    {
      stage: 0,
      title: 'Stage 1: Harvest & Initial Packing (TLC Genesis)',
      cfrCitation: '21 CFR § 1.1330',
      action: 'Grower assigns Traceability Lot Code in field. Records GPS coordinates, well water microbial logs, and harvest blade sanitation.',
      epcisEvent: 'ObjectEvent (Action: ADD, bizStep: commissioning, disposition: active)',
      activeNodes: ['farm_lot_root'],
      evaluationRule: 'TLC Genesis created at farm origin. Establishing root node in Directed Acyclic Graph.'
    },
    {
      stage: 1,
      title: 'Stage 2: Post-Harvest Pre-Cooling & Hydro-Vac',
      cfrCitation: 'Produce Safety Rule (21 CFR Part 112)',
      action: 'Core temperature pulled down to 2.8°C within 120 minutes of field cut. Time-temperature dwell log cryptographically hashed.',
      epcisEvent: 'ObjectEvent (Action: OBSERVE, bizStep: inspecting, sensorReport: temp 2.8C)',
      activeNodes: ['farm_lot_root'],
      evaluationRule: 'Cold-chain baseline established. Zero pathogen growth observed during dwell.'
    },
    {
      stage: 2,
      title: 'Stage 3: Receiving at Processing Facility Dock',
      cfrCitation: '21 CFR § 1.1335',
      action: 'Raw lots arrive via reefer trailer. Receiving dock verifies TLC Source GLN against supplier Bill of Lading (#BOL-SVG-9041).',
      epcisEvent: 'ObjectEvent (Action: OBSERVE, bizStep: receiving, bizLocation: GLN-0860004.00001.0)',
      activeNodes: ['farm_lot_root', 'PROC-FACILITY-PCFF'],
      evaluationRule: 'Mandatory KDE link verified: Inbound TLC mapped to TLC Source GLN and BOL reference document.'
    },
    {
      stage: 3,
      title: 'Stage 4: Mechanical Preparation & Shredding',
      cfrCitation: '21 CFR § 1.1340',
      action: 'Leaves unboxed and fed into mechanical shredder. Residual biological tissue carries over on conveyor belts.',
      epcisEvent: 'TransformationEvent (Input: TLC-R101, readPoint: LINE1_SHREDDER)',
      activeNodes: ['farm_lot_root', 'PROC-FACILITY-PCFF'],
      evaluationRule: 'Line mechanical feed creates continuous contamination path across hoppers and flumes.'
    },
    {
      stage: 4,
      title: 'Stage 5: Flume Wash Commingling (BOM Transformation)',
      cfrCitation: '21 CFR § 1.1340',
      action: 'Contaminated Romaine Lot 101 commingles with Yuma Romaine and Spinach into Shift A Finished Salad Lot S-501 (4,200 bowls).',
      epcisEvent: 'TransformationEvent (InputEPCList: [R101, R102, SP201] -> OutputEPCList: [S501])',
      activeNodes: ['LOT-SALAD-S501'],
      evaluationRule: 'COMPOUNDING RISK: 3 raw ingredient streams merge into 1 finished lot. Shift A 100% tainted.'
    },
    {
      stage: 5,
      title: 'Stage 6: The Clean-in-Place (CIP) Sanitation Break (The Decision Climax)',
      cfrCitation: 'FDA Preventive Controls for Human Food (21 CFR § 117.135)',
      action: 'Line 1 shuts down at 12:00:00 UTC. Mechanical drain + 210 PPM Peracetic Acid + 68°C caustic rinse. Verified ATP swab: 8 RLU (< 25 pass limit).',
      epcisEvent: 'ObjectEvent (bizStep: sanitizing, chemicalPpm: 210, atpSwabRLU: 8, validated: true)',
      activeNodes: ['CIP-EVT-NODE', 'LOT-SALAD-S502', 'LOT-SALAD-S503'],
      evaluationRule: 'MATHEMATICAL PRUNING: Event time of Shift B (14:30) > CIP timestamp (12:00). Graph traversal HALTS. Shift B declared 100% CLEAN!'
    },
    {
      stage: 6,
      title: 'Stage 7: Primary Packaging & Pallet SSCC Aggregation',
      cfrCitation: '21 CFR § 1.1340 & GS1 General Specs',
      action: 'Finished bowls packed into master cases, cases stacked onto serialized pallets (SSCC-18). Shift A mapped to Pallet SSCC-901.',
      epcisEvent: 'AggregationEvent (Action: ADD, parentID: urn:epc:id:sscc:001086000490100012, childEPCs: [S501])',
      activeNodes: ['PALLET-SSCC-901', 'PALLET-SSCC-902', 'PALLET-SSCC-903'],
      evaluationRule: 'AggregationEvent binds primary batch code to physical logistics handling asset.'
    },
    {
      stage: 7,
      title: 'Stage 8: Distribution Center Shipping & Cross-Docking',
      cfrCitation: '21 CFR § 1.1345',
      action: 'Reefer Trailer TR-401 transports SSCC-901 to Northern DC (Portland). SSCC-902 and 903 dispatched on separate clean routes.',
      epcisEvent: 'ObjectEvent (Action: OBSERVE, bizStep: shipping, destination: GLN-0860005.00050.0)',
      activeNodes: ['DC-NORTH-50', 'DC-SOUTH-60'],
      evaluationRule: 'Shipping KDEs recorded: Shipped TLC, Carrier Name, Trailer ID, Consignee GLN.'
    },
    {
      stage: 8,
      title: 'Stage 9: Retail Shelf Delivery & Blast-Radius Quarantine',
      cfrCitation: '21 CFR § 1.1315',
      action: 'Tainted Shift A bowls delivered to Seattle Store #101 and Portland Store #102. Safe Shift B batches delivered to Boise, LA, and San Diego.',
      epcisEvent: 'ObjectEvent (Action: OBSERVE, bizStep: receiving, bizLocation: GLN-0860007.00101.0)',
      activeNodes: recallResult.recalledNodes,
      evaluationRule: 'SURGICAL QUARANTINE: Only 4,200 bowls recalled across 2 stores. 90.6% of inventory preserved. 4-tab FDA spreadsheet exported in < 0.05s.'
    }
  ];

  // Auto-play timer for CTE Lifecycle Stepper
  useEffect(() => {
    let timer: any;
    if (isPlayingCte) {
      timer = setInterval(() => {
        setCurrentCteStage((prev) => {
          if (prev >= 8) {
            setIsPlayingCte(false);
            return 8;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlayingCte]);

  // Node Color Logic based on active CTE stage
  const getNodeColor = (node: TraceNode) => {
    if (currentCteStage < 0) {
      return { bg: 'fill-slate-800 stroke-slate-600', text: 'text-slate-300', badge: 'bg-slate-700 text-slate-300 border-slate-600', glow: '' };
    }

    if (node.id === recallResult.suspectLotId) {
      return {
        bg: 'fill-amber-500/20 stroke-amber-400',
        text: 'text-amber-300',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
        glow: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]'
      };
    }

    if (node.id === 'CIP-EVT-NODE') {
      const isVisible = currentCteStage >= 5;
      return {
        bg: isVisible ? 'fill-cyan-500/20 stroke-cyan-400' : 'fill-slate-800 stroke-slate-600',
        text: isVisible ? 'text-cyan-300' : 'text-slate-400',
        badge: isVisible ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-slate-700 text-slate-400',
        glow: isVisible ? 'drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]' : ''
      };
    }

    const isRecalled = recallResult.recalledNodes.includes(node.id);

    if (isRecalled) {
      let isStageActive = false;
      if (currentCteStage === 0 && node.id === recallResult.suspectLotId) isStageActive = true;
      if (currentCteStage >= 1 && currentCteStage <= 3 && (node.tier === 'grower')) isStageActive = true;
      if (currentCteStage >= 4 && (node.tier === 'grower' || node.id === 'LOT-SALAD-S501')) isStageActive = true;
      if (currentCteStage >= 6 && (node.tier === 'grower' || node.id === 'LOT-SALAD-S501' || node.id === 'PALLET-SSCC-901')) isStageActive = true;
      if (currentCteStage >= 7 && (node.tier === 'grower' || node.id === 'LOT-SALAD-S501' || node.id === 'PALLET-SSCC-901' || node.tier === 'retail')) isStageActive = true;

      if (isStageActive) {
        return {
          bg: 'fill-red-500/20 stroke-red-500',
          text: 'text-red-300',
          badge: 'bg-red-500/20 text-red-300 border-red-500/50',
          glow: 'drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]'
        };
      }
    }

    if (node.status === 'safe_post_cip' && currentCteStage >= 5) {
      return {
        bg: 'fill-emerald-500/20 stroke-emerald-400',
        text: 'text-emerald-300',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
        glow: 'drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]'
      };
    }

    return {
      bg: 'fill-slate-800 stroke-slate-600',
      text: 'text-slate-300',
      badge: 'bg-slate-700 text-slate-300 border-slate-600',
      glow: ''
    };
  };

  const handleApplyCustomOutbreak = () => {
    onRunRecall(customLotInput, recallMode, cipEnforced);
    setShowCustomModal(false);
  };

  return (
    <div className="space-y-4">
      {/* GLOBAL SCENARIO SWITCHER & CONTROLS HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Scenario Selector & Mode Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Commodity Scenario Switcher */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <GitBranch className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">FTL Commodity:</span>
              <select
                value={currentScenarioId}
                onChange={(e) => onSelectScenario(e.target.value)}
                className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
              >
                {Object.values(ALL_SCENARIOS).map((sc) => (
                  <option key={sc.id} value={sc.id} className="bg-slate-900 text-white">
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Selector */}
            <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg">
              <button
                onClick={() => {
                  setRecallMode('surgical');
                  onRunRecall(recallResult.suspectLotId, 'surgical', cipEnforced);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  recallMode === 'surgical'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Surgical (CIP-Bounded)</span>
              </button>
              <button
                onClick={() => {
                  setRecallMode('blanket');
                  onRunRecall(recallResult.suspectLotId, 'blanket', false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  recallMode === 'blanket'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-300" />
                <span>Blanket (Unbounded)</span>
              </button>
            </div>

            {/* CIP Enforcement Checkbox */}
            {recallMode === 'surgical' && (
              <label className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={cipEnforced}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setCipEnforced(checked);
                    onRunRecall(recallResult.suspectLotId, 'surgical', checked);
                  }}
                  className="rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 bg-slate-900 w-4 h-4"
                />
                <span className="text-slate-200 font-medium">CIP Barrier</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  {cipRecord.endTime.split('T')[1]?.slice(0, 5) || '12:00'} UTC ({cipRecord.atpSwabRLU} RLU)
                </span>
              </label>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCustomModal(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold border border-purple-500/40 flex items-center gap-1.5"
            >
              <Settings2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Custom Lot Injector</span>
            </button>
            <button
              onClick={() => setShowCypherSnippet(!showCypherSnippet)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showCypherSnippet ? 'Hide Cypher' : 'View Cypher APOC'}</span>
            </button>
            <button
              onClick={() => {
                onRunRecall(recallResult.suspectLotId, recallMode, cipEnforced);
                setCurrentCteStage(8);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-medium flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 9-STAGE CRITICAL TRACKING EVENT (CTE) TIMELINE & STEPPER */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>FDA FSMA 204 CTE Lifecycle Timeline:</span>
              </span>

              {/* Player Buttons */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => {
                    setIsPlayingCte(false);
                    setCurrentCteStage(0);
                  }}
                  title="Reset to Stage 1"
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white text-xs"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setIsPlayingCte(false);
                    setCurrentCteStage(prev => Math.max(0, prev - 1));
                  }}
                  disabled={currentCteStage === 0}
                  className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 text-xs font-bold"
                >
                  ◀
                </button>
                <button
                  onClick={() => setIsPlayingCte(!isPlayingCte)}
                  className="px-2 py-0.5 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 text-xs font-bold flex items-center gap-1"
                >
                  {isPlayingCte ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isPlayingCte ? 'Pause' : 'Play CTEs'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsPlayingCte(false);
                    setCurrentCteStage(prev => Math.min(8, prev + 1));
                  }}
                  disabled={currentCteStage === 8}
                  className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 text-xs font-bold"
                >
                  ▶
                </button>
                <button
                  onClick={() => {
                    setIsPlayingCte(false);
                    setCurrentCteStage(8);
                  }}
                  title="Complete Lifecycle"
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white text-xs"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Stage Counter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {CTE_STAGES.map((s, idx) => (
                <button
                  key={s.stage}
                  onClick={() => {
                    setIsPlayingCte(false);
                    setCurrentCteStage(idx);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all whitespace-nowrap ${
                    currentCteStage === idx
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  S{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Active Stage Callout Box */}
          <div className="text-xs space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-bold text-cyan-300 text-xs flex items-center gap-2">
                <span>{CTE_STAGES[currentCteStage].title}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  {CTE_STAGES[currentCteStage].cfrCitation}
                </span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                {CTE_STAGES[currentCteStage].epcisEvent}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {CTE_STAGES[currentCteStage].action}
            </p>
            <div className="text-[11px] font-mono text-amber-300/90 pt-0.5">
              <strong>Algorithmic Decision:</strong> {CTE_STAGES[currentCteStage].evaluationRule}
            </div>
          </div>
        </div>

        {/* Expandable Cypher Snippet */}
        {showCypherSnippet && (
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-2">
              <span className="text-cyan-400 font-semibold">// Neo4j APOC Cypher Traversal Query</span>
              <span className="text-slate-500 text-[10px]">Latency: {recallResult.traversalTimeMs}ms</span>
            </div>
            <pre className="text-slate-400 overflow-x-auto text-[11px] leading-relaxed">
{`MATCH (source:Lot {lot_id: '${recallResult.suspectLotId}'})
CALL apoc.path.expandConfig(source, {
  relationshipFilter: "COMMINGLED_INTO>|TRANSFORMED_INTO>|PACKED_INTO>|SHIPPED_TO>",
  labelFilter: "+Lot|+Shipment|+Store",
  terminatorNodes: $cip_sanitized_boundaries,
  maxLevel: 8
}) YIELD path
RETURN path;`}
            </pre>
          </div>
        )}
      </div>

      {/* Main Graph Canvas & Tier Headers */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-4 bg-slate-900/90 border-b border-slate-800 text-xs font-semibold text-slate-400 py-2.5 px-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>TIER 1: GROWERS / PRODUCERS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>TIER 2: PROCESSOR & CIP SANITATION</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span>TIER 3: PALLETS & DCS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>TIER 4: RETAIL STORE DELIVERY</span>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-slate-900/40 px-4 py-2 border-b border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-500/20 border border-amber-400"></span>
              <span className="text-amber-300 font-medium">Suspect Root Cause</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-red-500/20 border border-red-500"></span>
              <span className="text-red-300 font-medium">Recalled Blast Radius</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-cyan-500/20 border border-cyan-400"></span>
              <span className="text-cyan-300 font-medium">CIP Sanitation Barrier</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-400"></span>
              <span className="text-emerald-300 font-medium">Safe Post-CIP / Preserved</span>
            </div>
          </div>
          <div className="text-slate-500 italic">
            Click any node to inspect KDEs or click any edge to view transaction
          </div>
        </div>

        {/* SVG Network Graph */}
        <div className="w-full overflow-x-auto p-4 flex justify-center">
          <svg
            viewBox="0 0 1280 870"
            className="w-full max-w-[1280px] h-auto select-none min-w-[900px]"
          >
            <defs>
              <marker
                id="arrow-recalled"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
              </marker>
              <marker
                id="arrow-safe"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
              </marker>
              <marker
                id="arrow-neutral"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
              </marker>
              <marker
                id="arrow-cip"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
              </marker>
            </defs>

            {/* Vertical Guides */}
            <line x1="320" y1="20" x2="320" y2="850" stroke="#1e293b" strokeDasharray="4 4" />
            <line x1="640" y1="20" x2="640" y2="850" stroke="#1e293b" strokeDasharray="4 4" />
            <line x1="960" y1="20" x2="960" y2="850" stroke="#1e293b" strokeDasharray="4 4" />

            {/* Edges */}
            {edges.map((edge) => {
              const src = nodePositions[edge.source];
              const tgt = nodePositions[edge.target];
              if (!src || !tgt) return null;

              const srcX = src.x + 105;
              const srcY = src.y + 26;
              const tgtX = tgt.x;
              const tgtY = tgt.y + 26;

              const isContaminated = edge.activeContaminationPath && recallResult.recalledNodes.includes(edge.target);
              const isCIPEdge = edge.source === 'CIP-EVT-NODE' || edge.target === 'CIP-EVT-NODE';

              const dx = tgtX - srcX;
              const c1X = srcX + dx * 0.45;
              const c1Y = srcY;
              const c2X = srcX + dx * 0.55;
              const c2Y = tgtY;

              const pathD = `M ${srcX} ${srcY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${tgtX} ${tgtY}`;

              let strokeColor = '#475569';
              let markerEnd = 'url(#arrow-neutral)';
              let strokeWidth = 1.8;
              let strokeDash = undefined;

              if (recallMode === 'surgical') {
                if (isContaminated && currentCteStage >= 4) {
                  strokeColor = '#ef4444';
                  markerEnd = 'url(#arrow-recalled)';
                  strokeWidth = 2.5;
                } else if (isCIPEdge && currentCteStage >= 5) {
                  strokeColor = '#06b6d4';
                  markerEnd = 'url(#arrow-cip)';
                  strokeWidth = 2.0;
                  strokeDash = '4 4';
                } else if (currentCteStage >= 5) {
                  strokeColor = '#10b981';
                  markerEnd = 'url(#arrow-safe)';
                  strokeWidth = 2.0;
                }
              } else {
                strokeColor = '#ef4444';
                markerEnd = 'url(#arrow-recalled)';
                strokeWidth = 2.5;
              }

              return (
                <g 
                  key={edge.id} 
                  className="transition-all duration-300"
                  onClick={() => setSelectedEdge(edge)}
                >
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                    markerEnd={markerEnd}
                    className="hover:stroke-cyan-300 cursor-pointer"
                  />
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const color = getNodeColor(node);
              const isSelected = selectedNode?.id === node.id;
              const isRoot = node.id === recallResult.suspectLotId;
              const isCip = node.id === 'CIP-EVT-NODE';

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  {(isRoot || isCip || (node.status === 'recalled' && recallMode === 'surgical' && currentCteStage >= 4)) && (
                    <rect
                      x="-3"
                      y="-3"
                      width="216"
                      height="58"
                      rx="11"
                      className={`fill-none stroke-current opacity-70 animate-pulse ${
                        isRoot ? 'stroke-amber-400' : isCip ? 'stroke-cyan-400' : 'stroke-red-500'
                      }`}
                      strokeWidth="2"
                    />
                  )}

                  <rect
                    x="0"
                    y="0"
                    width="210"
                    height="52"
                    rx="8"
                    className={`transition-all duration-200 ${color.bg} ${
                      isSelected ? 'stroke-white stroke-[2.5px]' : 'stroke-[1.5px]'
                    }`}
                  />

                  <rect
                    x="8"
                    y="7"
                    width="62"
                    height="14"
                    rx="4"
                    className={
                      isRoot
                        ? 'fill-amber-500/30'
                        : isCip
                        ? 'fill-cyan-500/30'
                        : node.status === 'recalled' && currentCteStage >= 4
                        ? 'fill-red-500/30'
                        : 'fill-emerald-500/20'
                    }
                  />
                  <text
                    x="12"
                    y="17"
                    className="text-[9px] font-bold uppercase tracking-wider fill-slate-300"
                  >
                    {isRoot ? 'ROOT CAUSE' : isCip ? 'CIP FLUSH' : node.tier}
                  </text>

                  <text
                    x="8"
                    y="32"
                    className="text-[12px] font-bold fill-white tracking-tight"
                  >
                    {node.id}
                  </text>

                  <text
                    x="8"
                    y="45"
                    className="text-[10px] fill-slate-400"
                  >
                    {node.commodity.length > 24 ? node.commodity.slice(0, 22) + '...' : node.commodity}
                    {node.quantity > 0 ? ` • ${node.quantity.toLocaleString()} ${node.unitOfMeasure}` : ''}
                  </text>

                  <circle
                    cx="195"
                    cy="26"
                    r="6"
                    className={
                      isRoot
                        ? 'fill-amber-400'
                        : isCip
                        ? 'fill-cyan-400'
                        : node.status === 'recalled' && currentCteStage >= 4
                        ? 'fill-red-500'
                        : 'fill-emerald-400'
                    }
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Edge Transaction Pop-Up */}
      {selectedEdge && (
        <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex items-start justify-between text-xs text-slate-200">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
              <span>Selected Supply Chain Transaction Edge ({selectedEdge.id})</span>
            </div>
            <div className="flex items-center gap-2 text-white font-mono">
              <span className="font-bold text-amber-300">{selectedEdge.source}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-bold text-cyan-300">{selectedEdge.target}</span>
            </div>
            <p className="text-slate-400 text-[11px] mt-1">{selectedEdge.notes}</p>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              Timestamp: {selectedEdge.timestamp} • Relationship: {selectedEdge.type}
            </div>
          </div>
          <button
            onClick={() => setSelectedEdge(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Custom Outbreak Injection Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-purple-400" />
                <span>Custom Outbreak Injector Bench</span>
              </h3>
              <button onClick={() => setShowCustomModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Select Suspect Origin Lot:</label>
                <select
                  value={customLotInput}
                  onChange={(e) => setCustomLotInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                >
                  {nodes.filter(n => n.tier === 'grower').map(n => (
                    <option key={n.id} value={n.id}>{n.id} - {n.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Pathogen / Hazard Type:</label>
                <select
                  value={customPathogen}
                  onChange={(e) => setCustomPathogen(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="Listeria monocytogenes">Listeria monocytogenes (Zero-Tolerance)</option>
                  <option value="Salmonella enterica">Salmonella enterica (Serovar Poona / Typhimurium)</option>
                  <option value="Escherichia coli O157:H7">Escherichia coli O157:H7 (STEC Shiga Toxin)</option>
                  <option value="Cyclospora cayetanensis">Cyclospora cayetanensis (Parasitic)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <span className="text-slate-400 font-semibold block">Line 1 CIP Barrier Parameters:</span>
                <div className="flex justify-between">
                  <span>ATP Swab: <span className="text-emerald-400 font-mono">{customAtp} RLU</span></span>
                  <span>PAA Titration: <span className="text-cyan-400 font-mono">{customPpm} PPM</span></span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomOutbreak}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-950"
              >
                Simulate Custom Outbreak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
