import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export const runtime = "nodejs";

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
        mission: true
      }
    });

    const grants = await prisma.grant.findMany({
      where: { workspaceId },
      include: {
        timeline: true,
        sections: true
      }
    });

    const prompt =
      "You are an expert grant program manager. Generate workspace notifications.\n\n" +
      "Workspace: " +
      workspace?.name +
      "\nMission: " +
      workspace?.mission +
      "\n\n" +
      "Grants:\n" +
      JSON.stringify(grants, null, 2) +
      "\n\n" +
      "Provide a JSON object:\n" +
      "{\n" +
      '  "notifications": [\n' +
      '    { "title": "...", "message": "...", "type": "deadline|risk|reminder" }\n' +
      "  ]\n" +
      "}\n\n" +
      "Return ONLY valid JSON.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    const output = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json({ notifications: output.notifications });
  } catch (error) {
    console.error("Notifications Error:", error);
    return NextResponse.json(
      { error: "Failed to generate notifications" },
      { status: 500 }
    );
  }
}
