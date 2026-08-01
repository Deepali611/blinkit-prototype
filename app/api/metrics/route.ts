import { NextResponse } from "next/server";
import { computeRCCRMetrics, getAllLogs } from "@/lib/metrics/rccrPipeline";

export async function GET() {
  try {
    const summary = computeRCCRMetrics();
    const logs = getAllLogs();

    return NextResponse.json({
      success: true,
      summary,
      recent_logs: logs.slice(0, 20),
    });
  } catch (err: any) {
    console.error("API /api/metrics error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
