import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const domain = email.split("@")[1];

    const org = await prisma.organization.findFirst({
      where: { domain },
    });

    if (!org) {
      return NextResponse.json({
        assigned: false,
        reason: "No matching org domain",
      });
    }

    await prisma.teamMember.create({
      data: {
        orgId: org.id,
        user: { connect: { email } },
      },
    });

    return NextResponse.json({
      assigned: true,
      org,
    });
  } catch (err: any) {
    console.error("Provisioning error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
