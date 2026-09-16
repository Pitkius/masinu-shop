import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema, quoteItems } from "@/lib/checkout";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }
  try {
    const quote = quoteItems(parsed.data.items);
    if (!quote.ok) {
      return NextResponse.json({ error: "STOCK", productId: quote.productId }, { status: 409 });
    }
    return NextResponse.json({
      orderId: `ORD-${Date.now()}`,
      status: "AWAITING_PAYMENT",
      email: parsed.data.email,
      name: parsed.data.name,
      ...quote,
      payment: "unconfigured",
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Checkout failed" }, { status: 400 });
  }
}
