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
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        deadline: true,
        summary: true
      }
    });

    const upcomingDeadlines = grants
      .filter((g) => g.deadline)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 5);

    const prompt = `
You are an expert grant operations analyst.

Workspace:
- Name: ${workspace?.name}
- Mission: ${workspace?.mission}
- History: ${workspace?.history}

Grants:
${JSON.stringify(grants, null, 2)}

Provide a JSON object:

{
  "alerts": ["...", "..."],
  "risks": ["...", "..."],
  "missing": ["...", "..."],
  "summary": "One paragraph summary of workspace grant activity"
}

Return ONLY valid JSON.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const ai = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json({
      workspace,
      grants,
      upcomingDeadlines,
      ai
    });
  } catch (error) {
    console.error("Workspace Dashboard Error:", error);
    return NextResponse.json(
      { error: "Failed to load workspace dashboard" },
      { status: 500 }
    );
  }
}
