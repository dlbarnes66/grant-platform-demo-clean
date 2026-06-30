import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { documentId, userId, text, selection } = await req.json();

    const entry = await prisma.documentComment.create({
      data: {
        documentId,
        userId,
        text,
        selection,
      },
    });

    return NextResponse.json({
      broadcast: {
        type: "comment",
        documentId,
        userId,
        text,
        selection,
      },
      entry,
    });
  } catch (err: any) {
    console.error("Comment add error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
