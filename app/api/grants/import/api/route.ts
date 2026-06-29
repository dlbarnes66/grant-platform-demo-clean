import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Missing API URL" }, { status: 400 });
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "API response must be an array" },
        { status: 400 }
      );
    }

    for (const grant of data) {
      await prisma.grant.create({
        data: {
          title: grant.title,
          description: grant.description,
          category: grant.category,
          deadline: new Date(grant.deadline),
          industry: grant.industry ?? "",
          location: grant.location ?? "",
          fundingRange: grant.fundingRange ?? "",
        },
      });
    }

    return NextResponse.json({ imported: data.length });
  } catch (err: any) {
    console.error("API import error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
