import { ExperimentLogEntry, RCCRMetricsSummary } from "../types/metrics";

// In-memory store for experiment logs seeded with realistic trial-to-repeat data
const EXPERIMENT_LOGS: ExperimentLogEntry[] = [
  // Seeded Treatment Group Logs (Exposed to Mission Recovery Interventions)
  ...Array.from({ length: 60 }).map((_, i) => {
    const isPathA = i % 3 === 0;
    const isConverted = i < 17; // 17 conversions out of 60 = 28.33% RCCR
    const passedGate = i < 54;
    const verified = passedGate && i !== 12; // 1 failed verification

    return {
      id: `log-tr-${1000 + i}`,
      timestamp: new Date(Date.now() - (60 - i) * 3600 * 1000).toISOString(),
      session_id: `sess-tr-${2000 + i}`,
      customer_id: `cust-${101 + (i % 4)}`,
      customer_name: ["Aarav Sharma", "Priya Patel", "Rohan Verma", "Ananya Iyer"][i % 4],
      category_id: ["cat-gourmet", "cat-gourmet-oils", "cat-specialty-teas", "cat-beauty"][i % 4],
      category_name: ["Gourmet & World Food", "Gourmet Oils & Spices", "Specialty Teas & Coffee", "Beauty & Cosmetics"][i % 4],
      product_name: ["Artisan Aged Cheddar", "Extra Virgin Olive Oil", "Ceremonial Matcha", "Vitamin C Serum"][i % 4],
      path_type: (isPathA ? "PATH_A_KNOWN_SIGNAL" : "PATH_B_INFERRED_SIGNAL") as any,
      stage1_lapse_detected: true,
      stage2_action_recommended: ["show_expiry_verification", "highlight_seller", "jump_to_reviews", "show_replacement_guarantee"][i % 4],
      stage3_confidence_score: Number((0.72 + (i % 25) * 0.01).toFixed(2)),
      stage3_passed_gate: passedGate,
      stage4_verified: verified,
      is_holdout_control: false,
      intervention_rendered: verified,
      converted_repeat_order: isConverted,
      days_to_repeat_purchase: isConverted ? Math.floor(2 + (i % 7)) : null,
    };
  }),

  // Seeded Control Group Logs (Holdout Group - Standard Baseline Experience)
  ...Array.from({ length: 40 }).map((_, i) => {
    const isPathA = i % 3 === 0;
    const isConverted = i < 5; // 5 conversions out of 40 = 12.50% RCCR

    return {
      id: `log-ctrl-${3000 + i}`,
      timestamp: new Date(Date.now() - (40 - i) * 3600 * 1000).toISOString(),
      session_id: `sess-ctrl-${4000 + i}`,
      customer_id: `cust-105`,
      customer_name: `Vikram Malhotra (Control Holdout #${i + 1})`,
      category_id: "cat-gourmet",
      category_name: "Gourmet & World Food",
      product_name: "Artisan Aged Cheddar",
      path_type: (isPathA ? "PATH_A_KNOWN_SIGNAL" : "PATH_B_INFERRED_SIGNAL") as any,
      stage1_lapse_detected: true,
      stage2_action_recommended: "no_action",
      stage3_confidence_score: 0.85,
      stage3_passed_gate: true,
      stage4_verified: true,
      is_holdout_control: true,
      intervention_rendered: false, // Suppressed for control group
      converted_repeat_order: isConverted,
      days_to_repeat_purchase: isConverted ? Math.floor(4 + (i % 9)) : null,
    };
  }),
];

/**
 * Stage 6 — Log Intervention Outcome
 */
export function logOutcome(
  entryData: Omit<ExperimentLogEntry, "id" | "timestamp">
): ExperimentLogEntry {
  const newEntry: ExperimentLogEntry = {
    ...entryData,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };
  EXPERIMENT_LOGS.unshift(newEntry);
  return newEntry;
}

export function getAllLogs(): ExperimentLogEntry[] {
  return EXPERIMENT_LOGS;
}

export function getRecentLogs(limit: number = 20): ExperimentLogEntry[] {
  return EXPERIMENT_LOGS.slice(0, limit);
}

/**
 * Compute Repeat-Category Conversion Rate (RCCR) and Uplift Metrics
 */
export function computeRCCRMetrics(logsInput?: ExperimentLogEntry[]): RCCRMetricsSummary {
  const logs = logsInput || EXPERIMENT_LOGS;

  const treatmentLogs = logs.filter((l) => !l.is_holdout_control);
  const controlLogs = logs.filter((l) => l.is_holdout_control);

  const treatmentTotal = treatmentLogs.length;
  const treatmentConversions = treatmentLogs.filter((l) => l.converted_repeat_order).length;
  const treatmentRCCR = treatmentTotal > 0 ? (treatmentConversions / treatmentTotal) * 100 : 0;

  const controlTotal = controlLogs.length;
  const controlConversions = controlLogs.filter((l) => l.converted_repeat_order).length;
  const controlRCCR = controlTotal > 0 ? (controlConversions / controlTotal) * 100 : 0;

  const absoluteUplift = treatmentRCCR - controlRCCR;
  const relativeLift = controlRCCR > 0 ? (absoluteUplift / controlRCCR) * 100 : 0;

  // Path specific RCCRs in Treatment
  const pathALogs = treatmentLogs.filter((l) => l.path_type === "PATH_A_KNOWN_SIGNAL");
  const pathAConversions = pathALogs.filter((l) => l.converted_repeat_order).length;
  const pathARCCR = pathALogs.length > 0 ? (pathAConversions / pathALogs.length) * 100 : 0;

  const pathBLogs = treatmentLogs.filter((l) => l.path_type === "PATH_B_INFERRED_SIGNAL");
  const pathBConversions = pathBLogs.filter((l) => l.converted_repeat_order).length;
  const pathBRCCR = pathBLogs.length > 0 ? (pathBConversions / pathBLogs.length) * 100 : 0;

  // Safety Pass Rates
  const gatePassCount = logs.filter((l) => l.stage3_passed_gate).length;
  const gatePassRate = logs.length > 0 ? (gatePassCount / logs.length) * 100 : 0;

  const verifyPassCount = logs.filter((l) => l.stage4_verified).length;
  const verifyPassRate = logs.length > 0 ? (verifyPassCount / logs.length) * 100 : 0;

  return {
    treatment_total: treatmentTotal,
    treatment_conversions: treatmentConversions,
    treatment_rccr: Number(treatmentRCCR.toFixed(2)),
    control_total: controlTotal,
    control_conversions: controlConversions,
    control_rccr: Number(controlRCCR.toFixed(2)),
    rccr_absolute_uplift: Number(absoluteUplift.toFixed(2)),
    rccr_relative_lift: Number(relativeLift.toFixed(2)),
    path_a_rccr: Number(pathARCCR.toFixed(2)),
    path_b_rccr: Number(pathBRCCR.toFixed(2)),
    total_logs: logs.length,
    gate_pass_rate: Number(gatePassRate.toFixed(2)),
    verification_pass_rate: Number(verifyPassRate.toFixed(2)),
    last_updated: new Date().toISOString(),
  };
}
