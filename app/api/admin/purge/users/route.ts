import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { days = 365 } = await req.json();

    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const users = await prisma.user.findMany({
      where: { lastLogin: { lt: cutoff } },
    });

    let purged = 0;

    for (const user of users) {
      await prisma.user.delete({ where: { id: user.id } });
      purged++;
    }

    return NextResponse.json({ purged });
  } catch (err: any) {
    console.error("User purge error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
