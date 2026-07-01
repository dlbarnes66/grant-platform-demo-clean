import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { grantId, useAI, milestones } = await req.json();

    let finalMilestones = milestones;

    if (useAI) {
      const grant = await prisma.grant.findUnique({
        where: { id: grantId },
        select: {
          title: true,
          summary: true,
          deadline: true,
          requirements: true
        }
      });

      const prompt = `
You are an expert federal grant project manager. Create a milestone timeline for this grant:

Title: ${grant?.title}
Summary: ${grant?.summary}
Requirements: ${grant?.requirements}
Deadline: ${grant?.deadline}

Provide a JSON object:

{
  "milestones": [
    {
      "title": "...",
      "description": "...",
      "dueDate": "YYYY-MM-DD",
      "tasks": ["...", "..."]
    }
  ]
}

Return ONLY valid JSON.
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      });

      const output = JSON.parse(completion.choices[0].message.content);
      finalMilestones = output.milestones;
    }

    const timeline = await prisma.grantTimeline.upsert({
      where: { grantId },
      update: { milestones: finalMilestones },
      create: { grantId, milestones: finalMilestones }
    });

    return NextResponse.json({ success: true, timeline });
  } catch (error) {
    console.error("Timeline Error:", error);
    return NextResponse.json(
      { error: "Failed to generate timeline" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { grantId: string } }
) {
  try {
    const grantId = params.grantId;

    const timeline = await prisma.grantTimeline.findUnique({
      where: { grantId }
    });

    return NextResponse.json({ timeline });
  } catch (error) {
    console.error("Timeline Load Error:", error);
    return NextResponse.json(
      { error: "Failed to load timeline" },
      { status: 500 }
    );
  }
}
