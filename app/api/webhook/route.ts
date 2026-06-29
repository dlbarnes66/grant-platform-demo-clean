import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: null,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

function buffer(readable: any) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    readable.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
}

export async function POST(req: Request) {
  const rawBody = await buffer(req.body);
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        await prisma.user.update({
          where: { stripeCustomerId: session.customer as string },
          data: {
            subscriptionStatus: "active",
          },
        });

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        await prisma.user.update({
          where: { stripeCustomerId: invoice.customer as string },
          data: {
            subscriptionStatus: "active",
          },
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.user.update({
          where: { stripeCustomerId: subscription.customer as string },
          data: {
            subscriptionStatus: "canceled",
          },
        });

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
