import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { orgId, userId } = await req.json();

    if (!orgId || !userId) {
      return NextResponse.json(
        { error: "Missing orgId or userId" },
        { status: 400 }
      );
    }

    await prisma.teamMember.deleteMany({
      where: { orgId, userId },
    });

    return NextResponse.json({ removed: true });
  } catch (err: any) {
    console.error("Team remove error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
