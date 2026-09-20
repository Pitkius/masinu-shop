import { NextRequest, NextResponse } from "next/server";
import { allProducts } from "@/lib/catalog";
import { fetchCatalogImage } from "@/lib/catalog-image";

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "Missing product" }, { status: 400 });

  const product = allProducts().find((item) => item.id === productId);
  const src = product?.images[0];
  if (!src) return NextResponse.json({ error: "No product photo" }, { status: 404 });

  if (src.startsWith("/")) {
    return NextResponse.redirect(new URL(src, request.url));
  }

  const image = await fetchCatalogImage(src);
  if (!image) return NextResponse.json({ error: "Photo fetch failed" }, { status: 502 });

  return new NextResponse(new Uint8Array(image.bytes), {
    headers: {
      "Content-Type": image.mime,
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
