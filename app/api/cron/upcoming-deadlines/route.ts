import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();
    const soon = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); // 3 days

    const grants = await prisma.grant.findMany({
      where: {
        deadline: {
          gte: now,
          lte: soon,
        },
      },
    });

    for (const grant of grants) {
      await prisma.notification.create({
        data: {
          userId: grant.userId,
          message: `Deadline approaching for ${grant.title}`,
        },
      });
    }

    return NextResponse.json({ processed: grants.length });
  } catch (err: any) {
    console.error("Cron error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
