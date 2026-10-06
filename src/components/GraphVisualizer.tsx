/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { TraceNode, TraceEdge, RecallAnalysisResult, CIPEvent } from '../types/traceability';
import { 
  AlertTriangle, ShieldCheck, CheckCircle2, Search, Sliders, RefreshCw, 
  ArrowRight, Info, Eye, Layers, Sparkles, X, ChevronRight, Lock, Check
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
  setCipEnforced
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTierFilter, setActiveTierFilter] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showCypherSnippet, setShowCypherSnippet] = useState(false);

  // Layout node positions organized into 4 logical tiers:
  // Tier 1: Growers (x: 100)
  // Tier 2: Processor & Sanitation (x: 440)
  // Tier 3: Distribution & Pallets (x: 780)
  // Tier 4: Retail Stores (x: 1120)
  const nodePositions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {
      // Tier 1: Growers
      'LOT-ROMAINE-101': { x: 90, y: 100 },
      'LOT-ROMAINE-102': { x: 90, y: 240 },
      'LOT-SPINACH-201': { x: 90, y: 380 },
      'LOT-ROMAINE-103': { x: 90, y: 550 },

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

  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch = node.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            node.commodity.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = activeTierFilter === 'all' || node.tier === activeTierFilter;
      return matchesSearch && matchesTier;
    });
  }, [nodes, searchQuery, activeTierFilter]);

  // Determine status color scheme
  const getNodeColor = (node: TraceNode) => {
    if (node.id === recallResult.suspectLotId) {
      return {
        bg: 'fill-amber-500/20 stroke-amber-400',
        text: 'text-amber-300',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
        glow: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]'
      };
    }
    if (node.id === 'CIP-EVT-NODE') {
      return {
        bg: 'fill-cyan-500/20 stroke-cyan-400',
        text: 'text-cyan-300',
        badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
        glow: 'drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]'
      };
    }
    if (node.status === 'recalled') {
      return {
        bg: 'fill-red-500/20 stroke-red-500',
        text: 'text-red-300',
        badge: 'bg-red-500/20 text-red-300 border-red-500/50',
        glow: 'drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]'
      };
    }
    if (node.status === 'safe_post_cip') {
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

  return (
    <div className="space-y-4">
      {/* Visualizer Control Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Recall Mode Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg">
              <button
                onClick={() => {
                  setRecallMode('surgical');
                  onRunRecall(recallResult.suspectLotId, 'surgical', cipEnforced);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  recallMode === 'surgical'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Precision Surgical Recall (CIP-Bounded)</span>
              </button>
              <button
                onClick={() => {
                  setRecallMode('blanket');
                  onRunRecall(recallResult.suspectLotId, 'blanket', false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  recallMode === 'blanket'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-red-300" />
                <span>Legacy Blanket Recall (Unbounded)</span>
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
                <span className="text-slate-200 font-medium">Clean-in-Place (CIP) Barrier Active</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  12:00:00 UTC (8 RLU)
                </span>
              </label>
            )}
          </div>

          {/* Quick Actions & Cypher Query Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCypherSnippet(!showCypherSnippet)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showCypherSnippet ? 'Hide Cypher APOC' : 'View Neo4j Cypher'}</span>
            </button>
            <button
              onClick={() => onRunRecall('LOT-ROMAINE-101', recallMode, cipEnforced)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-medium flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Scenario</span>
            </button>
          </div>
        </div>

        {/* Expandable Cypher APOC Logic Box */}
        {showCypherSnippet && (
          <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-2">
              <span className="text-cyan-400 font-semibold">// Neo4j APOC Surgical Recall Query with CIP Barrier Pruning</span>
              <span className="text-slate-500 text-[10px]">Index-Free Adjacency • Latency: {recallResult.traversalTimeMs}ms</span>
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
        {/* Tier Columns Header Legend */}
        <div className="grid grid-cols-4 bg-slate-900/90 border-b border-slate-800 text-xs font-semibold text-slate-400 py-2.5 px-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>TIER 1: GROWERS / FARMS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>TIER 2: PROCESSOR & CIP LINE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span>TIER 3: LOGISTICS & DCS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>TIER 4: RETAIL GROCERY STORES</span>
          </div>
        </div>

        {/* Legend & Status Guide */}
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
            Click any node to inspect KDEs or trigger new recall/backtrace
          </div>
        </div>

        {/* SVG Network Graph */}
        <div className="w-full overflow-x-auto p-4 flex justify-center">
          <svg
            viewBox="0 0 1280 870"
            className="w-full max-w-[1280px] h-auto select-none min-w-[900px]"
          >
            <defs>
              {/* Arrow markers */}
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

            {/* Vertical Tier Guides */}
            <line x1="320" y1="20" x2="320" y2="850" stroke="#1e293b" strokeDasharray="4 4" />
            <line x1="640" y1="20" x2="640" y2="850" stroke="#1e293b" strokeDasharray="4 4" />
            <line x1="960" y1="20" x2="960" y2="850" stroke="#1e293b" strokeDasharray="4 4" />

            {/* Edges */}
            {edges.map((edge) => {
              const src = nodePositions[edge.source];
              const tgt = nodePositions[edge.target];
              if (!src || !tgt) return null;

              // Node dimensions for connection anchor
              const srcX = src.x + 105;
              const srcY = src.y + 26;
              const tgtX = tgt.x;
              const tgtY = tgt.y + 26;

              const isContaminated = edge.activeContaminationPath && recallResult.recalledNodes.includes(edge.target);
              const isCIPEdge = edge.source === 'CIP-EVT-NODE' || edge.target === 'CIP-EVT-NODE';
              const isSafeEdge = !isContaminated && !isCIPEdge;

              // Bezier control points
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
                if (isContaminated) {
                  strokeColor = '#ef4444';
                  markerEnd = 'url(#arrow-recalled)';
                  strokeWidth = 2.5;
                } else if (isCIPEdge) {
                  strokeColor = '#06b6d4';
                  markerEnd = 'url(#arrow-cip)';
                  strokeWidth = 2.0;
                  strokeDash = '4 4';
                } else {
                  strokeColor = '#10b981';
                  markerEnd = 'url(#arrow-safe)';
                  strokeWidth = 2.0;
                }
              } else {
                // Blanket Mode
                strokeColor = '#ef4444';
                markerEnd = 'url(#arrow-recalled)';
                strokeWidth = 2.5;
              }

              return (
                <g key={edge.id} className="transition-all duration-300">
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
                  {/* Glowing Halos for Root Cause and Active Alerts */}
                  {(isRoot || isCip || (node.status === 'recalled' && recallMode === 'surgical')) && (
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

                  {/* Node Rectangle Card */}
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

                  {/* Header / Type Pill */}
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
                        : node.status === 'recalled'
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

                  {/* Node Title / Lot Number */}
                  <text
                    x="8"
                    y="32"
                    className="text-[12px] font-bold fill-white tracking-tight"
                  >
                    {node.id}
                  </text>

                  {/* Commodity & Quantity subtitle */}
                  <text
                    x="8"
                    y="45"
                    className="text-[10px] fill-slate-400"
                  >
                    {node.commodity.length > 24 ? node.commodity.slice(0, 22) + '...' : node.commodity}
                    {node.quantity > 0 ? ` • ${node.quantity.toLocaleString()} ${node.unitOfMeasure}` : ''}
                  </text>

                  {/* Status Indicator Icon */}
                  <circle
                    cx="195"
                    cy="26"
                    r="6"
                    className={
                      isRoot
                        ? 'fill-amber-400'
                        : isCip
                        ? 'fill-cyan-400'
                        : node.status === 'recalled'
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

      {/* Quick Action Trigger Panel for FSQA Simulation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Test Scenario 1: Farm 1 Contamination */}
        <div
          onClick={() => {
            onRunRecall('LOT-ROMAINE-101', 'surgical', true);
            setRecallMode('surgical');
          }}
          className="p-3 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl cursor-pointer transition-all hover:bg-slate-850 shadow-md group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Simulate Farm 1 Outbreak
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
              Salinas R-101
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Triggers Listeria alert on Romaine Lot R-101. Proves CIP stops contamination at Shift A and spares Shift B.
          </p>
        </div>

        {/* Test Scenario 2: Blanket Recall Comparison */}
        <div
          onClick={() => {
            setRecallMode('blanket');
            onRunRecall('LOT-ROMAINE-101', 'blanket', false);
          }}
          className="p-3 bg-slate-900 border border-slate-800 hover:border-red-500/50 rounded-xl cursor-pointer transition-all hover:bg-slate-850 shadow-md group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Simulate Legacy Blanket Recall
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-mono">
              44,500 units lost
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Shows conventional relational database query over-recalling safe Shift B batches across all 6 regional stores.
          </p>
        </div>

        {/* Test Scenario 3: Reverse Back-Trace from Retail */}
        <div
          onClick={() => onRunBackTrace('STORE-101-SEATTLE')}
          className="p-3 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl cursor-pointer transition-all hover:bg-slate-850 shadow-md group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              Reverse Back-Trace from Retail
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
              Store #101 Seattle
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Consumer illness reported in Seattle. Walks back 4 tiers through DC and Line 1 directly to Field 4A in &lt; 2ms.
          </p>
        </div>
      </div>
    </div>
  );
};
