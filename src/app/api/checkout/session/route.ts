import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  const stripe = getStripe();
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!stripe || !sessionId) {
    return NextResponse.json({ error: "Missing session" }, { status: 400 });
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      email: session.customer_email || session.customer_details?.email,
      amountTotal: session.amount_total,
      currency: session.currency,
    });
  } catch {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
}
