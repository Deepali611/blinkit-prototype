"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, RefreshCw, ChevronRight, Star, Award } from "lucide-react";
import { MOCK_LAPSED_CASES } from "@/lib/data/mockData";
import { LapsedCategoryCase } from "@/lib/types/data";
import { VerificationCheckResult } from "@/lib/types/verification";
import { ConfidenceGateResult } from "@/lib/types/decision";
import { AIReasoningOutput } from "@/lib/types/reasoning";

interface CategoryReEntryRowProps {
  caseId?: string;
  showCaseSelector?: boolean; // Default false for customer views
}

export default function CategoryReEntryRow({
  caseId = "case-02",
  showCaseSelector = false,
}: CategoryReEntryRowProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(caseId);
  const [loading, setLoading] = useState<boolean>(false);
  const [pipelineData, setPipelineData] = useState<{
    caseData: LapsedCategoryCase;
    gateResult?: ConfidenceGateResult;
    verificationResult?: VerificationCheckResult;
    reasoningOutput?: AIReasoningOutput;
  } | null>(null);

  const activeCase = MOCK_LAPSED_CASES.find((c) => c.id === selectedCaseId) || MOCK_LAPSED_CASES[1];

  useEffect(() => {
    async function runPipeline() {
      setLoading(true);
      try {
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caseId: selectedCaseId }),
        });
        const data = await res.json();
        setPipelineData({
          caseData: activeCase,
          gateResult: data.gate_result,
          verificationResult: data.verification_result,
          reasoningOutput: data.gate_result?.reasoning_output || data.reasoning_output,
        });
      } catch (err) {
        console.error("Pipeline fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    runPipeline();
  }, [selectedCaseId, activeCase]);

  const gateResult = pipelineData?.gateResult;
  const verifyResult = pipelineData?.verificationResult;
  const reasoning = pipelineData?.reasoningOutput;
  const product = activeCase.product_evidence;

  const isHoldout = activeCase.customer.holdout_group;
  const isApproved = verifyResult?.is_verified && gateResult?.passed_gate && !isHoldout;

  return (
    <div className="space-y-3">
      {/* Optional Debug Case Selector for Evaluator Mode */}
      {showCaseSelector && (
        <div className="bg-white p-3 rounded-xl border border-blinkit-border shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-blinkit-black uppercase tracking-wider block">
            Debug Case Selector (Evaluator Only)
          </span>
          <div className="grid grid-cols-5 gap-1">
            {MOCK_LAPSED_CASES.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`py-1 rounded text-[10px] font-bold border text-center ${
                  selectedCaseId === c.id
                    ? "bg-blinkit-green-light border-blinkit-green text-blinkit-green"
                    : "bg-neutral-50 text-neutral-600"
                }`}
              >
                Case {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Header & Product Re-Entry PDP Mockup */}
      <div className="bg-white rounded-2xl border border-blinkit-border shadow-xs overflow-hidden p-3.5 space-y-3">
        <div className="flex items-center justify-between border-b border-blinkit-border pb-2.5">
          <div>
            <span className="text-[9px] font-bold text-blinkit-green uppercase tracking-wider bg-blinkit-green-light px-2 py-0.5 rounded-full">
              {product.category_name}
            </span>
            <h2 className="text-sm font-bold text-blinkit-black mt-1">
              {product.product_name}
            </h2>
          </div>
          <span className="text-xs font-extrabold text-blinkit-black bg-neutral-100 px-2.5 py-1 rounded-xl">
            ₹{activeCase.lapsed_order.price}
          </span>
        </div>

        {/* Inline Trust Row — Real Blinkit PDP row convention */}
        {loading ? (
          <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 text-[11px] text-neutral-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blinkit-green" />
            <span>Loading...</span>
          </div>
        ) : isApproved && reasoning ? (
          <div className="bg-[#EAF7E6] border border-blinkit-green/30 rounded-xl p-3 flex items-center justify-between shadow-2xs transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blinkit-green text-white flex items-center justify-center shrink-0 shadow-2xs">
                {reasoning.recommended_action === "show_replacement_guarantee" ? (
                  <RefreshCw className="w-3.5 h-3.5" />
                ) : reasoning.recommended_action === "jump_to_reviews" ? (
                  <Star className="w-3.5 h-3.5 fill-white" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-extrabold text-blinkit-black">
                    {reasoning.reassurance_headline}
                  </h3>
                  <span className="text-[8px] font-bold bg-white text-blinkit-green border border-blinkit-green/30 px-1.5 py-0.2 rounded-full uppercase">
                    72h Guarantee
                  </span>
                </div>
                <p className="text-[10px] text-neutral-700 leading-tight mt-0.5">
                  {reasoning.reassurance_body}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-blinkit-green shrink-0" />
          </div>
        ) : (
          /* Native Default Blinkit PDP Row (72 hours replacement baseline) */
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-500" />
              <span className="font-medium text-[11px]">72 hours replacement policy</span>
            </div>
          </div>
        )}

        <div className="pt-1 flex items-center justify-between text-xs text-blinkit-muted">
          <span className="text-[11px]">Seller: <strong className="text-blinkit-black">{product.seller_name}</strong></span>
          <button className="bg-blinkit-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-2xs">
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}
