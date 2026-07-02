import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { AddonKey } from "@/lib/addonCapabilities";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { addonKey, workspaceId } = await req.json();

    const validKeys: AddonKey[] = [
      "aiWriter",
      "grantMatching",
      "crm",
      "scoringEngine",
      "advancedReporting",
      "complianceAutomation",
      "budgetAutomation",
      "extraSeats",
      "vaultExpansion",
      "packetExpansion"
    ];

    if (!validKeys.includes(addonKey)) {
      return NextResponse.json({ error: "Invalid add-on" }, { status: 400 });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId }
    });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const updatedAddons = Array.from(new Set([...(workspace.addons || []), addonKey]));

    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { addons: updatedAddons }
    });

    return NextResponse.json({ success: true, addons: updatedAddons });
  } catch (error) {
    console.error("Add-on Activation Error:", error);
    return NextResponse.json({ error: "Activation failed" }, { status: 500 });
  }
}
