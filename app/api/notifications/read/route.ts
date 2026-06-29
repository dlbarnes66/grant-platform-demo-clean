import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { notificationId } = await req.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: "Missing notificationId" },
        { status: 400 }
      );
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return NextResponse.json({ read: true });
  } catch (err: any) {
    console.error("Notification read error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
