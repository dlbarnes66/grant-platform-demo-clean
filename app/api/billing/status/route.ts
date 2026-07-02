import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { getServerSession } from "next-auth";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16"
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = new URL(req.url).searchParams.get("workspaceId");
    if (!workspaceId) {
      return NextResponse.json({ error: "Missing workspaceId" }, { status: 400 });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId }
    });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // If no Stripe subscription exists
    if (!workspace.stripeSubscriptionId) {
      return NextResponse.json({
        status: "trialing",
        trialEndsAt: workspace.trialEndsAt,
        isLocked: workspace.isLocked
      });
    }

    // Fetch subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      workspace.stripeSubscriptionId
    );

    const status = subscription.status; // active, past_due, canceled, incomplete, etc.

    // Update workspace lock state based on subscription
    let isLocked = workspace.isLocked;

    if (status === "active") {
      isLocked = false;
    } else if (status === "past_due" || status === "canceled" || status === "unpaid") {
      isLocked = true;
    }

    // Sync lock state to DB
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { isLocked }
    });

    return NextResponse.json({
      status,
      trialEndsAt: workspace.trialEndsAt,
      isLocked
    });
  } catch (error) {
    console.error("Subscription Status Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription status" },
      { status: 500 }
    );
  }
}
