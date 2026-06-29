import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { applicationId, content } = await req.json();

    if (!applicationId || !content) {
      return NextResponse.json(
        { error: "Missing applicationId or content" },
        { status: 400 }
      );
    }

    const version = await prisma.applicationVersion.create({
      data: {
        applicationId,
        content,
      },
    });

    return NextResponse.json({ version });
  } catch (err: any) {
    console.error("Version save error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
