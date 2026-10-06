/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight, RefreshCw } from 'lucide-react';

interface AuditQuestion {
  id: number;
  topic: string;
  question: string;
  inspector: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const MockInspection: React.FC = () => {
  const QUESTIONS: AuditQuestion[] = [
    {
      id: 1,
      topic: '21 CFR § 1.1315 (Turnaround SLA)',
      question: 'An FDA investigator presents a written request for records covering FTL fresh salads. What is your legal statutory deadline to produce the Electronic Sortable Spreadsheet?',
      inspector: 'Dr. Aris Thorne (FDA CFSAN Inspector)',
      options: [
        {
          text: 'Within 24 hours of the official request (or within a reasonable time agreed upon by the FDA).',
          isCorrect: true,
          explanation: 'CORRECT: 21 CFR § 1.1315 mandates that covered entities furnish the electronic sortable spreadsheet within 24 hours.'
        },
        {
          text: 'Within 7 business days following internal corporate legal review.',
          isCorrect: false,
          explanation: 'INCORRECT: Taking 7 days results in an immediate FDA Form 483 inspection observation for recordkeeping failure.'
        },
        {
          text: '30 days, matching the standard public FOIA response schedule.',
          isCorrect: false,
          explanation: 'INCORRECT: FSMA Rule 204 mandates high-speed emergency turnaround due to imminent consumer illness risk.'
        }
      ]
    },
    {
      id: 2,
      topic: '21 CFR § 1.1305(d)(1) (Kill-Step Exemption)',
      question: 'Why does TraceSurg deliberately model Fresh-Cut Romaine Salads rather than canned green beans or pasteurized cheese spread?',
      inspector: 'Dr. Aris Thorne (FDA CFSAN Inspector)',
      options: [
        {
          text: 'Because commercial cooking, thermal retorting, or pasteurization legally terminates downstream traceability obligations.',
          isCorrect: true,
          explanation: 'CORRECT: Under § 1.1305(d)(1), applying an authorized kill-step exempts downstream nodes from recordkeeping. Fresh-cut RTE produce has no kill-step, forcing full field-to-retail compliance.'
        },
        {
          text: 'Because canned foods do not have batch barcodes.',
          isCorrect: false,
          explanation: 'INCORRECT: Canned foods have standard GTINs and lots, but are legally exempt after retorting.'
        },
        {
          text: 'Because fresh greens cost more than canned products.',
          isCorrect: false,
          explanation: 'INCORRECT: Regulatory scope is governed by biological hazard risk, not retail pricing.'
        }
      ]
    },
    {
      id: 3,
      topic: 'Clean-in-Place (CIP) Evidence Defense',
      question: 'When asked: "How do you prove that Lot B processed at 13:00 on Line 1 was not cross-contaminated by contaminated Lot A from 08:00?", what is your strongest defense?',
      inspector: 'Marcus Vance (Plant Operations & Sanitation)',
      options: [
        {
          text: 'We show an authenticated CIP sanitation event at 12:00 with 68°C flush, 210 PPM Peracetic Acid, and an 8 RLU ATP swab (< 25 RLU pass limit).',
          isCorrect: true,
          explanation: 'CORRECT: Demonstrating physical bio-burden eradication with chemical titration and ATP luminescence proves the mechanical break, stopping query bleed.'
        },
        {
          text: 'We tell the inspector our software generated different box colors so they must be clean.',
          isCorrect: false,
          explanation: 'INCORRECT: Inspectors will laugh you out of the room if you claim software alone stops physical residue without verified sanitation logs.'
        },
        {
          text: 'We explain that natural vegetable oils clean the blades between shifts.',
          isCorrect: false,
          explanation: 'INCORRECT: Vegetable residues actually harbor pathogen biofilms.'
        }
      ]
    },
    {
      id: 4,
      topic: '21 CFR § 1.1315 (Multi-Tab vs Flat CSV)',
      question: 'Why did we reject the shortcut of exporting a single flat CSV spreadsheet to the FDA investigator?',
      inspector: 'Dr. Aris Thorne (FDA CFSAN Inspector)',
      options: [
        {
          text: 'The official FDA template requires distinct worksheets per CTE (Receiving § 1.1335, Transformation § 1.1340, Shipping § 1.1345) each with specific KDE columns.',
          isCorrect: true,
          explanation: 'CORRECT: An unstructured single-table dump mixes incompatible transformation KDEs with shipping KDEs, failing compliance audits.'
        },
        {
          text: 'Because CSV files cannot exceed 500 rows.',
          isCorrect: false,
          explanation: 'INCORRECT: CSVs can hold millions of rows, but fail the structured multi-tab layout requirement.'
        },
        {
          text: 'Because Microsoft Excel cannot open CSV files.',
          isCorrect: false,
          explanation: 'INCORRECT: Excel opens CSVs, but loses tab segregation.'
        }
      ]
    },
    {
      id: 5,
      topic: 'TLC Source Linkage (§ 1.1315(a)(1))',
      question: 'Whenever your facility receives an FTL commodity, what two critical elements must you link back to the origin?',
      inspector: 'Elena Rostova (Data Architect)',
      options: [
        {
          text: 'The TLC Source GLN (where code was assigned) and a TLC Source Reference Document (e.g. Bill of Lading, Purchase Order #).',
          isCorrect: true,
          explanation: 'CORRECT: Under FSMA 204, tracking a lot code without its originating source GLN and reference document number violates federal recordkeeping rules.'
        },
        {
          text: 'Only the driver truck driver license number and phone number.',
          isCorrect: false,
          explanation: 'INCORRECT: Driver info does not identify the agricultural packing origin.'
        },
        {
          text: 'The retail store consumer price index.',
          isCorrect: false,
          explanation: 'INCORRECT: Pricing data is explicitly excluded from public health traceability mandates.'
        }
      ]
    }
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    QUESTIONS.forEach(q => {
      const chosen = selectedAnswers[q.id];
      if (chosen !== undefined && q.options[chosen]?.isCorrect) {
        correct++;
      }
    });
    return Math.round((correct / QUESTIONS.length) * 100);
  };

  const score = calculateScore();

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              MOCK REGULATORY DEFENSE BENCH
            </span>
            <span className="text-xs text-slate-400 font-mono">
              FDA CFSAN Form 483 Audit Readiness Exam
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            FDA Mock Inspection Defense Simulator
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Test your knowledge against 5 critical inspection challenge questions posed by ex-FDA regulatory inspectors and plant directors to verify that your traceability architecture withstands audit scrutiny.
          </p>
        </div>

        {submitted ? (
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Audit Defense Score</span>
              <div
                className={`text-2xl font-extrabold font-mono ${
                  score >= 80 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {score}%
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedAnswers({});
                setSubmitted(false);
              }}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Exam</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(selectedAnswers).length < QUESTIONS.length}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950"
          >
            Submit Mock Audit Defense
          </button>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {QUESTIONS.map((q, idx) => {
          const chosen = selectedAnswers[q.id];

          return (
            <div
              key={q.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-amber-400">
                  CHALLENGE #{idx + 1} • {q.topic}
                </span>
                <span className="text-[11px] text-slate-400 italic">
                  Investigator: {q.inspector}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-white leading-relaxed">
                {q.question}
              </h4>

              <div className="space-y-2 mt-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = chosen === optIdx;
                  let optStyle = 'border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-300';

                  if (isSelected && !submitted) {
                    optStyle = 'border-cyan-500 bg-cyan-950/30 text-white font-medium';
                  }

                  if (submitted) {
                    if (opt.isCorrect) {
                      optStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-medium';
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
                    }
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${optStyle}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt.text}</span>
                        {submitted && opt.isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                        )}
                      </div>

                      {submitted && isSelected && (
                        <p className="mt-2 text-[11px] opacity-90 border-t border-slate-800 pt-1.5 font-mono">
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
