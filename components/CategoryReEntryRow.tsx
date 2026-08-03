"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { MOCK_LAPSED_CASES } from "@/lib/data/mockData";
import { LapsedCategoryCase } from "@/lib/types/data";
import { VerificationCheckResult } from "@/lib/types/verification";
import { ConfidenceGateResult } from "@/lib/types/decision";
import { AIReasoningOutput } from "@/lib/types/reasoning";

interface CategoryReEntryRowProps {
  caseId?: string;
  showCaseSelector?: boolean;
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
  const order = activeCase.lapsed_order;

  const isHoldout = activeCase.customer.holdout_group;
  const isApproved = verifyResult?.is_verified && gateResult?.passed_gate && !isHoldout;

  return (
    <div className="space-y-3">
      {/* Optional Debug Selector only when explicitly requested (Evaluator Mode) */}
      {showCaseSelector && (
        <div className="bg-white p-2.5 rounded-xl border border-blinkit-border shadow-xs space-y-1.5">
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

      {/* Campaign-Strip Horizontal Section Container */}
      <div className="bg-gradient-to-br from-emerald-50/90 via-green-50/50 to-amber-50/40 rounded-2xl border border-blinkit-green/20 p-3.5 space-y-3 shadow-xs">
        
        {/* Campaign Header & Category Tab/Chip Row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blinkit-green bg-white border border-blinkit-green/30 px-2.5 py-0.5 rounded-full shadow-2xs">
              Verified Category Spotlight
            </span>
            <span className="text-[10px] text-blinkit-muted font-medium">
              10-Minute Delivery
            </span>
          </div>

          {/* Interactive Category Chips Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {MOCK_LAPSED_CASES.map((c) => {
              const isSelected = c.id === selectedCaseId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all ${
                    isSelected
                      ? "bg-blinkit-green text-white border-blinkit-green shadow-2xs"
                      : "bg-white text-neutral-700 border-neutral-200 hover:border-blinkit-green/40"
                  }`}
                >
                  {c.product_evidence.category_name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Tile Container (Blinkit Promotional Tile Pattern) */}
        <div className="bg-white rounded-xl border border-neutral-200/80 p-3 shadow-xs space-y-2.5 transition-all">
          <div className="flex items-start gap-3">
            {/* Product Image */}
            <div className="w-16 h-16 rounded-lg bg-neutral-50 border border-neutral-150 overflow-hidden shrink-0 relative flex items-center justify-center">
              {order.product_image ? (
                <img
                  src={order.product_image}
                  alt={order.product_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ShoppingBag className="w-6 h-6 text-neutral-400" />
              )}
            </div>

            {/* Product Metadata & Price */}
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-bold uppercase text-blinkit-muted tracking-wider block">
                {product.brand_name}
              </span>
              <h3 className="text-xs font-bold text-blinkit-black truncate leading-snug">
                {order.product_name}
              </h3>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-sm font-extrabold text-blinkit-black">
                  ₹{order.price}
                </span>
                <button className="bg-white border-2 border-blinkit-green text-blinkit-green hover:bg-blinkit-green hover:text-white font-extrabold text-xs px-3 py-1 rounded-lg transition-colors shadow-2xs">
                  + ADD
                </button>
              </div>
            </div>
          </div>

          {/* Reassurance Line — Short trust line directly beneath product tile */}
          {loading ? (
            <div className="pt-2 border-t border-neutral-100 text-[10px] text-neutral-400 italic">
              Loading details...
            </div>
          ) : isApproved && reasoning ? (
            <div className="pt-2 border-t border-emerald-100 flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blinkit-green shrink-0" />
              <span className="font-semibold text-blinkit-black">
                {reasoning.reassurance_headline}:
              </span>
              <span className="truncate text-neutral-700">
                {reasoning.reassurance_body}
              </span>
            </div>
          ) : (
            <div className="pt-2 border-t border-neutral-100 flex items-center gap-1.5 text-[10px] text-neutral-500">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
              <span>Standard 72 hours replacement guarantee applicable</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
