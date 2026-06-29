import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const { industry, location, fundingNeeds } = user.profile;

    const grants = await prisma.grant.findMany({
      where: {
        AND: [
          { industry: { contains: industry, mode: "insensitive" } },
          { location: { contains: location, mode: "insensitive" } },
          { fundingRange: { contains: fundingNeeds, mode: "insensitive" } },
        ],
      },
      orderBy: { deadline: "asc" },
      take: 50,
    });

    return NextResponse.json({ grants });
  } catch (err: any) {
    console.error("Grant match error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
