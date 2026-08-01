import { ProductEvidence } from "../types/data";
import { AIReasoningOutput, RecommendedAction } from "../types/reasoning";
import { VerificationCheckResult } from "../types/verification";

const ALLOWED_ACTIONS: RecommendedAction[] = [
  "highlight_seller",
  "show_expiry_verification",
  "show_replacement_guarantee",
  "jump_to_reviews",
  "focus_cta",
  "no_action",
];

// Forbidden personal incident phrases for Path B (Inferred Signal)
const PATH_B_FORBIDDEN_PHRASES = [
  "we know your",
  "your previous order",
  "your last order",
  "your past order",
  "your last item",
  "you reported",
  "you returned",
  "your complaint",
  "your issue",
  "sorry about your",
  "apologize for your",
  "we noticed your order was",
  "we noticed you had",
  "since your order was",
  "because your item",
];

/**
 * Stage 4 — Verification Engine & Anti-Hallucination Guard
 * Fails closed if any claim is ungrounded or if Path B safety rule is violated.
 */
export function verifyEvidence(
  reasoningOutput: AIReasoningOutput,
  evidence: ProductEvidence
): VerificationCheckResult {
  const failed_checks: string[] = [];

  // Check 1: Allowed Action Check
  const action_check_passed = ALLOWED_ACTIONS.includes(reasoningOutput.recommended_action);
  if (!action_check_passed) {
    failed_checks.push(`Invalid action: '${reasoningOutput.recommended_action}' is not in the allowed action registry.`);
  }

  // Check 2: Path B Hard Safety Rule (Anti-Hallucination Check)
  let path_b_safety_check_passed = true;
  if (reasoningOutput.path_type === "PATH_B_INFERRED_SIGNAL") {
    const combinedText = `${reasoningOutput.reassurance_headline} ${reasoningOutput.reassurance_body}`.toLowerCase();
    
    for (const phrase of PATH_B_FORBIDDEN_PHRASES) {
      if (combinedText.includes(phrase)) {
        path_b_safety_check_passed = false;
        failed_checks.push(
          `Path B Safety Violation: Generated message asserts unconfirmed personal incident using forbidden phrase '${phrase}'.`
        );
        break;
      }
    }
  }

  // Check 3: Grounding Verification Check
  let grounding_check_passed = true;
  const combinedText = `${reasoningOutput.reassurance_headline} ${reasoningOutput.reassurance_body}`;

  // Check numeric percentage claims if present in text (e.g. 98% or 99%)
  const percentageMatches = combinedText.match(/(\d+)%/g);
  if (percentageMatches) {
    for (const match of percentageMatches) {
      const val = parseInt(match.replace("%", ""), 10);
      const sellerScoreRounded = Math.round(evidence.seller_consistency_score);
      const reorderRateRounded = Math.round(evidence.reorder_rate * 100);

      // Check if claimed percentage matches either seller consistency score or reorder rate (within +/- 3%)
      const matchesSeller = Math.abs(val - sellerScoreRounded) <= 3;
      const matchesReorder = Math.abs(val - reorderRateRounded) <= 3;
      const matches100 = val === 100; // General promotional 100% claim allowed

      if (!matchesSeller && !matchesReorder && !matches100) {
        grounding_check_passed = false;
        failed_checks.push(
          `Grounding Check Failed: Claimed percentage '${match}' in reassurance text is not grounded in product evidence.`
        );
      }
    }
  }

  // Final Decision (Fails Closed)
  const is_verified = action_check_passed && path_b_safety_check_passed && grounding_check_passed;
  const final_decision = is_verified ? "APPROVED_FOR_DISPLAY" : "REJECTED_FAIL_CLOSED";
  const suppression_reason = is_verified ? null : failed_checks.join(" | ");

  return {
    is_verified,
    final_decision,
    path_b_safety_check_passed,
    grounding_check_passed,
    action_check_passed,
    failed_checks,
    suppression_reason,
    verified_at: new Date().toISOString(),
  };
}
