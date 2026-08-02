"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Cpu,
  BarChart3,
  ListFilter,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Layers,
  Sparkles,
} from "lucide-react";
import { MOCK_LAPSED_CASES } from "@/lib/data/mockData";
import { LapsedCategoryCase } from "@/lib/types/data";
import { RCCRMetricsSummary, ExperimentLogEntry } from "@/lib/types/metrics";
import { VerificationCheckResult } from "@/lib/types/verification";
import { ConfidenceGateResult } from "@/lib/types/decision";
import OrderAgainIntervention from "./OrderAgainIntervention";
import EvaluatorPipelineDiagram from "./EvaluatorPipelineDiagram";

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
    <div className="space-y-3.5 text-xs">
      {/* Evaluator Header */}
      <div className="bg-blinkit-black text-white p-3.5 rounded-2xl shadow-sm border border-neutral-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="bg-blinkit-yellow text-blinkit-black font-extrabold px-2 py-0.5 rounded text-[9px] tracking-wider uppercase">
              EVALUATOR MODE
            </span>
            <span className="bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded text-[9px] font-mono">
              Internal Debugger
            </span>
          </div>
          <h1 className="text-sm font-extrabold text-white mt-1">
            Mission Recovery System Trace
          </h1>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-4 gap-1 bg-white rounded-xl p-1 border border-blinkit-border shadow-2xs">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === "overview"
              ? "bg-blinkit-black text-white shadow-xs"
              : "text-blinkit-muted hover:bg-neutral-100"
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>Pipeline</span>
        </button>

        <button
          onClick={() => setActiveTab("cases")}
          className={`py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === "cases"
              ? "bg-blinkit-black text-white shadow-xs"
              : "text-blinkit-muted hover:bg-neutral-100"
          }`}
        >
          <Cpu className="w-3 h-3" />
          <span>Cases</span>
        </button>

        <button
          onClick={() => setActiveTab("metrics")}
          className={`py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === "metrics"
              ? "bg-blinkit-black text-white shadow-xs"
              : "text-blinkit-muted hover:bg-neutral-100"
          }`}
        >
          <BarChart3 className="w-3 h-3" />
          <span>Metrics</span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === "logs"
              ? "bg-blinkit-black text-white shadow-xs"
              : "text-blinkit-muted hover:bg-neutral-100"
          }`}
        >
          <ListFilter className="w-3 h-3" />
          <span>Logs</span>
        </button>
      </div>

      {/* Tab 1: System Pipeline Architecture Interactive Diagram */}
      {activeTab === "overview" && <EvaluatorPipelineDiagram />}

      {/* Tab 2: Case Explorer & AI Decision Trace */}
      {activeTab === "cases" && (
        <div className="space-y-3">
          {/* Debug Case Selector */}
          <div className="bg-white p-3 rounded-2xl border border-blinkit-border shadow-xs space-y-2">
            <h2 className="text-[10px] font-extrabold text-blinkit-black uppercase tracking-wider">
              Select Customer Case for AI Trace
            </h2>
            <div className="grid grid-cols-5 gap-1.5">
              {MOCK_LAPSED_CASES.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-1.5 rounded-lg text-center border transition-all ${
                    selectedCaseId === c.id
                      ? "bg-blinkit-yellow/20 border-blinkit-yellow text-blinkit-black font-bold shadow-2xs"
                      : "bg-neutral-50 border-neutral-200 text-neutral-600"
                  }`}
                >
                  <span className="text-[10px] block font-bold">Case {idx + 1}</span>
                  <span className="text-[9px] text-neutral-500 truncate block">
                    {c.customer.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Render Active Customer Card Preview */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block px-1">
              Customer Card Preview
            </span>
            <OrderAgainIntervention caseId={selectedCaseId} showCaseSelector={false} />
          </div>

          {/* Trace Execution Stages */}
          {loading ? (
            <div className="bg-white p-4 rounded-2xl border border-blinkit-border text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blinkit-green" />
              <span>Tracing pipeline...</span>
            </div>
          ) : (
            <div className="space-y-2 text-[11px]">
              {/* Stage 1 Trace */}
              <div className="bg-white p-3 rounded-2xl border border-blinkit-border shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blinkit-black flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blinkit-green" />
                    Stage 1: Lapse Detection
                  </span>
                  <span className="bg-blinkit-green-light text-blinkit-green px-1.5 py-0.2 rounded font-mono text-[9px] font-bold">
                    {activeCase.path_type}
                  </span>
                </div>
                <p className="text-neutral-600">{pipelineState?.detection?.reason}</p>
              </div>

              {/* Stage 2 Trace */}
              <div className="bg-white p-3 rounded-2xl border border-blinkit-border shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between border-b border-blinkit-border pb-1.5">
                  <span className="font-bold text-blinkit-black flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Stage 2: AI Reasoning (Groq)
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-mono text-[9px] font-bold">
                    Action: {reasoning?.recommended_action}
                  </span>
                </div>
                <p className="text-neutral-700 bg-neutral-50 p-2 rounded-lg border border-neutral-200 font-mono text-[10px]">
                  {reasoning?.reasoning_chain}
                </p>
              </div>

              {/* Stage 3 & 4 Trace */}
              <div className="bg-white p-3 rounded-2xl border border-blinkit-border shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blinkit-black">Stage 3 & 4: Safety & Verification</span>
                  <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-bold ${
                    verify?.is_verified ? "bg-blinkit-green-light text-blinkit-green" : "bg-red-100 text-red-700"
                  }`}>
                    Gate: {((gate?.confidence_score || 0) * 100).toFixed(0)}% | {verify?.final_decision}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Metrics Dashboard */}
      {activeTab === "metrics" && metricsSummary && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-3 rounded-2xl border border-blinkit-border shadow-2xs text-center">
              <span className="text-[9px] font-bold text-blinkit-green uppercase block">Treatment RCCR</span>
              <span className="text-xl font-extrabold text-blinkit-green block mt-0.5">{metricsSummary.treatment_rccr}%</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-blinkit-border shadow-2xs text-center">
              <span className="text-[9px] font-bold text-neutral-500 uppercase block">Control RCCR</span>
              <span className="text-xl font-extrabold text-neutral-700 block mt-0.5">{metricsSummary.control_rccr}%</span>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-3 rounded-2xl shadow-2xs text-center">
              <span className="text-[9px] font-bold uppercase block opacity-90">Uplift (Δ)</span>
              <span className="text-xl font-extrabold block mt-0.5">+{metricsSummary.rccr_absolute_uplift}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: System Experiment Logs */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-2xl border border-blinkit-border shadow-2xs overflow-hidden text-[11px]">
          <div className="p-2.5 bg-neutral-50 border-b border-blinkit-border font-bold text-blinkit-black uppercase tracking-wider">
            Stage 6 Logs ({logs.length} entries)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="bg-neutral-100 text-neutral-600 text-[9px] uppercase border-b">
                  <th className="p-2">Customer</th>
                  <th className="p-2">Path</th>
                  <th className="p-2 text-center">Gate</th>
                  <th className="p-2 text-center">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {logs.slice(0, 10).map((log) => (
                  <tr key={log.id}>
                    <td className="p-2 font-sans">{log.customer_name}</td>
                    <td className="p-2">{log.path_type === "PATH_A_KNOWN_SIGNAL" ? "Path A" : "Path B"}</td>
                    <td className="p-2 text-center">{((log.stage3_confidence_score || 0) * 100).toFixed(0)}%</td>
                    <td className="p-2 text-center">
                      {log.converted_repeat_order ? (
                        <span className="text-blinkit-green font-bold">CONVERTED</span>
                      ) : (
                        <span className="text-neutral-400">No repeat</span>
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
