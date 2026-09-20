import { NextResponse } from "next/server";
import { z } from "zod";
import { allProducts } from "@/lib/catalog";
import { tryOnDecision, tryOnPreviewKind, type TryOnUnchangedReason } from "@/lib/tryon";
import { renderTryOn, tryOnConfigured } from "@/lib/tryon-provider";

export const maxDuration = 60;

const Body = z.object({
  productId: z.string().min(1).max(120),
  scene: z.enum(["exterior", "engine", "interior"]),
  image: z.string().startsWith("data:image/").max(6_500_000),
  vehicleLabel: z.string().max(160).optional(),
});

export async function GET() {
  return NextResponse.json({ configured: tryOnConfigured() });
}

export async function POST(request: Request) {
  if (!tryOnConfigured()) {
    return NextResponse.json({ error: "not-configured" }, { status: 503 });
  }

  const raw = await request.json().catch(() => null);
  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const product = allProducts().find((item) => item.id === parsed.data.productId);
  if (!product) return NextResponse.json({ error: "unknown-product" }, { status: 404 });

  const kind = tryOnPreviewKind(product);
  const decision = tryOnDecision(kind, parsed.data.scene);
  if (decision.action === "unchanged") {
    return NextResponse.json({ unchanged: true, reason: decision.reason as TryOnUnchangedReason });
  }

  try {
    const image = await renderTryOn({
      product,
      imageDataUrl: parsed.data.image,
      kind: decision.kind,
      vehicleLabel: parsed.data.vehicleLabel,
    });
    return NextResponse.json({ unchanged: false, image });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Visualization failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
