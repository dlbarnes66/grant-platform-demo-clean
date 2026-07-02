import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { canAddUser } from "@/lib/userLimits";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId, email } = await req.json();

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { users: true }
    });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    if (!canAddUser(workspace)) {
      return NextResponse.json(
        { error: "User limit reached. Upgrade plan or purchase Extra Seats add‑on." },
        { status: 403 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: { email }
      });
    }

    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        users: {
          connect: { id: user.id }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add User Error:", error);
    return NextResponse.json({ error: "Add user failed" }, { status: 500 });
  }
}
