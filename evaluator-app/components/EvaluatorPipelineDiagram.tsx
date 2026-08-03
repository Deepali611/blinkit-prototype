"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Layers,
} from "lucide-react";

interface StageDetail {
  stageNumber: number;
  title: string;
  shortTitle: string;
  type: string;
  badgeBg: string;
  badgeText: string;
  summary: string;
  technicalLogic: {
    input: string;
    rules: string[];
    output: string;
    codeSnippet?: string;
  };
}

export default function EvaluatorPipelineDiagram() {
  const [expandedStage, setExpandedStage] = useState<number | null>(1);

  const stages: StageDetail[] = [
    {
      stageNumber: 1,
      title: "Stage 1 — Deterministic Lapse Detection",
      shortTitle: "Lapse Detection",
      type: "Deterministic Rule Engine",
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-800 border-blue-200",
      summary: "Flags single-purchase category expanders older than N days with zero repeat orders.",
      technicalLogic: {
        input: "Customer profile & full order history array",
        rules: [
          "orders_count(category_X) == 1 (Single trial purchase outside usual pattern)",
          "order_age >= 14 days threshold",
          "repeat_purchases_since(category_X) == 0",
          "Path Routing: Explicit negative signal (return, rating <= 3, ticket) -> Path A (Known Signal). No explicit signal -> Path B (Inferred Signal).",
        ],
        output: "LapseDetectionResult { is_eligible: boolean, path_type: PATH_A | PATH_B, priority: HIGH | MEDIUM }",
        codeSnippet: `detectLapse(customer, orders, thresholdDays = 14) -> {
  is_eligible: true,
  path_type: "PATH_B_INFERRED_SIGNAL",
  priority: "MEDIUM"
}`,
      },
    },
    {
      stageNumber: 2,
      title: "Stage 2 — AI Reasoning Core",
      shortTitle: "AI Reasoning",
      type: "Server-side Groq LLM",
      badgeBg: "bg-purple-100",
      badgeText: "text-purple-800 border-purple-200",
      summary: "Selects factual evidence, generates reassurance, and recommends an allowed action.",
      technicalLogic: {
        input: "Lapsed order context, product evidence, and Path A/B assignment",
        rules: [
          "Path A (Confirmed Signal): Addresses verified failure type (quality, unresolved support, rating <= 3) directly.",
          "Path B (Inferred Signal - Hard Rule): Must infer probable failure type under uncertainty. System prompt strictly forbids claiming knowledge of unconfirmed customer incidents.",
          "Action Selection: Restricts output to 1 allowed action from fixed registry: highlight_seller | show_expiry_verification | show_replacement_guarantee | jump_to_reviews | focus_cta | no_action.",
        ],
        output: "AIReasoningOutput { target_failure_type, reasoning_chain, reassurance_headline, recommended_action }",
        codeSnippet: `performAIReasoning(input) -> Groq API (llama-3.3-70b-versatile) 
 response_format: { type: "json_object" }`,
      },
    },
    {
      stageNumber: 3,
      title: "Stage 3 — Deterministic Confidence Gate",
      shortTitle: "Confidence Gate",
      type: "Pure Numeric Weight Engine",
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-800 border-amber-200",
      summary: "Computes 5-part confidence score purely from numeric evidence metrics (minimum 0.70 threshold).",
      technicalLogic: {
        input: "ProductEvidence metrics & AI reasoning output",
        rules: [
          "Seller Consistency Score: 25% weight (seller_consistency_score / 100 * 0.25)",
          "Category Reorder Rate: 25% weight (reorder_rate * 0.25)",
          "QC Expiry Verification: 20% weight (verified_batch ? 0.20 : 0.05)",
          "Review Trust Factor: 15% weight (volume * rating / 5 * 0.15)",
          "Instant Guarantee Policy: 15% weight (instant_refund ? 0.15 : 0.08)",
          "Gating Threshold: Total score must be >= 0.70 (70%). If < 0.70, intervention is suppressed -> Stage 5 Baseline.",
        ],
        output: "ConfidenceGateResult { confidence_score: float (0.00-1.00), passed_gate: boolean, breakdown }",
        codeSnippet: `evaluateConfidenceGate(evidence, reasoningOutput, minThreshold = 0.70)
 -> score >= 0.70 ? PROCEED_TO_VERIFICATION : SUPPRESS_INTERVENTION`,
      },
    },
    {
      stageNumber: 4,
      title: "Stage 4 — Verification & Anti-Hallucination Guard",
      shortTitle: "Anti-Hallucination",
      type: "Deterministic Grounding Guard",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-800 border-emerald-200",
      summary: "Validates claims against underlying evidence & fails closed on Path B safety violations.",
      technicalLogic: {
        input: "Generated reassurance text & ProductEvidence ground truth",
        rules: [
          "Path B Hard Safety Check: Scans headline & body for forbidden personal phrases ('we know your', 'your last order', 'sorry about your'). Rejects any message asserting unconfirmed personal history.",
          "Grounding Verification Check: Verifies numeric percentages (e.g. 98%) match seller consistency score or reorder rate within +/- 3% tolerance.",
          "Action Consistency Check: Validates recommended_action against allowed registry.",
          "Fail-Closed Rule: If any check fails, immediately sets final_decision = 'REJECTED_FAIL_CLOSED'.",
        ],
        output: "VerificationCheckResult { is_verified: boolean, final_decision: APPROVED | REJECTED_FAIL_CLOSED }",
        codeSnippet: `verifyEvidence(reasoningOutput, evidence) 
 -> passes_all_checks ? APPROVED_FOR_DISPLAY : REJECTED_FAIL_CLOSED`,
      },
    },
    {
      stageNumber: 5,
      title: "Stage 5 — Baseline UI Fallback",
      shortTitle: "Baseline Fallback",
      type: "Control & Safety Fallback UI",
      badgeBg: "bg-neutral-200",
      badgeText: "text-neutral-800 border-neutral-300",
      summary: "Renders standard native Blinkit UI for holdout control customers or suppressed sessions.",
      technicalLogic: {
        input: "Holdout status flag OR failed confidence/verification results",
        rules: [
          "If customer.holdout_group == true -> Always render baseline experience (Control group).",
          "If Stage 3 Confidence Gate fails (< 0.70) -> Fallback to baseline UI.",
          "If Stage 4 Verification Engine fails closed -> Fallback to baseline UI.",
          "Ensures standard quick-commerce UX is never disrupted by broken or unverified interventions.",
        ],
        output: "Native standard product card without reassurance badges",
        codeSnippet: `!is_verified || !passed_gate || is_holdout 
 -> render Baseline Standard Blinkit Product Row`,
      },
    },
    {
      stageNumber: 6,
      title: "Stage 6 — Outcome Logging & RCCR Metric Pipeline",
      shortTitle: "RCCR Pipeline",
      type: "Experiment Tracker & Metric Engine",
      badgeBg: "bg-indigo-100",
      badgeText: "text-indigo-800 border-indigo-200",
      summary: "Tracks 30-day repeat conversions to compute Repeat-Category Conversion Rate (RCCR) uplift.",
      technicalLogic: {
        input: "Session intervention trace & 30-day repeat purchase events",
        rules: [
          "Logs full trace: session_id, customer_id, path_type, confidence_score, verified_status, holdout_group.",
          "Tracks repeat purchase conversions in the lapsed category within 30 days.",
          "Computes Repeat-Category Conversion Rate (RCCR): Treatment RCCR vs Control Holdout RCCR.",
          "Calculates Absolute Uplift (Δ RCCR) = Treatment RCCR - Control RCCR (+15.8% uplift).",
        ],
        output: "RCCRMetricsSummary { treatment_rccr: 28.3%, control_rccr: 12.5%, rccr_absolute_uplift: +15.8% }",
        codeSnippet: `computeRCCRMetrics(logs) -> {
  treatment_rccr: 28.33%,
  control_rccr: 12.50%,
  rccr_absolute_uplift: +15.83%
}`,
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-extrabold text-blinkit-black uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blinkit-green" />
            6-Stage Interactive Visual Pipeline
          </h2>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Click any stage box to inspect real technical rules, input/output contracts, and code logic.
          </p>
        </div>
        <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-mono">
          Interactive Architecture
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        {stages.map((stg, idx) => {
          const isSelected = expandedStage === stg.stageNumber;

          return (
            <div key={stg.stageNumber} className="flex flex-col items-center">
              <button
                onClick={() =>
                  setExpandedStage(isSelected ? null : stg.stageNumber)
                }
                className={`w-full p-2.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                  isSelected
                    ? "bg-white border-blinkit-black shadow-md ring-2 ring-blinkit-black/10"
                    : "bg-white border-neutral-200 hover:border-neutral-400 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="w-5 h-5 rounded-full bg-blinkit-black text-white text-[10px] font-extrabold flex items-center justify-center">
                    {stg.stageNumber}
                  </span>
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.2 rounded border uppercase font-mono ${stg.badgeBg} ${stg.badgeText}`}
                  >
                    {stg.shortTitle}
                  </span>
                </div>

                <h3 className="text-[11px] font-bold text-blinkit-black leading-tight line-clamp-2">
                  {stg.title.split(" — ")[1] || stg.title}
                </h3>

                <p className="text-[9px] text-neutral-500 line-clamp-2 mt-1 leading-snug">
                  {stg.summary}
                </p>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100 text-[9px] text-neutral-400 font-semibold">
                  <span>{isSelected ? "Hide Logic" : "Inspect Logic"}</span>
                  {isSelected ? (
                    <ChevronUp className="w-3 h-3 text-blinkit-black" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  )}
                </div>
              </button>

              {idx < stages.length - 1 && (
                <div className="hidden md:flex items-center justify-center my-1 text-neutral-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {expandedStage !== null && (
        <div className="bg-white p-4 rounded-2xl border border-blinkit-black shadow-md space-y-3 transition-all animate-fadeIn">
          {(() => {
            const activeStg = stages.find(
              (s) => s.stageNumber === expandedStage
            )!;

            return (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blinkit-black text-white text-xs font-extrabold flex items-center justify-center">
                      {activeStg.stageNumber}
                    </span>
                    <h3 className="font-extrabold text-blinkit-black text-sm">
                      {activeStg.title}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${activeStg.badgeBg} ${activeStg.badgeText}`}
                  >
                    {activeStg.type}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                        Input Contract
                      </span>
                      <p className="font-mono text-[11px] text-neutral-800 font-semibold mt-0.5">
                        {activeStg.technicalLogic.input}
                      </p>
                    </div>

                    <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                        Output Contract
                      </span>
                      <p className="font-mono text-[11px] text-blinkit-green font-bold mt-0.5">
                        {activeStg.technicalLogic.output}
                      </p>
                    </div>
                  </div>

                  {activeStg.technicalLogic.codeSnippet && (
                    <div className="bg-neutral-900 text-neutral-100 p-3 rounded-xl font-mono text-[10px] space-y-1 shadow-inner flex flex-col justify-between">
                      <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                        Execution Signature
                      </span>
                      <pre className="overflow-x-auto text-emerald-400 whitespace-pre-wrap leading-relaxed">
                        {activeStg.technicalLogic.codeSnippet}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-blinkit-black uppercase tracking-wider block">
                    Technical Rules & Verification Logic
                  </span>
                  <ul className="space-y-1 text-[11px] text-neutral-700">
                    {activeStg.technicalLogic.rules.map((rule, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-1.5">
                        <span className="text-blinkit-green font-bold shrink-0">
                          •
                        </span>
                        <span className="leading-snug">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
