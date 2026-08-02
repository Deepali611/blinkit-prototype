"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, RefreshCw, Star, Award, CheckCircle2, ShoppingBag } from "lucide-react";
import { MOCK_LAPSED_CASES } from "@/lib/data/mockData";
import { LapsedCategoryCase } from "@/lib/types/data";
import { VerificationCheckResult } from "@/lib/types/verification";
import { ConfidenceGateResult } from "@/lib/types/decision";
import { AIReasoningOutput } from "@/lib/types/reasoning";

interface OrderAgainInterventionProps {
  caseId?: string;
  showCaseSelector?: boolean; // Default false for customer views
}

export default function OrderAgainIntervention({
  caseId = "case-01",
  showCaseSelector = false,
}: OrderAgainInterventionProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(caseId);
  const [loading, setLoading] = useState<boolean>(false);
  const [pipelineData, setPipelineData] = useState<{
    caseData: LapsedCategoryCase;
    gateResult?: ConfidenceGateResult;
    verificationResult?: VerificationCheckResult;
    reasoningOutput?: AIReasoningOutput;
  } | null>(null);

  const activeCase = MOCK_LAPSED_CASES.find((c) => c.id === selectedCaseId) || MOCK_LAPSED_CASES[0];

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

  // Determine if intervention should be displayed
  const isHoldout = activeCase.customer.holdout_group;
  const isApproved = verifyResult?.is_verified && gateResult?.passed_gate && !isHoldout;

  return (
    <div className="space-y-3">
      {/* Optional Debug Selector only when explicitly requested (e.g., in Evaluator) */}
      {showCaseSelector && (
        <div className="bg-white p-3 rounded-xl border border-blinkit-border shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-blinkit-black uppercase tracking-wider block">
            Debug Case Selector (Evaluator Mode Only)
          </span>
          <div className="grid grid-cols-5 gap-1">
            {MOCK_LAPSED_CASES.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`py-1 rounded text-[10px] font-bold border text-center ${
                  selectedCaseId === c.id
                    ? "bg-blinkit-yellow/20 border-blinkit-yellow text-blinkit-black"
                    : "bg-neutral-50 text-neutral-600"
                }`}
              >
                Case {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Primary Native Blinkit Order Again Card */}
      <div className="bg-white rounded-2xl border border-blinkit-border shadow-xs overflow-hidden transition-all">
        {/* Clean Customer Card Header */}
        <div className="bg-neutral-50/80 border-b border-blinkit-border px-3.5 py-2 flex items-center justify-between text-[11px]">
          <span className="text-blinkit-muted font-medium">
            Ordered {order.days_ago} days ago
          </span>
          <span className="text-blinkit-muted font-medium text-[10px]">
            {order.category_name}
          </span>
        </div>

        {/* Product Details Section */}
        <div className="p-3.5 flex items-center gap-3">
          {/* Product Thumbnail */}
          <div className="w-14 h-14 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 relative flex items-center justify-center">
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

          {/* Title & Price */}
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-bold uppercase text-blinkit-muted tracking-wider block">
              {product.brand_name}
            </span>
            <h2 className="text-xs font-bold text-blinkit-black truncate leading-snug">
              {order.product_name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-extrabold text-blinkit-black">
                ₹{order.price}
              </span>
            </div>
          </div>

          {/* Order Again Button */}
          <button className="bg-blinkit-green hover:bg-blinkit-green-dark text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-transform active:scale-95 shrink-0 flex items-center gap-1">
            <span>ADD</span>
          </button>
        </div>

        {/* Reassurance Row — Displayed cleanly when pipeline approves without debug text */}
        {loading ? (
          <div className="bg-neutral-50 p-2.5 border-t border-blinkit-border flex items-center justify-center gap-2 text-[11px] text-blinkit-muted">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blinkit-green" />
            <span>Loading...</span>
          </div>
        ) : isApproved && reasoning ? (
          <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border-t border-blinkit-green/20 p-3 space-y-1.5">
            <div className="flex items-start gap-2">
              <div className="p-0.5 rounded-full bg-blinkit-green text-white shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-extrabold text-blinkit-black leading-tight">
                  {reasoning.reassurance_headline}
                </h3>
                <p className="text-[11px] text-neutral-700 mt-0.5 leading-snug">
                  {reasoning.reassurance_body}
                </p>
              </div>
            </div>

            {/* Factual Guarantee Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-blinkit-green/10 text-[10px]">
              {reasoning.recommended_action === "show_expiry_verification" && (
                <span className="bg-white border border-blinkit-green/30 text-blinkit-green font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <ShieldCheck className="w-3 h-3" />
                  {product.expiry_verification_data.shelf_life_guarantee}
                </span>
              )}

              {reasoning.recommended_action === "show_replacement_guarantee" && (
                <span className="bg-white border border-blinkit-green/30 text-blinkit-green font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <RefreshCw className="w-3 h-3" />
                  {product.replacement_guarantee.policy_text}
                </span>
              )}

              {reasoning.recommended_action === "highlight_seller" && (
                <span className="bg-white border border-blinkit-green/30 text-blinkit-green font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <Award className="w-3 h-3 text-amber-500" />
                  Seller: {product.seller_name}
                </span>
              )}

              {reasoning.recommended_action === "jump_to_reviews" && (
                <span className="bg-white border border-blinkit-green/30 text-blinkit-green font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  Rated {product.average_rating}★ ({product.review_count} Reviews)
                </span>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
