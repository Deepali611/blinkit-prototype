import { NextRequest, NextResponse } from "next/server";
import { MOCK_LAPSED_CASES } from "@/lib/data/mockData";
import { getLapsedCaseById } from "@/lib/data/repository";
import { detectLapse } from "@/lib/detection/detectLapse";
import { performAIReasoning } from "@/lib/reasoning/aiReasoning";
import { evaluateConfidenceGate } from "@/lib/decision/confidenceGate";
import { verifyEvidence } from "@/lib/verification/verifyEvidence";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const caseId = body.caseId || "case-01";
    const caseData = getLapsedCaseById(caseId) || MOCK_LAPSED_CASES[0];

    const detectionResult = detectLapse(
      caseData.customer,
      [caseData.lapsed_order],
      14
    );

    const reasoningInput = {
      customer: caseData.customer,
      lapsed_order: caseData.lapsed_order,
      product_evidence: caseData.product_evidence,
      path_type: caseData.path_type,
      negative_signal: caseData.lapsed_order.negative_signal,
    };

    const reasoningOutput = await performAIReasoning(reasoningInput);
    const gateResult = evaluateConfidenceGate(caseData.product_evidence, reasoningOutput, 0.70);
    const verificationResult = verifyEvidence(reasoningOutput, caseData.product_evidence);

    return NextResponse.json({
      success: true,
      case_id: caseData.id,
      customer_name: caseData.customer.name,
      detection_result: detectionResult,
      reasoning_output: reasoningOutput,
      gate_result: gateResult,
      verification_result: verificationResult,
      is_holdout: caseData.customer.holdout_group,
      final_should_render:
        verificationResult.is_verified &&
        gateResult.passed_gate &&
        !caseData.customer.holdout_group,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Error" },
      { status: 500 }
    );
  }
}
