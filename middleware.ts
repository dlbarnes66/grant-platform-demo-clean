import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addonEnforcement } from "@/lib/addonEnforcement";

export async function middleware(req: any) {
  const url = req.nextUrl.pathname;

  // -----------------------------
  // 1. Add‑On Enforcement (API)
  // -----------------------------
  const addonCheck = await addonEnforcement(req);
  if (addonCheck) return addonCheck;

  // -----------------------------
  // 2. Subscription + Trial Enforcement (Dashboard)
  // -----------------------------
  if (!url.startsWith("/dashboard/workspace")) {
    return NextResponse.next();
  }

  const workspaceId = url.split("/")[3];

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId }
  });

  if (!workspace) return NextResponse.next();

  // Trial expired → lock workspace
  if (workspace.trialEndsAt && workspace.trialEndsAt < new Date()) {
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { isLocked: true }
    });

    return NextResponse.redirect(
      new URL(`/dashboard/workspace/${workspaceId}/billing`, req.url)
    );
  }

  // Locked → redirect to billing
  if (workspace.isLocked) {
    return NextResponse.redirect(
      new URL(`/dashboard/workspace/${workspaceId}/billing`, req.url)
    );
  }

  return NextResponse.next();
}
