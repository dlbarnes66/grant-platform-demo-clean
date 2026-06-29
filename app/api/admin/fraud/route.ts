import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const suspicious = await prisma.user.findMany({
      where: {
        OR: [
          { loginAttempts: { gt: 20 } },
          { failedPayments: { gt: 3 } },
          { activityScore: { lt: 10 } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ suspicious });
  } catch (err: any) {
    console.error("Fraud detection error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
