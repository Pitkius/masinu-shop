import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema, quoteItems } from "@/lib/checkout";
import { checkoutOrigin, getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "PAYMENT_UNCONFIGURED" }, { status: 503 });
  }

  try {
    const quote = quoteItems(parsed.data.items);
    if (!quote.ok) {
      return NextResponse.json({ error: "STOCK", productId: quote.productId }, { status: 409 });
    }

    const origin = checkoutOrigin(request);
    const lineItems: Array<{
      quantity: number;
      price_data: {
        currency: string;
        unit_amount: number;
        product_data: { name: string; images?: string[] };
      };
    }> = quote.items.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: "eur",
        unit_amount: line.unitPrice,
        product_data: { name: line.title.slice(0, 250) },
      },
    }));

    if (quote.shipping > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: quote.shipping,
          product_data: { name: "Shipping" },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: parsed.data.email,
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=1`,
      metadata: {
        name: parsed.data.name,
        email: parsed.data.email,
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      total: quote.total,
      currency: quote.currency,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Checkout failed" }, { status: 400 });
  }
}
