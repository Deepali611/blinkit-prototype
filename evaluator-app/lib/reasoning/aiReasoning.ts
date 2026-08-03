import { AIReasoningInput, AIReasoningOutput, RecommendedAction } from "../types/reasoning";
import { FailureType } from "../types/data";

export function generateFallbackReasoning(input: AIReasoningInput): AIReasoningOutput {
  const { customer, lapsed_order, product_evidence, path_type, negative_signal } = input;

  if (path_type === "PATH_A_KNOWN_SIGNAL") {
    const signalType = negative_signal?.signal_type;
    let failureType: FailureType = "quality_expiry";
    let action: RecommendedAction = "show_expiry_verification";
    let headline = "Freshness & Batch Quality Guaranteed";
    let body = `Your past order of ${lapsed_order.product_name} was flagged for quality concerns. All items in this category undergo strict thermal QC before dispatch.`;

    if (signalType === "support_ticket") {
      failureType = "unresolved_support";
      action = "show_replacement_guarantee";
      headline = "72-Hour Instant Replacement Protection";
      body = `We noticed an open support issue on your last ${lapsed_order.category_name} order. Enjoy instant 1-click replacement with zero waiting time on your re-order.`;
    } else if (negative_signal?.rating && negative_signal.rating <= 3) {
      failureType = "quality_expiry";
      action = "show_expiry_verification";
      headline = "QC-Verified Shelf Life Guarantee";
      body = `We hear your feedback on your previous rating. Every item in ${product_evidence.category_name} is dispatch-checked with ${product_evidence.expiry_verification_data.shelf_life_guarantee}.`;
    }

    return {
      path_type: "PATH_A_KNOWN_SIGNAL",
      target_failure_type: failureType,
      reasoning_chain: `Path A (Confirmed Signal): Identified confirmed ${signalType ?? "negative feedback"} on order ${lapsed_order.id}. Selected evidence [${action}] to directly resolve customer's past issue.`,
      selected_evidence_keys: ["expiry_verification_data", "replacement_guarantee", "seller_consistency_score"],
      reassurance_headline: headline,
      reassurance_body: body,
      recommended_action: action,
      path_b_safety_compliant: true,
      generated_by: "DETERMINISTIC_FALLBACK",
    };
  }

  let failureType: FailureType = "high_value_hesitation";
  let action: RecommendedAction = "highlight_seller";
  let headline = "Verified Top-Rated Category Sellers";
  let body = `Items in ${lapsed_order.category_name} are sourced directly from ${product_evidence.seller_name} with a ${product_evidence.seller_consistency_score}% quality consistency score.`;

  if (lapsed_order.price > 800) {
    failureType = "high_value_hesitation";
    action = "highlight_seller";
    headline = `Premium Selection by ${product_evidence.brand_name}`;
    body = `Trusted by over ${product_evidence.review_count.toLocaleString()} customers. ${product_evidence.aggregate_review_themes[0] ?? "100% authentic quality guaranteed"}.`;
  } else if (product_evidence.review_count > 500) {
    failureType = "lack_of_reviews";
    action = "jump_to_reviews";
    headline = `Rated ${product_evidence.average_rating}★ by ${product_evidence.review_count.toLocaleString()} Buyers`;
    body = `Top review highlight: "${product_evidence.aggregate_review_themes[0] ?? "Authentic quality"}" across verified repeat orders.`;
  } else {
    failureType = "quality_expiry";
    action = "show_expiry_verification";
    headline = "Guaranteed Freshness & Seal Verification";
    body = `Products in ${lapsed_order.category_name} are dispatched with verified shelf-life and tamper-proof packaging.`;
  }

  return {
    path_type: "PATH_B_INFERRED_SIGNAL",
    target_failure_type: failureType,
    reasoning_chain: `Path B (Inferred Signal): Customer ${customer.name} has no explicit complaint on record for order ${lapsed_order.id}. Inferred ${failureType} based on product price (₹${lapsed_order.price}) and aggregate review volume (${product_evidence.review_count}). Formulated evidence-forward reassurance without asserting personal incident history.`,
    selected_evidence_keys: ["seller_consistency_score", "aggregate_review_themes", "average_rating"],
    reassurance_headline: headline,
    reassurance_body: body,
    recommended_action: action,
    path_b_safety_compliant: true,
    generated_by: "DETERMINISTIC_FALLBACK",
  };
}

export async function performAIReasoning(input: AIReasoningInput): Promise<AIReasoningOutput> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return generateFallbackReasoning(input);
  }

  const systemPrompt = `
You are the AI Reasoning Engine for Blinkit's Mission Recovery system.
Your job is to perform Stage 2 reasoning for a Lapsed Category Expander customer.

Input Context:
- Customer: ${input.customer.name}
- Path Type: ${input.path_type}
- Lapsed Order: ${input.lapsed_order.product_name} (${input.lapsed_order.category_name}), Price: ₹${input.lapsed_order.price}, Purchased ${input.lapsed_order.days_ago} days ago.
- Negative Signal: ${JSON.stringify(input.negative_signal)}
- Available Product Evidence: ${JSON.stringify(input.product_evidence)}

CRITICAL SAFETY & PATH RULES:
1. PATH A (KNOWN SIGNAL): You may reference the specific confirmed past incident (e.g. return, rating, support ticket) to offer targeted reassurance.
2. PATH B (INFERRED SIGNAL - HARD SAFETY RULE): No explicit complaint exists on record. You MUST NOT claim or imply you know a specific problem happened to this customer (NEVER say "We know your last order arrived expired" or "We apologize for your bad experience"). Stay general, objective, and evidence-forward.
3. NO OPERATIONAL CHANGE CLAIMS: Do not imply a recent change to Blinkit’s operations or policies. Avoid phrasing like now undergo, now dispatch-checked, we’ve improved. State only present, verifiable facts about this specific product.

ALLOWED ACTIONS (Choose exactly one):
"highlight_seller" | "show_expiry_verification" | "show_replacement_guarantee" | "jump_to_reviews" | "focus_cta" | "no_action"

Return ONLY a valid JSON object matching this schema:
{
  "path_type": "${input.path_type}",
  "target_failure_type": "quality_expiry" | "lack_of_reviews" | "unresolved_support" | "high_value_hesitation",
  "reasoning_chain": "Step-by-step reasoning explaining why this failure type was chosen and why reassurance text was written this way.",
  "selected_evidence_keys": ["key1", "key2"],
  "reassurance_headline": "Short punchy headline (max 8 words)",
  "reassurance_body": "Reassurance message (1-2 sentences)",
  "recommended_action": "allowed_action_name",
  "path_b_safety_compliant": true
}
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Perform Stage 2 reasoning for customer ${input.customer.id}.` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      return generateFallbackReasoning(input);
    }

    const data = await response.json();
    const contentStr = data.choices?.[0]?.message?.content;
    if (!contentStr) {
      return generateFallbackReasoning(input);
    }

    const parsed = JSON.parse(contentStr) as AIReasoningOutput;
    return {
      ...parsed,
      generated_by: "GROQ_LLM",
    };
  } catch (error) {
    return generateFallbackReasoning(input);
  }
}
