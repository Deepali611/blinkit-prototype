import { NextRequest, NextResponse } from "next/server";
import { logOutcome } from "@/lib/metrics/rccrPipeline";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newEntry = logOutcome(body);

    return NextResponse.json({
      success: true,
      logged_entry: newEntry,
    });
  } catch (err: any) {
    console.error("API /api/log error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
