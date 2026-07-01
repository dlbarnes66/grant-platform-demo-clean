import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { grantId } = await req.json();

    const grant = await prisma.grant.findUnique({
      where: { id: grantId },
      include: {
        sections: true,
        budget: true,
        documents: true,
        workspace: true
      }
    });

    const prompt = `
You are an expert federal grant submission specialist. Assemble a full submission packet.

Grant Title: ${grant?.title}
Workspace: ${grant?.workspace.name}
Mission: ${grant?.workspace.mission}

Sections:
${grant?.sections.map((s) => `\n${s.title}:\n${s.content}`).join("\n\n")}

Budget:
${JSON.stringify(grant?.budget, null, 2)}

Documents:
${grant?.documents.map((d) => `${d.name} (${d.tag})`).join(", ")}

Provide a JSON object:

{
  "coverLetter": "AI-generated cover letter...",
  "complianceChecklist": ["...", "..."],
  "narrative": "Merged narrative from all sections...",
  "budgetText": "Readable budget summary...",
  "attachments": [
    { "name": "...", "tag": "...", "summary": "..." }
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

    return NextResponse.json({ success: true, packet: output });
  } catch (error) {
    console.error("Packet Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate submission packet" },
      { status: 500 }
    );
  }
}
