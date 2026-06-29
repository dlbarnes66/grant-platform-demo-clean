import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { orgId, email, role } = await req.json();

    if (!orgId || !email || !role) {
      return NextResponse.json(
        { error: "Missing orgId, email, or role" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    await prisma.teamMember.create({
      data: {
        orgId,
        userId: user.id,
        role,
      },
    });

    return NextResponse.json({ added: true });
  } catch (err: any) {
    console.error("Team add error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
