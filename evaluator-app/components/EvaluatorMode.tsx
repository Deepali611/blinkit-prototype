"use client";

import { useState, useEffect } from "react";
import {
  Cpu,
  BarChart3,
  ListFilter,
  CheckCircle2,
  RefreshCw,
  Layers,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { MOCK_LAPSED_CASES } from "@/lib/data/mockData";
import { RCCRMetricsSummary, ExperimentLogEntry } from "@/lib/types/metrics";
import { VerificationCheckResult } from "@/lib/types/verification";
import { ConfidenceGateResult } from "@/lib/types/decision";
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
    <div className="space-y-4 text-xs">
      {/* Standalone Evaluator Header */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 font-extrabold px-2.5 py-0.5 rounded text-[10px] tracking-wider uppercase">
              STANDALONE EVALUATOR DEPLOYMENT
            </span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
              Mission Recovery Intelligence
            </span>
          </div>
          <h1 className="text-base font-extrabold text-white mt-1">
            Blinkit Mission Recovery — Safety & Reasoning Architecture
          </h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-900/90 rounded-xl p-1.5 border border-slate-800 shadow-sm">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "overview"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Pipeline Diagram</span>
        </button>

        <button
          onClick={() => setActiveTab("cases")}
          className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "cases"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Case Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab("metrics")}
          className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "metrics"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>RCCR Metrics</span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "logs"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Experiment Logs</span>
        </button>
      </div>

      {/* Tab 1: Interactive Pipeline Architecture */}
      {activeTab === "overview" && <EvaluatorPipelineDiagram />}

      {/* Tab 2: Case Explorer & AI Decision Trace */}
      {activeTab === "cases" && (
        <div className="space-y-3">
          <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Select Customer Case for AI Trace
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {MOCK_LAPSED_CASES.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    selectedCaseId === c.id
                      ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs"
                      : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <span className="text-xs block font-bold">Case {idx + 1}</span>
                  <span className="text-[10px] text-neutral-500 truncate block mt-0.5">
                    {c.customer.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Trace Execution Stages */}
          {loading ? (
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Executing Stage 1-4 pipeline trace...</span>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Stage 1: Deterministic Lapse Detection
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                    {activeCase.path_type}
                  </span>
                </div>
                <p className="text-neutral-700">{pipelineState?.detection?.reason}</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-neutral-150 pb-2">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Stage 2: AI Reasoning Core (Groq LLM)
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                    Action: {reasoning?.recommended_action}
                  </span>
                </div>
                <p className="text-neutral-800 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 font-mono text-xs leading-relaxed">
                  {reasoning?.reasoning_chain}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">Stage 3 & 4: Safety Gate & Anti-Hallucination Guard</span>
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                    verify?.is_verified ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                  }`}>
                    Gate Score: {((gate?.confidence_score || 0) * 100).toFixed(0)}% | Decision: {verify?.final_decision}
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
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs text-center">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase block">Treatment Group RCCR</span>
              <span className="text-2xl font-black text-emerald-600 block mt-1">{metricsSummary.treatment_rccr}%</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs text-center">
              <span className="text-[10px] font-extrabold text-neutral-500 uppercase block">Control Holdout RCCR</span>
              <span className="text-2xl font-black text-neutral-700 block mt-1">{metricsSummary.control_rccr}%</span>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-sm text-center">
              <span className="text-[10px] font-extrabold uppercase block opacity-90">Net Absolute Uplift (Δ)</span>
              <span className="text-2xl font-black block mt-1">+{metricsSummary.rccr_absolute_uplift}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: System Logs */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden text-xs">
          <div className="p-3 bg-neutral-50 border-b border-neutral-200 font-extrabold text-slate-900 uppercase tracking-wider">
            Stage 6 Experiment Log Stream ({logs.length} entries)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="bg-neutral-100 text-neutral-600 text-[10px] uppercase border-b">
                  <th className="p-2.5">Customer</th>
                  <th className="p-2.5">Path</th>
                  <th className="p-2.5 text-center">Gate Score</th>
                  <th className="p-2.5 text-center">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {logs.slice(0, 10).map((log) => (
                  <tr key={log.id}>
                    <td className="p-2.5 font-sans font-medium">{log.customer_name}</td>
                    <td className="p-2.5">{log.path_type === "PATH_A_KNOWN_SIGNAL" ? "Path A" : "Path B"}</td>
                    <td className="p-2.5 text-center">{((log.stage3_confidence_score || 0) * 100).toFixed(0)}%</td>
                    <td className="p-2.5 text-center">
                      {log.converted_repeat_order ? (
                        <span className="text-emerald-600 font-bold">CONVERTED</span>
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
