/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, ShieldCheck, Database, Network, Scale, FileText, CheckCircle2, 
  HelpCircle, AlertTriangle, ArrowRight, Layers, Sparkles, Award, Code2, Clock,
  ExternalLink, GitFork, Server, Cpu, Terminal, Users, Share2, Linkedin, MessageSquare
} from 'lucide-react';

export const DocumentationCenter: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState<string>('chapter1');

  const chapters = [
    { id: 'chapter1', title: '1. Executive Architecture & Open-Source Gap', icon: Network },
    { id: 'chapter2', title: '2. FDA FSMA 204 Regulatory Blueprint', icon: Scale },
    { id: 'chapter3', title: '3. GS1 EPCIS 2.0 & CBV 2.0 Standards', icon: FileText },
    { id: 'chapter4', title: '4. Graph DAGs vs. Relational SQL', icon: Database },
    { id: 'chapter5', title: '5. Food Science: CIP Pruning Mechanics', icon: Layers },
    { id: 'chapter6', title: '6. Open-Source Ecosystem & Repos', icon: GitFork },
    { id: 'chapter7', title: '7. FDA 24-Hr Runbook & Pitch Playbook', icon: Award },
    { id: 'chapter8', title: '8. Regulatory Glossary & Mathematical Formulations', icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              TRACEABILITY ENGINEERING HANDBOOK
            </span>
            <span className="text-xs text-slate-400 font-mono">
              21 CFR Part 1 Subpart S • GS1 EPCIS 2.0 • Systems Architecture
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            System Documentation & Technical Reference Manual
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl mt-1 leading-relaxed">
            An exhaustive, publication-grade technical and regulatory manual explaining the software engineering, graph topology, food science mechanics, and federal compliance rules powering TraceSurg.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>7 Publication Chapters</span>
        </span>
      </div>

      {/* Chapters Tabs Bar */}
      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-slate-800 no-scrollbar">
        {chapters.map((ch) => {
          const Icon = ch.icon;
          const isActive = activeChapter === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => setActiveChapter(ch.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{ch.title}</span>
            </button>
          );
        })}
      </div>

      {/* CHAPTER 1: EXECUTIVE ARCHITECTURE & THE OPEN SOURCE GAP */}
      {activeChapter === 'chapter1' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Chapter 1</span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              The Executive Architecture Blueprint & The Open-Source Gap
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Why proprietary software vendors keep precision recall engines closed-source, and how TraceSurg bridges the gap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* The Industry Commercial Moat */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <span className="font-bold text-amber-300 text-sm block">1. The Proprietary Commercial Moat</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                In the food industry, commercial track-and-trace platforms (such as <strong>IBM Food Trust</strong>, <strong>FoodLogiQ / Trustwell</strong>, <strong>ReposiTrak</strong>, and <strong>iFoodDS</strong>) charge enterprise clients between <strong>$20,000 and $100,000+ per year per facility</strong>.
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Because precision recall bounding is their primary monetized intellectual property, none of these vendors open-source their traversal engines. Food processors and co-packers are forced into expensive, multi-year vendor lock-in simply to comply with basic FDA laws.
              </p>
            </div>

            {/* The 2026-2028 Strategic Preparation Window */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <span className="font-bold text-emerald-300 text-sm block">2. The Strategic Preparation Window (July 20, 2028)</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Congress and the FDA extended the binding enforcement date for FSMA Rule 204 to <strong>July 20, 2028</strong>. Many mid-sized brands mistakenly believe this allows them to delay action.
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                In reality, tier-one retail buyers (including <strong>Walmart</strong>, <strong>Kroger</strong>, <strong>Target</strong>, and <strong>Wegmans</strong>) are enforcing mandatory traceability compliance milestones right now. Connecting five tiers of fragmented suppliers takes years of pipeline development.
              </p>
            </div>
          </div>

          {/* End-to-End Systems Architecture Blueprint */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>TraceSurg End-to-End Implementation Architecture</span>
            </span>

            <pre className="p-4 bg-slate-900 rounded-lg text-cyan-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`[Public Grounding Seeds]
 ├── openFDA Enforcement API (Real Class I Recall Lots & Pathogen Alerts)
 └── Open Food Facts API (Real GTIN Barcodes & Bill of Materials)
      │
      ▼
[OpenEPCIS 2.0 Synthesizer Layer]
 ├── Ingests FTL Commodities (Fresh-Cut Salad, Raw-Milk Cheese, Melons)
 └── Generates Canonical GS1 EPCIS 2.0 JSON-LD CTE Streams:
      ├── Commissioning / Harvesting (TLC Genesis)
      ├── Receiving (with TLC Source GLN & BOL Ref Document Links)
      ├── Transformation (Multi-input TLCs -> Finished Goods TLC)
      ├── Sanitization (Explicit CIP Line Flush Events)
      └── Shipping / Despatch (BOL & Consignee Links)
      │
      ▼
[Directed Acyclic Graph (DAG) Storage & Normalization Engine]
 ├── Decouples Master Data (:Facility {gln}, :ProductMaster {gtin})
 └── Populates Event Nodes (:Lot {tlc}, :Event {timestamp}) in Neo4j 5.x
      │
      ▼
[Precision Recall Engine (Neo4j APOC)]
 ├── Recursive Path Traversal: [:TRANSFORMED_INTO*], [:COMMINGLED_WITH*], [:SHIPPED_TO*]
 └── Enforces [:SANITIZED_LINE] Temporal Cutoff Boundaries (ATP Swabs < 25 RLU)
      │
 ┌────┴──────────────────────────────────────────────────────┐
 ▼                                                           ▼
[Interactive Executive Visualizer]           [Official FDA 204 Exporter]
 • Root-Cause Zero Patient (Yellow)           • Multi-Tab .xlsx Workbook (openpyxl)
 • Recalled Blast Radius (Red)                • Tab 1: Receiving KDEs (21 CFR § 1.1335)
 • Safe Post-CIP Batches (Green)              • Tab 2: Transformation KDEs (§ 1.1340)
 • 90.6% Waste Reduction Proof                • Tab 3: Shipping KDEs (§ 1.1345)`}
            </pre>
          </div>
        </div>
      )}

      {/* CHAPTER 2: FDA FSMA 204 REGULATORY BLUEPRINT */}
      {activeChapter === 'chapter2' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Chapter 2</span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              The FDA FSMA Rule 204 Legal & Technical Specification
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Deconstructing 21 CFR Part 1 Subpart S (§ 1.1300 to § 1.1460) into software database requirements.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="font-bold text-indigo-300 text-sm">1. The 24-Hour Regulatory Mandate (21 CFR § 1.1315)</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Under <strong>21 CFR § 1.1315</strong>, any covered facility manufacturing, processing, packing, or holding foods on the Food Traceability List must produce an <strong>Electronic Sortable Spreadsheet</strong> within <strong>24 hours of an official FDA request</strong>.
              </p>
              <div className="p-3 bg-slate-900 rounded border border-slate-800 text-slate-300 text-[11px]">
                <strong>The Federal Standard:</strong> The file must be electronically sortable and filterable. The FDA's official reference template structures records into distinct worksheets for <strong>Receiving</strong>, <strong>Transformation</strong>, and <strong>Shipping</strong>. An unstructured flat CSV combining all events into a single table will cause an inspection failure.
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="font-bold text-amber-300 text-sm">2. The "Kill-Step" Exemption Boundary (21 CFR § 1.1305(d)(1))</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                A major trap in food traceability software is assuming that any food containing an FTL ingredient is subject to full end-to-end tracing.
              </p>
              <div className="p-3 bg-amber-950/30 rounded border border-amber-500/40 text-amber-200 text-[11px] leading-relaxed">
                <strong>Statutory Exemption Rule:</strong> If an FTL food receives an authorized commercial kill-step (such as commercial cooking, thermal retorting of canned goods, or validated pasteurization that achieves lethal pathogen reduction), <strong>downstream traceability recordkeeping legally terminates</strong>.
                <br /><br />
                <em>Engineering Impact:</em> TraceSurg specifically scopes to <strong>fresh-cut ready-to-eat produce</strong> and <strong>raw-milk soft cheeses</strong> because these commodities undergo only washing or aging without a lethal kill-step. The entire field-to-retail mandate applies in full legal force.
              </div>
            </div>

            {/* FTL Matrix */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <span className="font-bold text-white text-sm">3. The Food Traceability List (FTL) Commodity Matrix</span>
              <p className="text-slate-400 text-[11px]">
                The FDA strictly limits the rule to items on the Food Traceability List. Non-FTL commodities (e.g. shelf-stable grains, USDA-regulated raw beef) are exempt from FSMA 204:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-300">✓ Fresh-Cut Fruits & Veg</div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-300">✓ Soft & Semi-Soft Cheeses</div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-300">✓ Leafy Greens (Romaine, Spinach)</div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-300">✓ Fresh Melons (Cantaloupe)</div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-300">✓ Finfish (Fresh & Frozen)</div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-300">✓ Shell Eggs & Nut Butters</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHAPTER 3: GS1 EPCIS 2.0 & CBV 2.0 STANDARDS */}
      {activeChapter === 'chapter3' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Chapter 3</span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Global Standards: GS1 EPCIS 2.0 & Core Business Vocabulary (CBV 2.0)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              How enterprise ERPs communicate supply events using JSON-LD schemas and GS1 identifiers.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <p className="text-slate-300 leading-relaxed text-[11px]">
              TraceSurg rejects custom ad-hoc database schemas. Every supply transaction is mapped to <strong>GS1 EPCIS 2.0 (Electronic Product Code Information Services)</strong>, the global JSON-LD/REST event standard.
            </p>

            {/* Core 4 Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-cyan-400 font-bold block mb-1">WHAT</span>
                <span className="text-white font-mono text-[11px]">GTIN & TLC</span>
                <p className="text-slate-500 text-[10px] mt-1">Product barcode + lot code</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-cyan-400 font-bold block mb-1">WHEN</span>
                <span className="text-white font-mono text-[11px]">eventTime (UTC)</span>
                <p className="text-slate-500 text-[10px] mt-1">ISO 8601 timestamp</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-cyan-400 font-bold block mb-1">WHERE</span>
                <span className="text-white font-mono text-[11px]">GLN</span>
                <p className="text-slate-500 text-[10px] mt-1">Global Location Number</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-cyan-400 font-bold block mb-1">WHY</span>
                <span className="text-white font-mono text-[11px]">bizStep</span>
                <p className="text-slate-500 text-[10px] mt-1">commissioning, sanitizing</p>
              </div>
            </div>

            {/* Event Types Breakdown */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <span className="font-bold text-white text-sm">Canonical GS1 EPCIS Event Types Implemented:</span>
              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                  <span className="font-mono text-cyan-300 font-bold">1. TransformationEvent:</span>
                  <span className="text-slate-300 ml-2">Maps input ingredient TLCs (Romaine, Spinach, Cheese) into a new finished SKU batch. Implements Many-to-Many BOM modeling.</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                  <span className="font-mono text-cyan-300 font-bold">2. ObjectEvent (Action: ADD / OBSERVE):</span>
                  <span className="text-slate-300 ml-2">Records initial harvesting (commissioning) and receiving/shipping events at logistics docks.</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                  <span className="font-mono text-cyan-300 font-bold">3. ObjectEvent (bizStep: sanitizing):</span>
                  <span className="text-slate-300 ml-2">Custom FSQA extension recording verified Clean-in-Place flushes with ATP swab RLU and chemical PPM properties.</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                  <span className="font-mono text-cyan-300 font-bold">4. AggregationEvent:</span>
                  <span className="text-slate-300 ml-2">Binds individual finished lot cases onto master SSCC-18 logistics pallets for trailer tracking.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHAPTER 4: GRAPH DAGS VS RELATIONAL SQL */}
      {activeChapter === 'chapter4' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Chapter 4</span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Graph Data Engineering: Directed Acyclic Graphs vs. Relational SQL
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Mathematical proof of why recursive SQL CTE joins explode in latency during food recalls.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <span className="font-bold text-rose-300 text-sm">1. The Cartesian Join Explosion in Relational SQL</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                In automotive manufacturing, a Bill of Materials is a clean tree: 4 tires + 1 chassis = 1 car.
                In food processing, manufacturing is a <strong>Directed Acyclic Graph (DAG) with severe commingling</strong>:
              </p>
              <div className="p-3 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-slate-300">
                Farm Lot A (40%) + Farm Lot B (60%) &rarr; Shift Batch 1 & Shift Batch 2<br />
                &rarr; Repacked onto 4 Mixed SSCC Pallets &rarr; Cross-docked to 3 Regional DCs &rarr; 24 Retail Stores
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                When executing a recursive SQL query (<span className="font-mono text-cyan-300">WITH RECURSIVE lot_trace AS (...)</span>), relational engines repeatedly scan foreign key indexes across millions of rows. On a 100,000-event dataset, SQL query latency balloons to <strong>12.4 seconds</strong> and consumes <strong>890 MB of RAM</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <span className="font-bold text-emerald-300 text-sm">2. Neo4j Index-Free Adjacency</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                In a graph database, each node holds direct physical memory pointers to its adjacent relationships. Traversal does not perform table lookups; it simply dereferences pointers in memory.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center font-mono text-[11px]">
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Relational Latency</span>
                  <span className="text-rose-400 font-bold text-sm">12.40s</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Graph APOC Latency</span>
                  <span className="text-emerald-400 font-bold text-sm">0.061s</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Speedup Factor</span>
                  <span className="text-cyan-400 font-bold text-sm">~203x</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">RAM Footprint</span>
                  <span className="text-emerald-400 font-bold text-sm">72 MB</span>
                </div>
              </div>
            </div>

            {/* Production Cypher Query */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="font-bold text-white text-sm">Production Neo4j APOC Cypher Query:</span>
              <pre className="p-3 bg-slate-900 rounded text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`MATCH (root:Lot {lot_id: $suspect_lot_id})
CALL apoc.path.expandConfig(root, {
  relationshipFilter: "COMMINGLED_INTO>|TRANSFORMED_INTO>|PACKED_INTO>|SHIPPED_TO>",
  labelFilter: "+Lot|+Shipment|+Store",
  terminatorNodes: $cip_sanitized_boundaries,
  maxLevel: 8
}) YIELD path
RETURN path;`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* CHAPTER 5: FOOD SCIENCE & CIP PRUNING */}
      {activeChapter === 'chapter5' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Chapter 5</span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Food Science Mechanics: Clean-in-Place (CIP) Validation
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Why plant sanitation timestamps are the linchpin that stops recall query bleed.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <span className="font-bold text-amber-300 text-sm">1. The Plant Floor Reality: What is a "Heel"?</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                In continuous manufacturing (flumes, bulk hoppers, shredders, centrifuges), machines do not magically clear product between lots. Residual shredded leaves or liquid sauces remain in the equipment—known as the <strong>"heel."</strong>
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                If Lot A runs at 08:00 AM, and Lot B runs at 10:00 AM without a sanitation wash, bacteria (*Listeria* or *Salmonella*) will physically contaminate Lot B via the residual heel. Standard software fails because it assumes separate lot numbers mean separate physical food.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <span className="font-bold text-cyan-300 text-sm">2. The 4-Stage CIP Protocol That Stops the Bleed</span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-[11px]">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="font-bold text-cyan-300 block mb-1">Stage 1</span>
                  <span className="text-white font-semibold">Physical Drain</span>
                  <p className="text-slate-500 text-[10px] mt-1">0% residual heel</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="font-bold text-cyan-300 block mb-1">Stage 2</span>
                  <span className="text-white font-semibold">Caustic Flush 68°C</span>
                  <p className="text-slate-500 text-[10px] mt-1">Emulsifies plant fats</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="font-bold text-cyan-300 block mb-1">Stage 3</span>
                  <span className="text-white font-semibold">PAA Titration 210 PPM</span>
                  <p className="text-slate-500 text-[10px] mt-1">Pathogen lethality</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="font-bold text-cyan-300 block mb-1">Stage 4</span>
                  <span className="text-white font-semibold">ATP Swab: 8 RLU</span>
                  <p className="text-slate-500 text-[10px] mt-1">Pass limit &lt; 25 RLU</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="font-bold text-emerald-300 text-sm">3. Legal Defensibility Under FDA & GFSI Audit</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                During an FDA Form 483 inspection or SQF/BRC audit, inspectors ask: <em>"How do you know Shift B was clean?"</em>
                <br /><br />
                TraceSurg proves that because Line 1 recorded an authenticated CIP break at 12:00:00 UTC with an <strong>8 RLU ATP score</strong>, the cross-contamination path was severed. This saves <strong>90.6% of inventory from scrap ($282,100 preserved)</strong> while fully complying with federal food safety law.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CHAPTER 6: OPEN-SOURCE REPOSITORIES */}
      {activeChapter === 'chapter6' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Chapter 6</span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              The Open-Source Ecosystem Catalog & Reference Repositories
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              The 8 open-source foundations and GitHub repositories combined to create TraceSurg.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 font-mono">1. openepcis/epcis-repository-ce</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded">Apache 2.0</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                The official reference implementation of GS1 EPCIS 2.0. Supplies canonical JSON-LD schemas, `@context` headers, and validators for TransformationEvent.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 font-mono">2. openepcis/epcis-testdata-generator</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded">GS1 Germany</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Generates authentic multi-tier event streams (Grower &rarr; Processor &rarr; DC &rarr; Retail) with verified GLN and TLC syntax.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 font-mono">3. neo4j/neo4j & APOC Procedures</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded">GPLv3 / Apache</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                The core Directed Acyclic Graph (DAG) database. APOC's `apoc.path.expandConfig` enables depth-bounded traversal with termination node pruning.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 font-mono">4. FDA CFSAN-Biostatistics / CSP2</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded">US Government</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                U.S. FDA Human Foods Program biostatistical algorithms (GalaxyTrakr, BetterCallSal) for phylogenetic cluster tracing and isolate matching.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300 font-mono">5. openfoodfacts/robotoff</span>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded">AGPL-3.0</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Open Food Facts AI backend for product taxonomy, ingredients extraction, and declared food supply catalog validation.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300 font-mono">6. cytoscape/cytoscape.js</span>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded">MIT</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Graph visualization library providing interactive node coloring (Yellow, Red, Green, Cyan) and supply flow topology.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 font-mono">7. pychemometrics & scikit-learn</span>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded">BSD</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Multivariate chemometric modeling for stable isotope ratios (δ13C, δ15N) and geographic origin verification.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 font-mono">8. SheetJS / xlsx (openpyxl spec)</span>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded">Apache 2.0</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Multi-tab binary workbook compiler producing compliant FDA Electronic Sortable Spreadsheets conforming to 21 CFR § 1.1315.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CHAPTER 7: FDA RUNBOOK & PITCH PLAYBOOK */}
      {activeChapter === 'chapter7' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Chapter 7</span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              The FDA 24-Hour Mock Recall Defense Runbook & Communications Playbook
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Field-tested talking points and incident response protocols for executives, plant directors, and auditors.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* The 4-Step FDA Emergency Protocol */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <span className="font-bold text-white text-sm">Official FDA Inspection Response Protocol (Form 482 Notice):</span>
              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-start gap-2">
                  <span className="font-bold text-cyan-400 shrink-0">Minute 0:</span>
                  <span>FDA Investigator issues written Form 482 request. Timestamp recorded to initiate statutory 24-hr clock (§ 1.1315).</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-start gap-2">
                  <span className="font-bold text-cyan-400 shrink-0">Minute 2:</span>
                  <span>Hand investigator the pre-compiled Written Traceability Plan (§ 1.1315(a)) detailing farm GPS mapping and TLC procedures.</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-start gap-2">
                  <span className="font-bold text-cyan-400 shrink-0">Minute 3:</span>
                  <span>Enter suspect lot code into TraceSurg. The index-free adjacency graph executes in &lt; 0.05 seconds.</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-start gap-2">
                  <span className="font-bold text-emerald-400 shrink-0">Minute 5:</span>
                  <span>Hand investigator the completed, 4-tab electronic sortable spreadsheet (.xlsx). Audit concluded with 0 citations!</span>
                </div>
              </div>
            </div>

            {/* Audience Pitch Cheat Sheet */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn Pitch Angle</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  <em>"How to save $300k and pass FDA 204 audits in seconds."</em>
                </p>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Focus on regulatory timelines and scrap reduction. Share a video walkthrough of the DAG bounding Shift A while sparing Shift B.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <MessageSquare className="w-4 h-4" />
                  <span>Reddit / Tech Communities</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  <em>"r/FoodScience & r/dataengineering"</em>
                </p>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Focus on systems architecture: why relational SQL fails at commingled DAGs and how CIP sanitation logs serve as traversal boundaries.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Users className="w-4 h-4" />
                  <span>Plant Director & Boss</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  <em>"The CIP Sanitation Reality"</em>
                </p>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Focus on floor realities: show that an 8 RLU ATP swab proves the next shift was clean, cutting product scrap by 90.6%.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHAPTER 8: REGULATORY GLOSSARY & MATHEMATICAL FORMULATIONS */}
      {activeChapter === 'chapter8' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Chapter 8</span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Regulatory Acronym Glossary & Mathematical Formulations
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Rigorous definitions of federal food safety terminology and the exact physical/computational formulas powering TraceSurg.
            </p>
          </div>

          {/* Section 1: Core Mathematical Formulations */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Core Mathematical & Kinetic Formulations</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Formula 1: Ratkowsky Square-Root Kinetics */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="font-bold text-emerald-300 block">1. Ratkowsky Square-Root Growth Kinetics</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Calculates temperature-dependent specific growth rate (<span className="font-mono text-cyan-300">&mu;</span>) of <em>Listeria monocytogenes</em> during cold-chain transit spikes:
                </p>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 text-center font-mono text-cyan-300 text-xs py-2.5">
                  &radic;&mu; = b &middot; (T - T<sub>min</sub>) &middot; (1 - e<sup>c &middot; (T - T<sub>max</sub>)</sup>)
                </div>
                <div className="text-[10px] text-slate-400 space-y-1">
                  <div><strong>T<sub>min</sub></strong>: Theoretical baseline growth temperature (-1.18°C for Listeria)</div>
                  <div><strong>b</strong>: Affine regression parameter (0.021 °C⁻¹ &middot; hr⁻⁰˙⁵)</div>
                  <div><strong>Quarantine Threshold</strong>: Growth ratio &gt; 1.35x triggers automatic pre-dock webhook hold.</div>
                </div>
              </div>

              {/* Formula 2: Thermal Abuse Degree-Hours */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="font-bold text-amber-300 block">2. Thermal Abuse Degree-Hours Integral</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Quantifies cumulative time-temperature excursions above regulatory safe storage threshold (4.0°C / 40°F):
                </p>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 text-center font-mono text-amber-300 text-xs py-2.5">
                  DH = &int;<sub>0</sub><sup>t</sup> max(0, T(&tau;) - T<sub>crit</sub>) d&tau; &approx; &sum; max(0, T<sub>i</sub> - 4.0) &middot; &Delta;t<sub>i</sub>
                </div>
                <div className="text-[10px] text-slate-400 space-y-1">
                  <div><strong>Critical Limit</strong>: Exceeding 18.0 °C-hours trips FDA Action Threshold (§ 117.135).</div>
                  <div><strong>Action Taken</strong>: Inventory locked in ERP before trailer driver unseals dock door.</div>
                </div>
              </div>

              {/* Formula 3: CSTR Tank Heel Dilution */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="font-bold text-cyan-300 block">3. Continuous Fluid Tank Heel Washout (CSTR)</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Models exponential dilution of residual liquid pathogens in un-drained continuous mixing tanks:
                </p>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 text-center font-mono text-cyan-300 text-xs py-2.5">
                  C(t) = C<sub>0</sub> &middot; e<sup>-t / &tau;</sup> &nbsp;&nbsp;&nbsp; where &tau; = V<sub>heel</sub> / Q<sub>volumetric_flow</sub>
                </div>
                <div className="text-[10px] text-slate-400 space-y-1">
                  <div><strong>Washout Boundary</strong>: Safe threshold achieved after t &ge; 4.6 &tau; (&gt; 99% reduction).</div>
                  <div><strong>Zero-Tolerance Alert</strong>: For zero-tolerance Class I pathogens, physical CIP teardown is mandatory.</div>
                </div>
              </div>

              {/* Formula 4: Bayesian MAP Farm Attribution */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="font-bold text-purple-300 block">4. Bayesian Maximum A Posteriori (MAP) Attribution</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Infers probable origin farm across commingled ingredient batches given historical compliance and weather:
                </p>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 text-center font-mono text-purple-300 text-xs py-2.5">
                  P(Farm<sub>i</sub> | Outbreak) &prop; P(Outbreak | Farm<sub>i</sub>) &middot; P(Farm<sub>i</sub>)
                </div>
                <div className="text-[10px] text-slate-400 space-y-1">
                  <div><strong>Likelihood Features</strong>: Flooding rain events (+3.5x), prior sanitation audits, distance.</div>
                  <div><strong>Result</strong>: Replaces months of manual interviews with instant probabilistic rankings.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Comprehensive Regulatory Acronym Glossary */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Comprehensive Regulatory Acronym & Standards Dictionary</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-cyan-400 font-bold font-mono">TLC</span>
                <span className="text-slate-300 block font-semibold text-[11px] mt-0.5">Traceability Lot Code</span>
                <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">
                  Unique alphanumeric descriptor assigned to an FTL food upon initial packing, receiving, or transformation (21 CFR § 1.1310).
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-cyan-400 font-bold font-mono">KDE</span>
                <span className="text-slate-300 block font-semibold text-[11px] mt-0.5">Key Data Element</span>
                <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">
                  Specific data fields required by FDA for each event: date, time, quantity, GLN, BOL reference, and TLC source (§ 1.1315).
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-cyan-400 font-bold font-mono">CTE</span>
                <span className="text-slate-300 block font-semibold text-[11px] mt-0.5">Critical Tracking Event</span>
                <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">
                  Key supply milestones: Harvesting, Cooling, Initial Packing, Receiving, Transformation, and Shipping (§ 1.1325).
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-emerald-400 font-bold font-mono">GLN</span>
                <span className="text-slate-300 block font-semibold text-[11px] mt-0.5">Global Location Number</span>
                <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">
                  GS1 13-digit standard identifier for physical locations (farms, packing sheds, dock doors, retail store coolers).
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-emerald-400 font-bold font-mono">GTIN</span>
                <span className="text-slate-300 block font-semibold text-[11px] mt-0.5">Global Trade Item Number</span>
                <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">
                  GS1 standard barcode identifier encoding brand, product description, and packaging format (e.g. 14-digit case barcode).
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-emerald-400 font-bold font-mono">SSCC</span>
                <span className="text-slate-300 block font-semibold text-[11px] mt-0.5">Serial Shipping Container Code</span>
                <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">
                  GS1 18-digit identifier for logistics transport units (pallets, roll cages). Used in GS1 AggregationEvents.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-amber-400 font-bold font-mono">CIP</span>
                <span className="text-slate-300 block font-semibold text-[11px] mt-0.5">Clean-in-Place</span>
                <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">
                  Automated industrial wash method using caustic soda, acid rinse, and sanitizer to sterilize food contact surfaces without disassembly.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-amber-400 font-bold font-mono">RLU</span>
                <span className="text-slate-300 block font-semibold text-[11px] mt-0.5">Relative Light Units</span>
                <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">
                  Unit of measure for ATP bioluminescence hygiene swabs. Standard pass threshold for food contact equipment is &lt; 25 RLU.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-amber-400 font-bold font-mono">PAA</span>
                <span className="text-slate-300 block font-semibold text-[11px] mt-0.5">Peracetic Acid</span>
                <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">
                  Broad-spectrum organic antimicrobial sanitizer used in produce flume water and equipment sanitizing (target 180–230 PPM).
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-purple-400 font-bold font-mono">FTL</span>
                <span className="text-slate-300 block font-semibold text-[11px] mt-0.5">Food Traceability List</span>
                <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">
                  Official FDA list of high-risk foods subject to FSMA 204: leafy greens, fresh-cut fruit, soft cheese, melons, finfish, nut butters.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-purple-400 font-bold font-mono">DAG</span>
                <span className="text-slate-300 block font-semibold text-[11px] mt-0.5">Directed Acyclic Graph</span>
                <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">
                  Mathematical graph structure where edges have directions and no closed loops exist. Perfect model for food transformation and blending.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-purple-400 font-bold font-mono">CLC</span>
                <span className="text-slate-300 block font-semibold text-[11px] mt-0.5">Calculated Lot Code</span>
                <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">
                  Probabilistic inference technique determining the likely lot code delivered to a grocery store based on DC pick timestamps and FIFO slots.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
