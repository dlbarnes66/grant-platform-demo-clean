import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    return NextResponse.json({ profile });
  } catch (err: any) {
    console.error("Profile get error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
