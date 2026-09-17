import { products } from "@/data/products";
import type { Product } from "@/lib/types";

/** Storefront listings only show SKUs that have a unique manufacturer photo. */
export function shopProducts(): Product[] {
  return products.filter((product) => product.images.length > 0);
}

export function shopBrands() {
  return [...new Set(shopProducts().map((product) => product.brand))].sort();
}
