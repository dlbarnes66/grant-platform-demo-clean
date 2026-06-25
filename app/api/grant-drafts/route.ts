import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { grantId, mode, content } = await req.json();

  const draft = await prisma.grantDraft.create({
    data: {
      userId,
      grantId,
      mode,
      content,
    },
  });

  return NextResponse.json({ draft });
}
