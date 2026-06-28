import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const grants = await prisma.savedGrant.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(grants);
  } catch (error) {
    console.error("Error fetching saved grants:", error);
    return NextResponse.json({ error: "Failed to fetch saved grants" }, { status: 500 });
  }
}
