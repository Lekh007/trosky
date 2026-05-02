import { NextRequest, NextResponse } from "next/server";
import { getOverviewData } from "@/services/dashboard-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const rawRange = parseInt(
      _request.nextUrl.searchParams.get("range") || "14"
    );
    const range = Math.min(Math.max(isNaN(rawRange) ? 14 : rawRange, 1), 365);
    const data = await getOverviewData(params.hotelId, range);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
