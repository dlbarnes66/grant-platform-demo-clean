import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { orgId, type, config } = await req.json();

    if (!orgId || !type || !config) {
      return NextResponse.json(
        { error: "Missing orgId, type, or config" },
        { status: 400 }
      );
    }

    const entry = await prisma.ssoConfig.upsert({
      where: { orgId },
      update: { type, config },
      create: { orgId, type, config },
    });

    return NextResponse.json({ saved: true, entry });
  } catch (err: any) {
    console.error("SSO config error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
