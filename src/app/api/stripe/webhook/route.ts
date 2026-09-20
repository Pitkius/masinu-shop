import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  try {
    const payload = await request.text();
    stripe.webhooks.constructEvent(payload, signature, secret);
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }
}
