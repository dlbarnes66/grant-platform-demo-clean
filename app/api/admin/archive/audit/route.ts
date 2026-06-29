import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { days = 90 } = await req.json();

    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const logs = await prisma.auditLog.findMany({
      where: { createdAt: { lt: cutoff } },
    });

    let archived = 0;

    for (const log of logs) {
      await prisma.auditArchive.create({
        data: {
          originalId: log.id,
          actorId: log.actorId,
          event: log.event,
          details: log.details,
          orgId: log.orgId,
          archivedAt: new Date(),
        },
      });

      await prisma.auditLog.delete({ where: { id: log.id } });
      archived++;
    }

    return NextResponse.json({ archived });
  } catch (err: any) {
    console.error("Audit archive error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
