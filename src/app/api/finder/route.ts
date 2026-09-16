import { NextRequest, NextResponse } from "next/server";
import { findParts } from "@/lib/finder";
import { z } from "zod";

const schema = z.object({
  query: z.string().min(8).max(500),
  vehicleId: z.string().optional(),
  budgetCents: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const result = findParts(parsed.data);
  return NextResponse.json({
    ...result,
    products: result.products.map((product) => ({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      brand: product.brand,
      category: product.category,
    })),
  });
}
