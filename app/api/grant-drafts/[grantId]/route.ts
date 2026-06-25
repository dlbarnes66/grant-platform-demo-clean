import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { grantId: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const drafts = await prisma.grantDraft.findMany({
    where: {
      userId,
      grantId: params.grantId,
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ drafts });
}
