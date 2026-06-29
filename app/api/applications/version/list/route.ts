import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { applicationId } = await req.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: "Missing applicationId" },
        { status: 400 }
      );
    }

    const versions = await prisma.applicationVersion.findMany({
      where: { applicationId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ versions });
  } catch (err: any) {
    console.error("Version list error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
