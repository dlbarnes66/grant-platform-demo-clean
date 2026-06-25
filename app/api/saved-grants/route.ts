import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ⭐ SAVE A GRANT
export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const {
    grantId,
    title,
    summary,
    amount,
    deadline,
    category,
    agency,
    url,
  } = body;

  const saved = await prisma.savedGrant.create({
    data: {
      userId,
      grantId,
      title,
      summary,
      amount,
      deadline,
      category,
      agency,
      url,
    },
  });

  return NextResponse.json({ saved });
}

// ⭐ GET ALL SAVED GRANTS FOR USER
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const saved = await prisma.savedGrant.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ saved });
}
