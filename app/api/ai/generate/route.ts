import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { canUseAIWriter } from "@/lib/enforceAccess";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId, prompt } = await req.json();

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { users: true }
    });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    if (!canUseAIWriter(workspace)) {
      return NextResponse.json(
        { error: "AI Writer add‑on required" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      output: `AI response for: ${prompt}`
    });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "AI failed" }, { status: 500 });
  }
}
