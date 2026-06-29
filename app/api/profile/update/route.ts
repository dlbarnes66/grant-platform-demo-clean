import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId, profile } = await req.json();

    if (!userId || !profile) {
      return NextResponse.json(
        { error: "Missing userId or profile" },
        { status: 400 }
      );
    }

    await prisma.profile.upsert({
      where: { userId },
      update: profile,
      create: { userId, ...profile },
    });

    return NextResponse.json({ updated: true });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
