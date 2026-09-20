import { NextRequest, NextResponse } from "next/server";
import { allProducts } from "@/lib/catalog";

const MAX_BYTES = 8 * 1024 * 1024;

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "Missing product" }, { status: 400 });

  const product = allProducts().find((item) => item.id === productId);
  const src = product?.images[0];
  if (!src) return NextResponse.json({ error: "No product photo" }, { status: 404 });

  if (src.startsWith("/")) {
    return NextResponse.redirect(new URL(src, request.url));
  }

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return NextResponse.json({ error: "Invalid photo" }, { status: 400 });
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return NextResponse.json({ error: "Invalid photo" }, { status: 400 });
  }

  const upstream = await fetch(src, {
    headers: { Accept: "image/*" },
    signal: AbortSignal.timeout(12000),
    redirect: "follow",
  }).catch(() => null);

  if (!upstream?.ok) return NextResponse.json({ error: "Photo fetch failed" }, { status: 502 });
  const type = upstream.headers.get("content-type") ?? "image/jpeg";
  if (!type.startsWith("image/")) return NextResponse.json({ error: "Not an image" }, { status: 502 });

  const buffer = Buffer.from(await upstream.arrayBuffer());
  if (buffer.byteLength > MAX_BYTES) return NextResponse.json({ error: "Photo too large" }, { status: 413 });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
