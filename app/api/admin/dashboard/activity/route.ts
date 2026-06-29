import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const activity = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ activity });
  } catch (err: any) {
    console.error("Admin activity error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
