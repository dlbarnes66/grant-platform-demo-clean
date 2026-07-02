import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

// Required for Stripe webhooks in Next.js 14
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const bodyParser = false;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: undefined
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;

  try {
    const rawBody = await req.text();

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const workspace = await prisma.workspace.findFirst({
          where: { stripeCustomerId: subscription.customer as string }
        });

        if (!workspace) break;

        await prisma.workspace.update({
          where: { id: workspace.id },
          data: {
            stripeSubscriptionId: subscription.id,
            isLocked: subscription.status !== "active"
          }
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const workspace = await prisma.workspace.findFirst({
          where: { stripeSubscriptionId: subscription.id }
        });

        if (!workspace) break;

        await prisma.workspace.update({
          where: { id: workspace.id },
          data: { isLocked: true }
        });

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        const workspace = await prisma.workspace.findFirst({
          where: { stripeCustomerId: invoice.customer as string }
        });

        if (!workspace) break;

        await prisma.workspace.update({
          where: { id: workspace.id },
          data: { isLocked: true }
        });

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
