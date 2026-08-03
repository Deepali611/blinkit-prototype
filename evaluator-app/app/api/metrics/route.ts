import { NextResponse } from "next/server";
import { computeRCCRMetrics, getRecentLogs } from "@/lib/metrics/rccrPipeline";

export async function GET() {
  const summary = computeRCCRMetrics();
  const logs = getRecentLogs(20);

  return NextResponse.json({
    success: true,
    summary,
    recent_logs: logs,
  });
}
