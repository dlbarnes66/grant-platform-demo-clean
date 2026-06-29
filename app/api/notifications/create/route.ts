import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId, message, type } = await req.json();

    if (!userId || !message) {
      return NextResponse.json(
        { error: "Missing userId or message" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
        type: type ?? "general",
      },
    });

    return NextResponse.json({ notification });
  } catch (err: any) {
    console.error("Notification create error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
