import type { Product } from "@/lib/types";
import { bindSupplierMedia, catalogAssets } from "@/lib/product-media";
import { resolveFitment, type FitmentRule } from "@/lib/fitment";
import { parseManufacturerFitment } from "@/lib/manufacturer-fitment";
import { isJunkCatalogItem } from "@/lib/apparel";
import { catalogGoal, classifyCatalogTitle } from "@/lib/catalog-classify";
import rows from "./manufacturer-catalog.json";

export type ManufacturerRow = {
  sku: string;
  mpn: string;
  brand: string;
  supplierId: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  image: string;
  sourceUrl: string;
  make?: string;
  model?: string;
  generation?: string;
  yearFrom?: number;
  yearTo?: number;
  roadLegalStatus?: Product["roadLegalStatus"];
};

const euShip = { origin: "EU", timeFromDays: 5, timeToDays: 12, costCents: 1900 };
const SKIP_IMAGE = /ProductDefault\.gif|giphy|placeholder|1x1|blank|favicon|no[_-]?image/i;

function decodeHtml(value: string) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&#39;", "'");
}

function rulesFor(row: ManufacturerRow): FitmentRule[] {
  const universal =
    row.category === "accessories" ||
    row.category === "detailing" ||
    row.subcategory === "dashcam" ||
    row.subcategory === "electrical" ||
    row.subcategory === "care" ||
    row.subcategory === "coating" ||
    row.subcategory === "plates";
  if (universal) {
    return [{ fitmentType: "COMPATIBLE" }];
  }
  const parsed = parseManufacturerFitment(row);
  if (!parsed.make || !parsed.model) return [];
  if (!parsed.generation && parsed.yearFrom == null) return [];
  if (!parsed.generation && (parsed.make === "BMW" || parsed.make === "Mercedes-Benz")) return [];
  return [
    {
      make: parsed.make,
      model: parsed.model,
      generation: parsed.generation,
      yearFrom: parsed.yearFrom,
      yearTo: parsed.yearTo,
      fitmentType: parsed.generation ? "EXACT" : "COMPATIBLE",
    },
  ];
}

export const manufacturerProducts: Product[] = (rows as ManufacturerRow[])
  .filter((row) => !isJunkCatalogItem(row))
  .map((row) => {
    const kind = classifyCatalogTitle(row.title, row.subcategory);
    const category = row.category === "performance" && kind.category !== "performance" ? kind.category : row.category;
    const subcategory = row.subcategory === "hardware" && kind.subcategory !== "hardware" ? kind.subcategory : row.subcategory;
    const easy = category === "accessories" || category === "detailing" || category === "interior";
    const media = bindSupplierMedia(row.sku, SKIP_IMAGE.test(row.image) ? [] : [row.image], row.title);
    return {
    id: `mfr-${row.supplierId}-${row.sku}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
    title: decodeHtml(row.title),
    slug: row.slug,
    description: decodeHtml(row.description),
    brand: row.brand,
    category,
    subcategory,
    price: row.price,
    compareAtPrice: null,
    currency: "EUR",
    stock: 6,
    sku: row.sku,
    mpn: row.mpn,
    ean: null,
    oemNumbers: [],
    crossReferences: [],
    ...catalogAssets(row.sku, media),
    videos: [],
    supplierId: row.supplierId,
    supplierSku: row.mpn || row.sku,
    weightKg: null,
    dimensions: null,
    shipping: euShip,
    installationDifficulty: easy ? "EASY" : "PROFESSIONAL",
    installationTimeMin: easy ? 10 : 120,
    roadLegalStatus: row.roadLegalStatus ?? "UNKNOWN",
    warranty: "24 months",
    tags: [row.brand.toLowerCase(), subcategory, row.sku.toLowerCase()],
    goalTags: [catalogGoal(category)],
    specifications: {
      Brand: row.brand,
      MPN: row.mpn,
      Source: row.sourceUrl,
    },
    included: [row.title],
    whatsIncluded: [row.title],
    installationNotes: "Confirm fitment against the manufacturer listing before ordering.",
    seoTitle: `${row.brand} ${row.mpn} ${row.title}`.slice(0, 70),
    seoDescription: row.description.slice(0, 160),
    relatedSlugs: [],
    setupSlugs: [],
    compatibility: resolveFitment(rulesFor({ ...row, category, subcategory })),
    createdAt: "2026-09-17",
    updatedAt: "2026-09-20",
  };
});
