import { ProductEvidence } from "../types/data";
import { AIReasoningOutput } from "../types/reasoning";
import { ConfidenceGateResult, ConfidenceBreakdown } from "../types/decision";

/**
 * Stage 3 — Deterministic Confidence Gate
 * Computes confidence purely from numeric evidence metrics (never LLM self-assessment).
 * 
 * Weights:
 * - Seller Consistency Score: 25%
 * - Category Reorder Rate: 25%
 * - QC Expiry Verification: 20%
 * - Review Trust Factor (Volume & Rating): 15%
 * - 72-Hour Instant Guarantee: 15%
 */
export function evaluateConfidenceGate(
  evidence: ProductEvidence,
  reasoningOutput: AIReasoningOutput,
  minThreshold: number = 0.70
): ConfidenceGateResult {
  // 1. Seller Consistency Contribution (Max 0.25)
  const sellerScoreNormalized = Math.min(Math.max(evidence.seller_consistency_score / 100, 0), 1);
  const seller_consistency_contribution = Number((sellerScoreNormalized * 0.25).toFixed(4));

  // 2. Reorder Rate Contribution (Max 0.25)
  const reorderRateNormalized = Math.min(Math.max(evidence.reorder_rate, 0), 1);
  const reorder_rate_contribution = Number((reorderRateNormalized * 0.25).toFixed(4));

  // 3. QC Expiry Contribution (Max 0.20)
  const isQcVerified = evidence.expiry_verification_data.verified_batch;
  const qc_expiry_contribution = isQcVerified ? 0.20 : 0.05;

  // 4. Review Trust Contribution (Max 0.15)
  const volumeFactor = Math.min(evidence.review_count / 1000, 1.0);
  const ratingFactor = Math.min(evidence.average_rating / 5.0, 1.0);
  const review_trust_contribution = Number((volumeFactor * ratingFactor * 0.15).toFixed(4));

  // 5. Replacement Guarantee Contribution (Max 0.15)
  const isInstantRefund = evidence.replacement_guarantee.instant_refund_eligible;
  const replacement_guarantee_contribution = isInstantRefund ? 0.15 : 0.08;

  // Sum total confidence score
  const totalScore = Number(
    (
      seller_consistency_contribution +
      reorder_rate_contribution +
      qc_expiry_contribution +
      review_trust_contribution +
      replacement_guarantee_contribution
    ).toFixed(4)
  );

  const confidence_level: "HIGH" | "MEDIUM" | "LOW" =
    totalScore >= 0.85 ? "HIGH" : totalScore >= 0.70 ? "MEDIUM" : "LOW";

  const passed_gate = totalScore >= minThreshold;

  const breakdown: ConfidenceBreakdown = {
    seller_consistency_contribution,
    reorder_rate_contribution,
    qc_expiry_contribution,
    review_trust_contribution,
    replacement_guarantee_contribution,
  };

  return {
    confidence_score: totalScore,
    confidence_level,
    passed_gate,
    min_threshold_required: minThreshold,
    decision: passed_gate
      ? "PROCEED_TO_STAGE_4_VERIFICATION"
      : "SUPPRESS_INTERVENTION_SHOW_BASELINE",
    breakdown,
    suppression_reason: passed_gate
      ? null
      : `Deterministic confidence score (${(totalScore * 100).toFixed(1)}%) failed minimum required threshold of ${(minThreshold * 100).toFixed(1)}%.`,
    reasoning_output: reasoningOutput,
    evaluated_at: new Date().toISOString(),
  };
}
