import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import Redis from "ioredis";
import { Queue } from "bullmq";

export async function POST(
  _request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "ANALYST") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { hotelId } = params;
  const { prisma } = await import("@hotel-pricing/db");
  const hotel = await prisma.hotel.findUnique({ where: { id: hotelId }, select: { id: true } });
  if (!hotel) {
    return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return NextResponse.json(
      {
        error:
          "Refresh is not configured. Set REDIS_URL in Vercel and run the worker elsewhere (e.g. Railway, Render).",
      },
      { status: 503 }
    );
  }

  try {
    const connection = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
    });
    const queue = new Queue("scrape-queue", { connection });

    const job = await queue.add("hotel-refresh", {
      hotelId: params.hotelId,
      trigger: "manual",
      triggeredBy: session.email,
    });

    await connection.quit();

    return NextResponse.json({
      jobId: job.id,
      message: "Refresh job queued for hotel",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to queue refresh";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
