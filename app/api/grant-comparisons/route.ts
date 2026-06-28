import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const comparisons = await prisma.grantComparison.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comparisons);
  } catch (error) {
    console.error("Error fetching comparisons:", error);
    return NextResponse.json({ error: "Failed to fetch comparisons" }, { status: 500 });
  }
}
