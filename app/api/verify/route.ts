import { NextRequest, NextResponse } from "next/server";
import { getLapsedCaseById, getCustomerById, getOrdersByCustomerId, getProductEvidence } from "@/lib/data/repository";
import { detectLapse } from "@/lib/detection/detectLapse";
import { performAIReasoning } from "@/lib/reasoning/aiReasoning";
import { evaluateConfidenceGate } from "@/lib/decision/confidenceGate";
import { verifyEvidence } from "@/lib/verification/verifyEvidence";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { caseId, customerId } = body;

    let targetCase = caseId ? getLapsedCaseById(caseId) : undefined;
    let customer = targetCase ? targetCase.customer : (customerId ? getCustomerById(customerId) : undefined);

    if (!customer) {
      targetCase = getLapsedCaseById("case-01");
      customer = targetCase?.customer;
    }

    if (!customer) {
      return NextResponse.json({ error: "Customer or case not found" }, { status: 404 });
    }

    const orders = getOrdersByCustomerId(customer.id);
    const detectionResult = detectLapse(customer, orders);

    if (!detectionResult.is_eligible || !detectionResult.product_id) {
      return NextResponse.json(
        {
          is_verified: false,
          final_decision: "REJECTED_FAIL_CLOSED",
          reason: detectionResult.reason,
          detection_result: detectionResult,
        },
        { status: 200 }
      );
    }

    const evidence = getProductEvidence(detectionResult.product_id);
    const lapsedOrder = orders.find((o) => o.id === detectionResult.lapsed_order_id);

    if (!evidence || !lapsedOrder) {
      return NextResponse.json({ error: "Evidence or order missing" }, { status: 404 });
    }

    const reasoningOutput = await performAIReasoning({
      customer,
      lapsed_order: lapsedOrder,
      product_evidence: evidence,
      path_type: detectionResult.path_type || "PATH_B_INFERRED_SIGNAL",
      negative_signal: detectionResult.negative_signal,
    });

    const gateResult = evaluateConfidenceGate(evidence, reasoningOutput);

    if (!gateResult.passed_gate) {
      return NextResponse.json({
        success: true,
        detection_result: detectionResult,
        gate_result: gateResult,
        verification_result: {
          is_verified: false,
          final_decision: "REJECTED_FAIL_CLOSED",
          suppression_reason: `Gated at Stage 3: ${gateResult.suppression_reason}`,
        },
      });
    }

    const verificationResult = verifyEvidence(reasoningOutput, evidence);

    return NextResponse.json({
      success: true,
      detection_result: detectionResult,
      gate_result: gateResult,
      verification_result: verificationResult,
    });
  } catch (err: any) {
    console.error("API /api/verify error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
