import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { applicationId, userId, field, value } = await req.json();

    if (!applicationId || !userId || !field) {
      return NextResponse.json(
        { error: "Missing applicationId, userId, or field" },
        { status: 400 }
      );
    }

    const edit = await prisma.applicationEdit.create({
      data: {
        applicationId,
        userId,
        field,
        value,
      },
    });

    return NextResponse.json({ edit });
  } catch (err: any) {
    console.error("Collab edit error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
