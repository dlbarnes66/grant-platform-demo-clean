import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { grantIds } = await req.json();

  if (!Array.isArray(grantIds) || grantIds.length < 2) {
    return NextResponse.json(
      { error: "Select at least two grants" },
      { status: 400 }
    );
  }

  const comparison = await prisma.grantComparison.create({
    data: {
      userId,
      grantIds,
    },
  });

  return NextResponse.json({ comparison });
}
