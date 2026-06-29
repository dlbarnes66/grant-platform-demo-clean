import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { days = 365 } = await req.json();

    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const apps = await prisma.application.findMany({
      where: { createdAt: { lt: cutoff } },
    });

    let archived = 0;

    for (const app of apps) {
      await prisma.applicationArchive.create({
        data: {
          originalId: app.id,
          userId: app.userId,
          grantId: app.grantId,
          content: app.content,
          status: app.status,
          archivedAt: new Date(),
        },
      });

      await prisma.application.delete({ where: { id: app.id } });
      archived++;
    }

    return NextResponse.json({ archived });
  } catch (err: any) {
    console.error("Application archive error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
