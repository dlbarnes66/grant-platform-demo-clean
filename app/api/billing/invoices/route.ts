import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET() {
  const invoices = await stripe.invoices.list({
    customer: "cus_12345", // Replace with real customer ID
    limit: 20
  });

  return NextResponse.json({ invoices: invoices.data });
}
