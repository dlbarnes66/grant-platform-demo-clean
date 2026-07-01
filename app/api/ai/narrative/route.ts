import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {
      sectionId,
      sectionText,
      instructions,
      workspaceId,
      grantId
    } = await req.json();

    // Fetch workspace context
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        name: true,
        mission: true,
        history: true,
        writingStyle: true,
        tonePreference: true,
        readingLevel: true
      }
    });

    // Fetch grant context
    const grant = await prisma.grant.findUnique({
      where: { id: grantId },
      select: {
        title: true,
        summary: true,
        requirements: true,
        scoringCriteria: true
      }
    });

    // Fetch section metadata
    const section = await prisma.grantSection.findUnique({
      where: { id: sectionId },
      select: {
        title: true,
        purpose: true,
        previousVersions: true
      }
    });

    const prompt = `
You are an expert grant writer. Rewrite the following grant section using clear, persuasive, professional language.

Workspace Context:
- Name: ${workspace?.name}
- Mission: ${workspace?.mission}
- History: ${workspace?.history}
- Writing Style: ${workspace?.writingStyle}
- Tone Preference: ${workspace?.tonePreference}
- Reading Level: ${workspace?.readingLevel}

Grant Context:
- Title: ${grant?.title}
- Summary: ${grant?.summary}
- Requirements: ${grant?.requirements}
- Scoring Criteria: ${grant?.scoringCriteria}

Section Metadata:
- Title: ${section?.title}
- Purpose: ${section?.purpose}
- Previous Versions: ${section?.previousVersions?.join("\n\n")}

User Instructions:
${instructions}

Section to Rewrite:
${sectionText}

Return only the rewritten section.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const output = completion.choices[0].message.content;

    return NextResponse.json({ output });
  } catch (error) {
    console.error("Narrative AI Error:", error);
    return NextResponse.json(
      { error: "AI drafting failed" },
      { status: 500 }
    );
  }
}
