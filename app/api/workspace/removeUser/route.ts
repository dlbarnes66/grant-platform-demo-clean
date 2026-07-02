import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId, userId } = await req.json();

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId }
    });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        users: {
          disconnect: { id: userId }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove User Error:", error);
    return NextResponse.json({ error: "Remove user failed" }, { status: 500 });
  }
}
