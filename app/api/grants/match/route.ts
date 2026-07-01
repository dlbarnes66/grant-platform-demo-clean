import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { workspaceId } = await req.json();

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        name: true,
        mission: true,
        history: true
      }
    });

    // Fetch recent grants from your own grants table
    const grants = await prisma.grant.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        summary: true,
        requirements: true,
        scoringCriteria: true
      }
    });

    const prompt = `
You are an expert grant matching engine.

Workspace:
- Name: ${workspace?.name}
- Mission: ${workspace?.mission}
- History: ${workspace?.history}

Grants:
${JSON.stringify(grants, null, 2)}

For each grant, return JSON:

{
  "matches": [
    {
      "id": "GRANT_ID",
      "title": "Grant Title",
      "summary": "Grant Summary",
      "matchScore": 0-100,
      "reasons": ["...", "..."]
    }
  ]
}

Only include grants with matchScore >= 60.
Return ONLY valid JSON.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const output = completion.choices[0].message.content;

    return NextResponse.json(JSON.parse(output));
  } catch (error) {
    console.error("Grant Match Error:", error);
    return NextResponse.json(
      { error: "Grant matching failed" },
      { status: 500 }
    );
  }
}
