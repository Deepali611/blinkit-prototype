"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Cpu,
  BarChart3,
  ListFilter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Layers,
  Sparkles,
} from "lucide-react";
import { MOCK_LAPSED_CASES } from "@/lib/data/mockData";
import { LapsedCategoryCase } from "@/lib/types/data";
import { RCCRMetricsSummary, ExperimentLogEntry } from "@/lib/types/metrics";
import { VerificationCheckResult } from "@/lib/types/verification";
import { ConfidenceGateResult } from "@/lib/types/decision";

export default function EvaluatorMode() {
  const [activeTab, setActiveTab] = useState<"overview" | "cases" | "metrics" | "logs">("overview");
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case-01");
  const [loading, setLoading] = useState<boolean>(false);
  const [pipelineState, setPipelineState] = useState<{
    detection?: any;
    gate?: ConfidenceGateResult;
    verification?: VerificationCheckResult;
  } | null>(null);

  const [metricsSummary, setMetricsSummary] = useState<RCCRMetricsSummary | null>(null);
  const [logs, setLogs] = useState<ExperimentLogEntry[]>([]);

  const activeCase = MOCK_LAPSED_CASES.find((c) => c.id === selectedCaseId) || MOCK_LAPSED_CASES[0];

  useEffect(() => {
    async function fetchCaseTrace() {
      setLoading(true);
      try {
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caseId: selectedCaseId }),
        });
        const data = await res.json();
        setPipelineState({
          detection: data.detection_result,
          gate: data.gate_result,
          verification: data.verification_result,
        });
      } catch (err) {
        console.error("Error fetching trace:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCaseTrace();
  }, [selectedCaseId]);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("/api/metrics");
        const data = await res.json();
        if (data.success) {
          setMetricsSummary(data.summary);
          setLogs(data.recent_logs || []);
        }
      } catch (err) {
        console.error("Error fetching metrics:", err);
      }
    }
    fetchMetrics();
  }, []);

  const gate = pipelineState?.gate;
  const verify = pipelineState?.verification;
  const reasoning = gate?.reasoning_output;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Evaluator Header */}
      <div className="bg-blinkit-black text-white p-5 rounded-2xl shadow-md border border-neutral-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blinkit-yellow text-blinkit-black font-extrabold px-2.5 py-0.5 rounded text-[10px] tracking-wider uppercase">
              INTERNAL EVALUATOR MODE
            </span>
            <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded text-[10px] font-mono">
              v1.0-production
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">
            Mission Recovery — System Architecture & Trace
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Stage 1-6 Deterministic Rules, AI Reasoning, Anti-Hallucination Guard & RCCR Metric Pipeline.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-blinkit-border bg-white rounded-xl p-1 gap-1 shadow-xs">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "overview"
              ? "bg-blinkit-black text-white shadow-xs"
              : "text-blinkit-muted hover:bg-neutral-100"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>System Pipeline</span>
        </button>

        <button
          onClick={() => setActiveTab("cases")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "cases"
              ? "bg-blinkit-black text-white shadow-xs"
              : "text-blinkit-muted hover:bg-neutral-100"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Case Trace</span>
        </button>

        <button
          onClick={() => setActiveTab("metrics")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "metrics"
              ? "bg-blinkit-black text-white shadow-xs"
              : "text-blinkit-muted hover:bg-neutral-100"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>RCCR Metrics</span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "logs"
              ? "bg-blinkit-black text-white shadow-xs"
              : "text-blinkit-muted hover:bg-neutral-100"
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Experiment Logs</span>
        </button>
      </div>

      {/* Tab 1: System Pipeline Architecture */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-blinkit-border shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-blinkit-black flex items-center gap-2">
              <Layers className="w-4 h-4 text-blinkit-green" />
              6-Stage Safety & Reasoning Architecture
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1">
                <span className="font-bold text-blinkit-black text-xs block">
                  Stage 1 — Deterministic Lapse Detection
                </span>
                <p className="text-neutral-600 leading-snug">
                  Rules engine flags Lapsed Category Expanders (1 purchase, &gt;14 days, 0 repeat) and assigns Path A (Known Signal) or Path B (Inferred).
                </p>
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1">
                <span className="font-bold text-blinkit-black text-xs block">
                  Stage 2 — AI Reasoning Core
                </span>
                <p className="text-neutral-600 leading-snug">
                  Groq LLM selects evidence & generates reassurance. Path B enforces strict constraint: never asserts unconfirmed personal history.
                </p>
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1">
                <span className="font-bold text-blinkit-black text-xs block">
                  Stage 3 — Deterministic Confidence Gate
                </span>
                <p className="text-neutral-600 leading-snug">
                  Computes score purely from numeric evidence metrics (seller score $25\%$, reorder rate $25\%$, QC expiry $20\%$, reviews $15\%$, guarantee $15\%$). Minimum threshold $0.70$.
                </p>
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1">
                <span className="font-bold text-blinkit-black text-xs block">
                  Stage 4 — Verification & Anti-Hallucination Guard
                </span>
                <p className="text-neutral-600 leading-snug">
                  Grounds percentage claims against evidence & rejects forbidden personal incident phrases for Path B. Fails closed.
                </p>
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1">
                <span className="font-bold text-blinkit-black text-xs block">
                  Stage 5 — Baseline UI Fallback
                </span>
                <p className="text-neutral-600 leading-snug">
                  Standard Blinkit UI rendered for control holdout group or when pipeline suppresses intervention.
                </p>
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1">
                <span className="font-bold text-blinkit-black text-xs block">
                  Stage 6 — Outcome Logging & RCCR Pipeline
                </span>
                <p className="text-neutral-600 leading-snug">
                  Tracks 30-day repeat conversions to measure Repeat-Category Conversion Rate (RCCR) uplift vs holdout control.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Case Explorer & AI Decision Trace */}
      {activeTab === "cases" && (
        <div className="space-y-4">
          {/* Case Selector */}
          <div className="bg-white p-4 rounded-2xl border border-blinkit-border shadow-sm space-y-3">
            <h2 className="text-xs font-extrabold text-blinkit-black uppercase tracking-wider">
              Select Customer Case for Full Trace
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {MOCK_LAPSED_CASES.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    selectedCaseId === c.id
                      ? "bg-blinkit-yellow/20 border-blinkit-yellow text-blinkit-black font-bold shadow-xs"
                      : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <span className="text-xs block font-bold">Case {idx + 1}</span>
                  <span className="text-[10px] text-neutral-500 truncate block">
                    {c.customer.name.split(" ")[0]}
                  </span>
                  <span className="text-[9px] font-mono block mt-0.5 text-blinkit-green font-semibold">
                    {c.path_type === "PATH_A_KNOWN_SIGNAL" ? "Path A" : "Path B"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Case Context Summary */}
          <div className="bg-white p-4 rounded-2xl border border-blinkit-border shadow-sm space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-blinkit-border pb-2">
              <span className="font-extrabold text-blinkit-black text-sm">
                Customer: {activeCase.customer.name} ({activeCase.customer.email})
              </span>
              <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-mono text-[10px]">
                {activeCase.customer.holdout_group ? "Control Holdout" : "Treatment Candidate"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Lapsed Purchase</span>
                <span className="font-bold text-blinkit-black">{activeCase.lapsed_order.product_name}</span>
                <span className="text-neutral-500 block text-[11px]">
                  ₹{activeCase.lapsed_order.price} • {activeCase.lapsed_order.days_ago} days ago ({activeCase.lapsed_order.category_name})
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Signal Status</span>
                <span className="font-bold text-blinkit-black">
                  {activeCase.lapsed_order.negative_signal?.has_explicit_signal
                    ? `Path A Explicit Signal (${activeCase.lapsed_order.negative_signal.signal_type})`
                    : "Path B Inferred (No explicit complaint recorded)"}
                </span>
              </div>
            </div>
          </div>

          {/* Trace Execution Stages */}
          {loading ? (
            <div className="bg-white p-8 rounded-2xl border border-blinkit-border text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blinkit-green" />
              <span>Tracing Stage 1-6 pipeline execution...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Stage 1 Trace */}
              <div className="bg-white p-4 rounded-2xl border border-blinkit-border shadow-sm space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blinkit-black flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blinkit-green" />
                    Stage 1: Lapse Detection
                  </span>
                  <span className="bg-blinkit-green-light text-blinkit-green px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                    Eligible ({pipelineState?.detection?.priority || "HIGH"})
                  </span>
                </div>
                <p className="text-neutral-600 mt-1">{pipelineState?.detection?.reason}</p>
              </div>

              {/* Stage 2 Trace */}
              <div className="bg-white p-4 rounded-2xl border border-blinkit-border shadow-sm space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-blinkit-border pb-2">
                  <span className="font-bold text-blinkit-black flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Stage 2: AI Reasoning (Groq LLM)
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                    Action: {reasoning?.recommended_action}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 font-semibold uppercase">Reasoning Chain</span>
                  <p className="text-neutral-700 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 mt-0.5 font-mono text-[11px]">
                    {reasoning?.reasoning_chain}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase">Headline</span>
                    <p className="font-bold text-blinkit-black">{reasoning?.reassurance_headline}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase">Reassurance Body</span>
                    <p className="text-neutral-700">{reasoning?.reassurance_body}</p>
                  </div>
                </div>
              </div>

              {/* Stage 3 Trace */}
              <div className="bg-white p-4 rounded-2xl border border-blinkit-border shadow-sm space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-blinkit-border pb-2">
                  <span className="font-bold text-blinkit-black flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blinkit-green" />
                    Stage 3: Deterministic Confidence Gate
                  </span>
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                    gate?.passed_gate ? "bg-blinkit-green-light text-blinkit-green" : "bg-red-100 text-red-700"
                  }`}>
                    Score: {((gate?.confidence_score || 0) * 100).toFixed(1)}% ({gate?.confidence_level})
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 pt-1 text-center text-[10px]">
                  <div className="bg-neutral-50 p-1.5 rounded border">
                    <span className="block text-neutral-400">Seller Score</span>
                    <span className="font-bold">{((gate?.breakdown?.seller_consistency_contribution || 0) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="bg-neutral-50 p-1.5 rounded border">
                    <span className="block text-neutral-400">Reorder Rate</span>
                    <span className="font-bold">{((gate?.breakdown?.reorder_rate_contribution || 0) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="bg-neutral-50 p-1.5 rounded border">
                    <span className="block text-neutral-400">QC Expiry</span>
                    <span className="font-bold">{((gate?.breakdown?.qc_expiry_contribution || 0) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="bg-neutral-50 p-1.5 rounded border">
                    <span className="block text-neutral-400">Review Trust</span>
                    <span className="font-bold">{((gate?.breakdown?.review_trust_contribution || 0) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="bg-neutral-50 p-1.5 rounded border">
                    <span className="block text-neutral-400">Guarantee</span>
                    <span className="font-bold">{((gate?.breakdown?.replacement_guarantee_contribution || 0) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Stage 4 Trace */}
              <div className="bg-white p-4 rounded-2xl border border-blinkit-border shadow-sm space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-blinkit-border pb-2">
                  <span className="font-bold text-blinkit-black flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blinkit-green" />
                    Stage 4: Verification & Anti-Hallucination Guard
                  </span>
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                    verify?.is_verified ? "bg-blinkit-green-light text-blinkit-green" : "bg-red-100 text-red-700"
                  }`}>
                    {verify?.final_decision}
                  </span>
                </div>
                <div className="flex gap-4 text-[11px]">
                  <span className={`flex items-center gap-1 font-medium ${
                    verify?.path_b_safety_check_passed ? "text-blinkit-green" : "text-red-600"
                  }`}>
                    {verify?.path_b_safety_check_passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    Path B Safety Check
                  </span>
                  <span className={`flex items-center gap-1 font-medium ${
                    verify?.grounding_check_passed ? "text-blinkit-green" : "text-red-600"
                  }`}>
                    {verify?.grounding_check_passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    Evidence Grounding
                  </span>
                  <span className={`flex items-center gap-1 font-medium ${
                    verify?.action_check_passed ? "text-blinkit-green" : "text-red-600"
                  }`}>
                    {verify?.action_check_passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    Action Consistency
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Metrics Dashboard */}
      {activeTab === "metrics" && metricsSummary && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-blinkit-border shadow-sm text-center">
              <span className="text-[10px] font-bold text-blinkit-green uppercase tracking-wider block">
                Treatment RCCR
              </span>
              <span className="text-2xl font-extrabold text-blinkit-green block mt-1">
                {metricsSummary.treatment_rccr}%
              </span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">
                {metricsSummary.treatment_conversions} / {metricsSummary.treatment_total} repeat conversions
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-blinkit-border shadow-sm text-center">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                Control Holdout RCCR
              </span>
              <span className="text-2xl font-extrabold text-neutral-700 block mt-1">
                {metricsSummary.control_rccr}%
              </span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">
                {metricsSummary.control_conversions} / {metricsSummary.control_total} repeat conversions
              </span>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-4 rounded-2xl shadow-sm text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 block">
                Absolute RCCR Uplift (Δ)
              </span>
              <span className="text-2xl font-extrabold block mt-1">
                +{metricsSummary.rccr_absolute_uplift}%
              </span>
              <span className="text-[10px] opacity-90 block mt-0.5">
                +{metricsSummary.rccr_relative_lift}% relative conversion lift
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-blinkit-border shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-blinkit-black text-xs uppercase tracking-wider">
              Path Specific Conversion & Safety Guard Rates
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-neutral-50 p-2.5 rounded-xl border">
                <span className="text-[10px] text-neutral-400 block">Path A RCCR</span>
                <span className="font-extrabold text-blinkit-black text-sm">{metricsSummary.path_a_rccr}%</span>
              </div>
              <div className="bg-neutral-50 p-2.5 rounded-xl border">
                <span className="text-[10px] text-neutral-400 block">Path B RCCR</span>
                <span className="font-extrabold text-blinkit-black text-sm">{metricsSummary.path_b_rccr}%</span>
              </div>
              <div className="bg-neutral-50 p-2.5 rounded-xl border">
                <span className="text-[10px] text-neutral-400 block">Confidence Pass</span>
                <span className="font-extrabold text-blinkit-green text-sm">{metricsSummary.gate_pass_rate}%</span>
              </div>
              <div className="bg-neutral-50 p-2.5 rounded-xl border">
                <span className="text-[10px] text-neutral-400 block">Verification Pass</span>
                <span className="font-extrabold text-blinkit-green text-sm">{metricsSummary.verification_pass_rate}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: System Experiment Logs */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-2xl border border-blinkit-border shadow-sm overflow-hidden text-xs">
          <div className="p-3 bg-neutral-50 border-b border-blinkit-border flex items-center justify-between">
            <span className="font-bold text-blinkit-black text-xs uppercase tracking-wider">
              Live System Experiment Logs ({logs.length} entries)
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Stage 6 Logging</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-100 text-neutral-600 border-b border-neutral-200 text-[10px] uppercase font-bold">
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Customer</th>
                  <th className="p-2.5">Path</th>
                  <th className="p-2.5">Action</th>
                  <th className="p-2.5 text-center">Gate</th>
                  <th className="p-2.5 text-center">Verify</th>
                  <th className="p-2.5 text-center">Repeat Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50">
                    <td className="p-2.5 text-neutral-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-2.5 font-sans font-medium text-blinkit-black">
                      {log.customer_name}
                    </td>
                    <td className="p-2.5 text-neutral-600">
                      {log.path_type === "PATH_A_KNOWN_SIGNAL" ? "Path A" : "Path B"}
                    </td>
                    <td className="p-2.5 font-sans text-neutral-700">
                      {log.stage2_action_recommended}
                    </td>
                    <td className="p-2.5 text-center">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                        log.stage3_passed_gate ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {((log.stage3_confidence_score || 0) * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      {log.stage4_verified ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-600 font-bold">✕</span>
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      {log.converted_repeat_order ? (
                        <span className="bg-blinkit-green-light text-blinkit-green font-bold px-2 py-0.5 rounded text-[10px]">
                          CONVERTED ({log.days_to_repeat_purchase}d)
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-[10px]">No repeat</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
