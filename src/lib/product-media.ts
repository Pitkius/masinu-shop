import type { Product, ProductDocument, ProductMedia } from "@/lib/types";

/** Only keep assets that belong to this SKU. Shared/pool photos are rejected. */
export function bindProductMedia(sku: string, assets: ProductMedia[] | undefined): ProductMedia[] {
  if (!sku || !assets?.length) return [];
  const seen = new Set<string>();
  return assets.filter((asset) => {
    if (asset.sku !== sku || !asset.src || asset.illustrative) return false;
    if (seen.has(asset.src)) return false;
    seen.add(asset.src);
    return true;
  });
}

export function bindSupplierMedia(sku: string, urls: Array<string | null | undefined>, alt: string): ProductMedia[] {
  return bindProductMedia(
    sku,
    urls.filter((src): src is string => Boolean(src)).map((src, index) => ({
      src,
      role: index === 0 ? "hero" : "supplier",
      alt,
      sku,
    })),
  );
}

export function mediaSrcs(media: ProductMedia[]): string[] {
  return media.map((item) => item.src);
}

export function productMedia(product: Pick<Product, "sku" | "media" | "images">): ProductMedia[] {
  if (product.media?.length) return bindProductMedia(product.sku, product.media);
  return [];
}

export function productHero(product: Pick<Product, "sku" | "media" | "images">): ProductMedia | null {
  const media = productMedia(product);
  const bound = media.find((item) => item.role === "hero") ?? media[0];
  if (bound) return bound;
  const src = product.images?.[0];
  if (!src || !product.sku) return null;
  return { src, role: "hero", alt: "", sku: product.sku };
}

export function catalogAssets(sku: string, media?: ProductMedia[], documents?: ProductDocument[]) {
  const bound = bindProductMedia(sku, media);
  return {
    media: bound,
    images: mediaSrcs(bound),
    documents: documents ?? [],
  };
}

/** Fail loudly if a catalog entry reuses another SKU's photo or carries unbound images. */
export function assertCatalogMediaIntegrity(products: Array<Pick<Product, "sku" | "media" | "images">>) {
  const srcToSku = new Map<string, string>();
  const skus = new Set<string>();
  for (const product of products) {
    if (!product.sku) throw new Error("Catalog product is missing a SKU.");
    if (skus.has(product.sku)) throw new Error(`Duplicate SKU ${product.sku}`);
    skus.add(product.sku);
    const media = bindProductMedia(product.sku, product.media);
    for (const src of product.images ?? []) {
      if (!media.some((asset) => asset.src === src)) {
        throw new Error(`Unbound image on ${product.sku}`);
      }
    }
    for (const asset of media) {
      const owner = srcToSku.get(asset.src);
      if (owner && owner !== product.sku) {
        throw new Error(`Shared photo ${asset.src} on ${owner} and ${product.sku}`);
      }
      srcToSku.set(asset.src, product.sku);
    }
  }
}
