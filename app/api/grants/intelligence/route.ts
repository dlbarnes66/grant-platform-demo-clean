import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { grantId } = await req.json();

    const grant = await prisma.grant.findUnique({
      where: { id: grantId },
      select: {
        title: true,
        summary: true,
        requirements: true,
        scoringCriteria: true,
        workspace: {
          select: {
            name: true,
            mission: true,
            history: true
          }
        }
      }
    });

    const prompt = `
You are an expert federal grant strategist. Analyze the fit between the workspace and the grant.

Grant:
- Title: ${grant?.title}
- Summary: ${grant?.summary}
- Requirements: ${grant?.requirements}
- Scoring Criteria: ${grant?.scoringCriteria}

Workspace:
- Name: ${grant?.workspace.name}
- Mission: ${grant?.workspace.mission}
- History: ${grant?.workspace.history}

Provide a JSON object:

{
  "fitScore": 0-100,
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "risks": ["...", "..."],
  "recommendations": ["...", "..."],
  "summary": "One paragraph fit analysis"
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
    console.error("Grant Intelligence Error:", error);
    return NextResponse.json(
      { error: "Failed to generate intelligence report" },
      { status: 500 }
    );
  }
}
