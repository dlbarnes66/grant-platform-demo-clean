import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16"
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, workspaceId } = await req.json();

    const userId = session.user.id;

    // Load workspace
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId }
    });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Load or create Stripe customer
    let customerId = workspace.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        metadata: {
          userId,
          workspaceId
        }
      });

      customerId = customer.id;

      await prisma.workspace.update({
        where: { id: workspaceId },
        data: { stripeCustomerId: customerId }
      });
    }

    // Determine price ID
    const priceMap: Record<string, string> = {
      basic: process.env.STRIPE_PRICE_ID_BASIC!,
      pro: process.env.STRIPE_PRICE_ID_PRO!,
      advanced: process.env.STRIPE_PRICE_ID_ADVANCED!,
      enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE!
    };

    const priceId = priceMap[plan];

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Advanced requires card → create checkout session
    if (plan === "advanced") {
      const checkout = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        subscription_data: {
          trial_period_days: 14
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/workspace/${workspaceId}/billing?success=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/workspace/${workspaceId}/billing?canceled=1`
      });

      return NextResponse.json({ checkoutUrl: checkout.url });
    }

    // Basic & Pro → no card required → create trial subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: 14,
      payment_behavior: "default_incomplete"
    });

    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        stripeSubscriptionId: subscription.id,
        subscriptionPlan: plan,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        isLocked: false
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Billing Error:", error);
    return NextResponse.json({ error: "Billing failed" }, { status: 500 });
  }
}
