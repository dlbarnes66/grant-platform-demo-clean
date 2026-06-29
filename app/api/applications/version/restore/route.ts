import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { applicationId, versionId } = await req.json();

    if (!applicationId || !versionId) {
      return NextResponse.json(
        { error: "Missing applicationId or versionId" },
        { status: 400 }
      );
    }

    const version = await prisma.applicationVersion.findUnique({
      where: { id: versionId },
    });

    if (!version) {
      return NextResponse.json(
        { error: "Version not found" },
        { status: 404 }
      );
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: { content: version.content },
    });

    return NextResponse.json({ restored: true });
  } catch (err: any) {
    console.error("Version restore error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
