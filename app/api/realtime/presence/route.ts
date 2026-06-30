import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { documentId, userId } = await req.json();

    const entry = await prisma.documentPresence.upsert({
      where: { documentId_userId: { documentId, userId } },
      update: { lastSeen: new Date() },
      create: { documentId, userId, lastSeen: new Date() },
    });

    return NextResponse.json({ active: true, entry });
  } catch (err: any) {
    console.error("Presence error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
