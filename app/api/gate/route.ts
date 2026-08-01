import { NextRequest, NextResponse } from "next/server";
import { getLapsedCaseById, getCustomerById, getOrdersByCustomerId, getProductEvidence } from "@/lib/data/repository";
import { detectLapse } from "@/lib/detection/detectLapse";
import { performAIReasoning } from "@/lib/reasoning/aiReasoning";
import { evaluateConfidenceGate } from "@/lib/decision/confidenceGate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { caseId, customerId, minThreshold = 0.70 } = body;

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
          passed_gate: false,
          reason: detectionResult.reason,
          detection_result: detectionResult,
        },
        { status: 200 }
      );
    }

    const evidence = getProductEvidence(detectionResult.product_id);
    const lapsedOrder = orders.find((o) => o.id === detectionResult.lapsed_order_id);

    if (!evidence || !lapsedOrder) {
      return NextResponse.json({ error: "Product evidence or lapsed order missing" }, { status: 404 });
    }

    const reasoningOutput = await performAIReasoning({
      customer,
      lapsed_order: lapsedOrder,
      product_evidence: evidence,
      path_type: detectionResult.path_type || "PATH_B_INFERRED_SIGNAL",
      negative_signal: detectionResult.negative_signal,
    });

    const gateResult = evaluateConfidenceGate(evidence, reasoningOutput, Number(minThreshold));

    return NextResponse.json({
      success: true,
      detection_result: detectionResult,
      gate_result: gateResult,
    });
  } catch (err: any) {
    console.error("API /api/gate error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
