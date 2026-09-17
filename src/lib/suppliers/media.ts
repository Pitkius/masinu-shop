import { bindSupplierMedia, catalogAssets } from "@/lib/product-media";
import type { ProductDocument } from "@/lib/types";

/** Attach supplier-feed URLs to a single SKU. Never reuse a photo pool across products. */
export function supplierProductImages(sku: string, title: string, urls: string[] = []) {
  return bindSupplierMedia(sku, urls, title);
}

/** Map a supplier feed row onto catalog media + documents for one SKU. */
export function applySupplierAssets(
  sku: string,
  title: string,
  urls: string[] = [],
  documents: ProductDocument[] = [],
) {
  return catalogAssets(sku, bindSupplierMedia(sku, urls, title), documents);
}
