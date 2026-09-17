import { bindSupplierMedia } from "@/lib/product-media";
import type { ProductDocument, ProductMedia } from "@/lib/types";
import feed from "./supplier-feed.json";

type FeedRow = {
  images?: string[];
  documents?: ProductDocument[];
};

const rows = feed as Record<string, FeedRow>;

/** Only URLs the supplier sent for this exact SKU. Empty feed = honest placeholder. */
export function feedMedia(sku: string, title: string): ProductMedia[] {
  const images = rows[sku]?.images ?? [];
  return bindSupplierMedia(sku, images, title);
}

export function feedDocuments(sku: string): ProductDocument[] {
  return rows[sku]?.documents ?? [];
}
