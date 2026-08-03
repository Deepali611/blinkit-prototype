export interface ExperimentLogEntry {
  id: string;
  timestamp: string;
  session_id: string;
  customer_id: string;
  customer_name: string;
  category_id: string;
  category_name: string;
  product_name: string;
  path_type: "PATH_A_KNOWN_SIGNAL" | "PATH_B_INFERRED_SIGNAL";
  stage1_lapse_detected: boolean;
  stage2_action_recommended: string;
  stage3_confidence_score: number;
  stage3_passed_gate: boolean;
  stage4_verified: boolean;
  is_holdout_control: boolean;
  intervention_rendered: boolean;
  converted_repeat_order: boolean;
  days_to_repeat_purchase: number | null;
}

export interface RCCRMetricsSummary {
  treatment_total: number;
  treatment_conversions: number;
  treatment_rccr: number;
  control_total: number;
  control_conversions: number;
  control_rccr: number;
  rccr_absolute_uplift: number;
  rccr_relative_lift: number;
  path_a_rccr: number;
  path_b_rccr: number;
  total_logs: number;
  gate_pass_rate: number;
  verification_pass_rate: number;
  last_updated: string;
}
