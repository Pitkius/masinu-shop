import type { Product } from "@/lib/types";
import { bindSupplierMedia, catalogAssets } from "@/lib/product-media";
import { resolveFitment, type FitmentRule } from "@/lib/fitment";
import { parseManufacturerFitment } from "@/lib/manufacturer-fitment";
import { isApparelMerch } from "@/lib/apparel";
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

function rulesFor(row: ManufacturerRow): FitmentRule[] {
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
  .filter((row) => !isApparelMerch(row))
  .map((row) => {
    const media = bindSupplierMedia(row.sku, SKIP_IMAGE.test(row.image) ? [] : [row.image], row.title);
    return {
    id: `mfr-${row.supplierId}-${row.sku}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
    title: row.title,
    slug: row.slug,
    description: row.description,
    brand: row.brand,
    category: row.category,
    subcategory: row.subcategory,
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
    installationDifficulty: "PROFESSIONAL",
    installationTimeMin: 120,
    roadLegalStatus: row.roadLegalStatus ?? "UNKNOWN",
    warranty: "24 months",
    tags: [row.brand.toLowerCase(), row.subcategory, row.sku.toLowerCase()],
    goalTags: row.category === "exhaust" ? ["better-sound", "more-power"] : ["more-power"],
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
    compatibility: resolveFitment(rulesFor(row)),
    createdAt: "2026-09-17",
    updatedAt: "2026-09-17",
  };
});
