import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export async function GET(
  req: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const workspaceId = params.workspaceId;

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        name: true,
        mission: true,
        history: true
      }
    });

    const grants = await prisma.grant.findMany({
      where: { workspaceId },
      select: {
        id: true,
        title: true,
        summary: true,
        requirements: true,
        scoringCriteria: true,
        status: true,
        priority: true
      }
    });

    const prompt = `
You are an expert federal grant strategist. Analyze the entire grant portfolio for this workspace.

Workspace:
- Name: ${workspace?.name}
- Mission: ${workspace?.mission}
- History: ${workspace?.history}

Grants:
${JSON.stringify(grants, null, 2)}

Provide a JSON object:

{
  "portfolioScore": 0-100,
  "fundingProbability": 0-100,
  "portfolioStrengths": ["...", "..."],
  "portfolioRisks": ["...", "..."],
  "grantContributions": [
    { "grantId": "...", "score": 0-100, "impact": "..." }
  ],
  "recommendations": ["...", "..."],
  "summary": "One paragraph portfolio analysis"
}

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
    console.error("Portfolio Intelligence Error:", error);
    return NextResponse.json(
      { error: "Failed to generate portfolio intelligence" },
      { status: 500 }
    );
  }
}
