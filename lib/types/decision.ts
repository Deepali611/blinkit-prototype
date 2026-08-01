import { ProductEvidence } from "./data";
import { AIReasoningOutput } from "./reasoning";

export interface ConfidenceBreakdown {
  seller_consistency_contribution: number; // Max 0.25
  reorder_rate_contribution: number;        // Max 0.25
  qc_expiry_contribution: number;           // Max 0.20
  review_trust_contribution: number;          // Max 0.15
  replacement_guarantee_contribution: number; // Max 0.15
}

export interface ConfidenceGateResult {
  confidence_score: number; // 0.00 to 1.00
  confidence_level: "HIGH" | "MEDIUM" | "LOW";
  passed_gate: boolean;
  min_threshold_required: number; // 0.70
  decision: "PROCEED_TO_STAGE_4_VERIFICATION" | "SUPPRESS_INTERVENTION_SHOW_BASELINE";
  breakdown: ConfidenceBreakdown;
  suppression_reason: string | null;
  reasoning_output: AIReasoningOutput;
  evaluated_at: string;
}
