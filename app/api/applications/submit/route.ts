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

    const app = await prisma.application.update({
      where: { id: applicationId },
      data: { status: "submitted" },
    });

    return NextResponse.json({ submitted: true, application: app });
  } catch (err: any) {
    console.error("Submit application error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
