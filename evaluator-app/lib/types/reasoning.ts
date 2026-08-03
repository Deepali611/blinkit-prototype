import { FailureType, Customer, Order, ProductEvidence, NegativeSignal } from "./data";

export type RecommendedAction =
  | "highlight_seller"
  | "show_expiry_verification"
  | "show_replacement_guarantee"
  | "jump_to_reviews"
  | "focus_cta"
  | "no_action";

export interface AIReasoningInput {
  customer: Customer;
  lapsed_order: Order;
  product_evidence: ProductEvidence;
  path_type: "PATH_A_KNOWN_SIGNAL" | "PATH_B_INFERRED_SIGNAL";
  negative_signal?: NegativeSignal | null;
}

export interface AIReasoningOutput {
  path_type: "PATH_A_KNOWN_SIGNAL" | "PATH_B_INFERRED_SIGNAL";
  target_failure_type: FailureType;
  reasoning_chain: string;
  selected_evidence_keys: string[];
  reassurance_headline: string;
  reassurance_body: string;
  recommended_action: RecommendedAction;
  path_b_safety_compliant: boolean;
  generated_by: "GROQ_LLM" | "DETERMINISTIC_FALLBACK";
}
