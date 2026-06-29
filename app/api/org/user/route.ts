import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { orgId } = await req.json();

    if (!orgId) {
      return NextResponse.json({ error: "Missing orgId" }, { status: 400 });
    }

    const users = await prisma.teamMember.findMany({
      where: { orgId },
      include: { user: true },
    });

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error("Org users error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
