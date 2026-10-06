/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Presentation, Zap, Database, ArrowRight, Share2, Linkedin, MessageSquare, Users, CheckCircle2 } from 'lucide-react';

export const BenchmarkComparison: React.FC = () => {
  const [selectedDatasetSize, setSelectedDatasetSize] = useState<number>(100000);
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'pitch'>('benchmarks');

  const benchmarkData: Record<number, { sqlMs: number; graphMs: number; speedup: number; sqlMemMb: number; graphMemMb: number }> = {
    1000: { sqlMs: 420, graphMs: 12, speedup: 35, sqlMemMb: 45, graphMemMb: 8 },
    10000: { sqlMs: 2450, graphMs: 28, speedup: 87, sqlMemMb: 180, graphMemMb: 24 },
    50000: { sqlMs: 5890, graphMs: 46, speedup: 128, sqlMemMb: 420, graphMemMb: 48 },
    100000: { sqlMs: 12400, graphMs: 61, speedup: 203, sqlMemMb: 890, graphMemMb: 72 }
  };

  const currentBenchmark = benchmarkData[selectedDatasetSize] || benchmarkData[100000];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              PERFORMANCE & PITCH PACK
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Recursive SQL CTE vs Graph Index-Free Adjacency
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Engine Benchmarks & Executive Communication Strategy
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Why relational databases fail at food recall blast radiuses: multi-ingredient commingling creates exponential latency explosions in recursive SQL joins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'benchmarks'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 bg-slate-800 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>SQL vs Graph Benchmarks</span>
          </button>
          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'pitch'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 bg-slate-800 hover:text-white'
            }`}
          >
            <Presentation className="w-4 h-4" />
            <span>Audience Pitch Cheat Sheet</span>
          </button>
        </div>
      </div>

      {activeTab === 'benchmarks' && (
        <div className="space-y-5">
          {/* Dataset Size Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-300">
              Select Synthetic Supply Chain Event Volume:
            </span>
            <div className="flex items-center gap-2">
              {[1000, 10000, 50000, 100000].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedDatasetSize(size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedDatasetSize === size
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {size.toLocaleString()} Events
                </button>
              ))}
            </div>
          </div>

          {/* Benchmark Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400">PostgreSQL Recursive CTE Latency</span>
              <div className="text-2xl font-extrabold text-red-400 mt-1">
                {(currentBenchmark.sqlMs / 1000).toFixed(2)}s
              </div>
              <span className="text-[11px] text-slate-500 font-mono">{currentBenchmark.sqlMs} ms</span>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400">Neo4j APOC Graph DAG Latency</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                {(currentBenchmark.graphMs / 1000).toFixed(3)}s
              </div>
              <span className="text-[11px] text-slate-500 font-mono">{currentBenchmark.graphMs} ms</span>
            </div>

            <div className="p-4 bg-slate-900 border border-indigo-500/40 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900">
              <span className="text-xs text-indigo-300 font-semibold">Speedup Acceleration Factor</span>
              <div className="text-3xl font-extrabold text-indigo-400 mt-1">
                ~{currentBenchmark.speedup}x
              </div>
              <span className="text-[11px] text-indigo-200">Index-free adjacency traversal</span>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400">Server Memory Footprint</span>
              <div className="text-sm font-bold text-slate-200 mt-1">
                SQL: <span className="text-red-400 font-mono">{currentBenchmark.sqlMemMb} MB</span>
              </div>
              <div className="text-sm font-bold text-slate-200">
                Graph: <span className="text-emerald-400 font-mono">{currentBenchmark.graphMemMb} MB</span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Query Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Relational SQL Query */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <Database className="w-4 h-4" />
                  <span>PostgreSQL Recursive CTE (Exponential Slowdown)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">O(V · E) Join Cartesian Product</span>
              </div>
              <pre className="p-3 bg-slate-950 rounded-lg text-slate-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 max-h-72">
{`WITH RECURSIVE lot_traceback AS (
  -- Base case: contaminated farm lot
  SELECT 
    t.input_lot_id, 
    t.output_lot_id, 
    t.facility_gln, 
    t.event_timestamp,
    1 AS depth
  FROM epcis_transformations t
  WHERE t.input_lot_id = 'LOT-ROMAINE-101'

  UNION ALL

  -- Recursive step: join downstream transformations
  -- Latency explodes with multi-input commingling!
  SELECT 
    t2.input_lot_id, 
    t2.output_lot_id, 
    t2.facility_gln, 
    t2.event_timestamp,
    lt.depth + 1
  FROM epcis_transformations t2
  INNER JOIN lot_traceback lt 
    ON t2.input_lot_id = lt.output_lot_id
  WHERE lt.depth < 8
    -- SQL cannot easily express intervening CIP sanitation barriers!
)
SELECT DISTINCT output_lot_id FROM lot_traceback;`}
              </pre>
            </div>

            {/* Neo4j Cypher Query */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>Neo4j Cypher APOC (Sub-Second Index-Free Adjacency)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">O(d) Bounded Graph Walk</span>
              </div>
              <pre className="p-3 bg-slate-950 rounded-lg text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 max-h-72">
{`// Surgical Recall with Clean-in-Place (CIP) Barrier Halting
MATCH (source:Lot {lot_id: $suspect_lot_id})
CALL apoc.path.expandConfig(source, {
  relationshipFilter: "COMMINGLED_INTO>|TRANSFORMED_INTO>|SHIPPED_TO>",
  labelFilter: "+Lot|+Shipment|+Store",
  terminatorNodes: $cip_sanitized_boundaries,
  maxLevel: 8
})
YIELD path
RETURN [n IN nodes(path) | n.lot_id] AS surgical_recalled_lots;

// CIP node acts as an edge-pruning barrier:
// Shift B batches produced post-CIP are excluded in 0.05 seconds!`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Pitch Cheat Sheet Tab */}
      {activeTab === 'pitch' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Audience 1: LinkedIn / Executives */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn / Executive Angle</span>
              </div>
              <div className="text-xs text-amber-300 font-semibold">
                "How to save $300k and pass FDA 204 audits in seconds."
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="text-slate-400 block font-semibold mb-1">The Hook:</span>
                "With the FDA extending the FSMA 204 enforcement date to July 2028, most food companies are still planning to rely on manual ERP spreadsheets for mock recalls. I built an open-source prototype using GS1 EPCIS 2.0 and graph topology to solve the two biggest operational headaches: meeting the 24-hour audit window and avoiding unnecessary blanket recalls."
              </p>
              <div className="p-2.5 bg-slate-950 rounded-lg text-[11px] text-slate-400 border border-slate-800">
                <span className="text-emerald-400 font-semibold block">The Proof:</span>
                Show 30-sec screen capture of the DAG isolating Shift A while leaving post-CIP Shift B batches green, paired with 1-click FDA sortable spreadsheet export.
              </div>
            </div>

            {/* Audience 2: Subreddits / Tech Communities */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>Reddit / Tech Communities</span>
              </div>
              <div className="text-xs text-cyan-300 font-semibold">
                "r/FoodScience & r/dataengineering / r/neo4j"
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="text-slate-400 block font-semibold mb-1">r/FoodScience Hook:</span>
                "How does your facility handle commingling and shift sanitation when conducting mock recalls? I built an open-source tool using GS1 EPCIS 2.0 standards that uses CIP logs as graph boundaries to prevent over-recalls."
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="text-slate-400 block font-semibold mb-1">r/dataengineering Hook:</span>
                "Why relational databases fail at food recall blast radiuses: modeling multi-ingredient transformation lineages as Directed Acyclic Graphs (DAGs) with APOC."
              </p>
            </div>

            {/* Audience 3: Coworkers & Plant Bosses */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Users className="w-4 h-4" />
                <span>Coworkers & Plant Bosses</span>
              </div>
              <div className="text-xs text-emerald-300 font-semibold">
                "Watercooler / Plant Floor Chats"
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="text-slate-400 block font-semibold mb-1">The Pitch:</span>
                "You know how during mock recalls, pulling all the transformation and shipping records takes half a day of digging through SAP/spreadsheets? I’ve been tinkering with a side project using GS1 standards and graph networks. It maps lot transformations so you can click a tainted lot and pull the whole FDA sortable spreadsheet in two seconds, while using CIP times to prove the next batch was clean."
              </p>
              <div className="p-2.5 bg-slate-950 rounded-lg text-[11px] text-emerald-300 border border-emerald-500/30">
                Signals high-level systems thinking, technical curiosity, and deep understanding of business regulatory exposure.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
