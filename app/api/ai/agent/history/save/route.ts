import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId, goal, steps, results } = await req.json();

    const entry = await prisma.agentHistory.create({
      data: {
        userId,
        goal,
        steps,
        results,
      },
    });

    return NextResponse.json({ saved: true, entry });
  } catch (err: any) {
    console.error("Agent history save error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
