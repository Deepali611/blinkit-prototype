import { ProductEvidence } from "./data";
import { AIReasoningOutput } from "./reasoning";

export interface ConfidenceBreakdown {
  seller_consistency_contribution: number;
  reorder_rate_contribution: number;
  qc_expiry_contribution: number;
  review_trust_contribution: number;
  replacement_guarantee_contribution: number;
}

export interface ConfidenceGateResult {
  confidence_score: number;
  confidence_level: "HIGH" | "MEDIUM" | "LOW";
  passed_gate: boolean;
  min_threshold_required: number;
  decision: "PROCEED_TO_STAGE_4_VERIFICATION" | "SUPPRESS_INTERVENTION_SHOW_BASELINE";
  breakdown: ConfidenceBreakdown;
  suppression_reason: string | null;
  reasoning_output: AIReasoningOutput;
  evaluated_at: string;
}
