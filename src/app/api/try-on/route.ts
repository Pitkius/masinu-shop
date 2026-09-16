import { NextRequest, NextResponse } from "next/server";
import { getTryOnProvider } from "@/lib/tryon";
import { allProducts, allVehicles } from "@/lib/catalog";
import { z } from "zod";

const schema = z.object({
  vehicleId: z.string(),
  productId: z.string(),
  imageDataUrl: z.string().startsWith("data:image"),
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  if (!allVehicles().some((v) => v.id === parsed.data.vehicleId)) {
    return NextResponse.json({ error: "Unknown vehicle" }, { status: 404 });
  }
  if (!allProducts().some((p) => p.id === parsed.data.productId)) {
    return NextResponse.json({ error: "Unknown product" }, { status: 404 });
  }
  const result = await getTryOnProvider().visualize(parsed.data);
  return NextResponse.json(result, { status: result.status === "ok" ? 200 : 503 });
}
