import { products } from "@/data/products";
import { productsForVehicle, shopProducts } from "@/lib/shop-catalog";
import { vehicles } from "@/data/vehicles";
import { categories } from "@/data/categories";
import { reviews } from "@/data/reviews";
import { publicBuilds } from "@/data/builds";
import { performanceStages } from "@/data/stages";
import { suppliers } from "@/data/suppliers";
import type { Product, Vehicle } from "@/lib/types";

export type CatalogFilter = {
  vehicleId?: string | null;
  compatibleOnly?: boolean;
  category?: string | null;
  brand?: string | null;
  q?: string | null;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  color?: string;
  goal?: string;
  roadLegal?: string;
  install?: string;
  specs?: Record<string, string>;
  page?: number;
  pageSize?: number;
};

export type CatalogProvider = {
  listProducts(filter?: CatalogFilter): { items: Product[]; total: number };
  getProduct(slugOrId: string): Product | null;
  listVehicles(): Vehicle[];
  getVehicle(id: string): Vehicle | null;
};

function matchesSpecs(product: Product, specs?: Record<string, string>) {
  if (!specs) return true;
  return Object.entries(specs).every(([key, value]) => {
    if (!value) return true;
    const found = product.specifications[key];
    return found === value;
  });
}

export const seedCatalog: CatalogProvider = {
  listProducts(filter = {}) {
    const page = Math.max(1, filter.page ?? 1);
    const pageSize = Math.min(48, Math.max(1, filter.pageSize ?? 24));
    let items = (filter.vehicleId && filter.compatibleOnly ? productsForVehicle(filter.vehicleId) : shopProducts()).slice();

    if (filter.category) items = items.filter((p) => p.category === filter.category);
    if (filter.brand) items = items.filter((p) => p.brand === filter.brand);
    if (filter.inStock) items = items.filter((p) => p.stock > 0);
    if (filter.minPrice != null) items = items.filter((p) => p.price >= filter.minPrice!);
    if (filter.maxPrice != null) items = items.filter((p) => p.price <= filter.maxPrice!);
    if (filter.material) items = items.filter((p) => p.specifications.Material === filter.material);
    if (filter.color) items = items.filter((p) => p.specifications.Color === filter.color);
    if (filter.goal) items = items.filter((p) => p.goalTags.includes(filter.goal!));
    if (filter.roadLegal) items = items.filter((p) => p.roadLegalStatus === filter.roadLegal);
    if (filter.install) items = items.filter((p) => p.installationDifficulty === filter.install);
    items = items.filter((p) => matchesSpecs(p, filter.specs));

    const total = items.length;
    const start = (page - 1) * pageSize;
    return { items: items.slice(start, start + pageSize), total };
  },
  getProduct(slugOrId) {
    return products.find((p) => p.slug === slugOrId || p.id === slugOrId) ?? null;
  },
  listVehicles() {
    return vehicles;
  },
  getVehicle(id) {
    return vehicles.find((v) => v.id === id) ?? null;
  },
};

export function getCatalog(): CatalogProvider {
  return seedCatalog;
}

export function allProducts() {
  return products;
}

export function allVehicles() {
  return vehicles;
}

export function allCategories() {
  return categories;
}

export function allReviews(slug?: string) {
  return slug ? reviews.filter((r) => r.productSlug === slug) : reviews;
}

export function allPublicBuilds() {
  return publicBuilds;
}

export function allStages() {
  return performanceStages;
}

export function allSuppliers() {
  return suppliers;
}

export function brands() {
  return [...new Set(products.map((p) => p.brand))].sort();
}

export function relatedProducts(product: Product) {
  return product.relatedSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p && p.images.length));
}

export function setupProducts(product: Product) {
  return product.setupSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p && p.images.length));
}
