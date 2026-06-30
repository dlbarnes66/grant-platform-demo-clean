import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { documentId, userId, message } = await req.json();

    const entry = await prisma.documentChat.create({
      data: {
        documentId,
        userId,
        message,
      },
    });

    return NextResponse.json({
      broadcast: {
        type: "chat",
        documentId,
        userId,
        message,
      },
      entry,
    });
  } catch (err: any) {
    console.error("Chat send error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
