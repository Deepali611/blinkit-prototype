import { ProductEvidence } from "./data";
import { AIReasoningOutput } from "./reasoning";

export interface VerificationCheckResult {
  is_verified: boolean;
  final_decision: "APPROVED_FOR_DISPLAY" | "REJECTED_FAIL_CLOSED";
  path_b_safety_check_passed: boolean;
  grounding_check_passed: boolean;
  action_check_passed: boolean;
  failed_checks: string[];
  suppression_reason: string | null;
  verified_at: string;
}
