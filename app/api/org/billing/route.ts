import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: null,
});

export async function POST(req: Request) {
  try {
    const { orgId } = await req.json();

    if (!orgId) {
      return NextResponse.json({ error: "Missing orgId" }, { status: 400 });
    }

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!org?.stripeCustomerId) {
      return NextResponse.json({ invoices: [], status: "none" });
    }

    const invoices = await stripe.invoices.list({
      customer: org.stripeCustomerId,
      limit: 20,
    });

    return NextResponse.json({
      invoices,
      status: org.subscriptionStatus,
    });
  } catch (err: any) {
    console.error("Org billing error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
