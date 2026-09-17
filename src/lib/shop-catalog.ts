import { products } from "@/data/products";
import { vehicles } from "@/data/vehicles";
import { fitmentForVehicle } from "@/lib/fitment";
import type { Product } from "@/lib/types";

/** Storefront listings only show SKUs that have a unique manufacturer photo. */
export function shopProducts(): Product[] {
  return products.filter((product) => product.images.length > 0);
}

export function shopBrands() {
  return [...new Set(shopProducts().map((product) => product.brand))].sort();
}

function fitsVehicle(product: Product, vehicleId: string) {
  const status = fitmentForVehicle(product.compatibility, vehicleId);
  return status.fitmentType === "EXACT" || status.fitmentType === "COMPATIBLE" || status.fitmentType === "MODIFICATION_REQUIRED";
}

/** Photo SKUs plus vehicle-specific kits that belong to this car's generation. */
export function productsForVehicle(vehicleId: string): Product[] {
  return products
    .filter((product) => fitsVehicle(product, vehicleId))
    .sort((a, b) => Number(b.images.length > 0) - Number(a.images.length > 0) || a.title.localeCompare(b.title));
}

export function productsForGeneration(makeSlug: string, modelSlug: string, generationSlug: string): Product[] {
  const sample = vehicles.find(
    (item) => item.makeSlug === makeSlug && item.modelSlug === modelSlug && item.generationSlug === generationSlug,
  );
  return sample ? productsForVehicle(sample.id) : [];
}
