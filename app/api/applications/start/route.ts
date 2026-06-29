import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId, grantId } = await req.json();

    if (!userId || !grantId) {
      return NextResponse.json(
        { error: "Missing userId or grantId" },
        { status: 400 }
      );
    }

    const app = await prisma.application.create({
      data: {
        userId,
        grantId,
        status: "in_progress",
      },
    });

    return NextResponse.json({ application: app });
  } catch (err: any) {
    console.error("Start application error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
