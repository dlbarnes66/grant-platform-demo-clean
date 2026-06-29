import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { days = 180 } = await req.json();

    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const oldGrants = await prisma.grant.findMany({
      where: { createdAt: { lt: cutoff } },
    });

    let archived = 0;

    for (const grant of oldGrants) {
      await prisma.grantArchive.create({
        data: {
          originalId: grant.id,
          title: grant.title,
          description: grant.description,
          category: grant.category,
          deadline: grant.deadline,
          industry: grant.industry,
          location: grant.location,
          fundingRange: grant.fundingRange,
          archivedAt: new Date(),
        },
      });

      await prisma.grant.delete({ where: { id: grant.id } });
      archived++;
    }

    return NextResponse.json({ archived });
  } catch (err: any) {
    console.error("Grant archive error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
