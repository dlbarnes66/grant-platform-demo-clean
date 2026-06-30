import { NextResponse } from "next/server";
import { generateNarrative } from "@/lib/ai/narrative-engine";

export async function POST(req: Request) {
  const { section, project, tone } = await req.json();

  const text = await generateNarrative(section, project, tone);

  return NextResponse.json({ text });
}
