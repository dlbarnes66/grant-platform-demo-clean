import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { grantIds } = await req.json();

    const grants = await prisma.grant.findMany({
      where: { id: { in: grantIds } },
      select: {
        id: true,
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
You are an expert federal grant strategist. Compare the following grants side-by-side.

Grants:
${JSON.stringify(grants, null, 2)}

Provide a JSON object:

{
  "fitScores": [
    { "grantId": "...", "score": 0-100 }
  ],
  "strengths": {
    "grantId": ["...", "..."]
  },
  "weaknesses": {
    "grantId": ["...", "..."]
  },
  "recommendations": {
    "grantId": ["...", "..."]
  },
  "summary": "One paragraph comparison summary"
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
    console.error("Grant Comparison Error:", error);
    return NextResponse.json(
      { error: "Failed to generate comparison report" },
      { status: 500 }
    );
  }
}
