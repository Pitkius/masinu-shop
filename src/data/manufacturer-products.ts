import type { Product } from "@/lib/types";
import { bindSupplierMedia, catalogAssets } from "@/lib/product-media";
import { resolveFitment, type FitmentRule } from "@/lib/fitment";
import { parseManufacturerFitment } from "@/lib/manufacturer-fitment";
import { isJunkCatalogItem } from "@/lib/apparel";
import { catalogGoal, resolveManufacturerCategory } from "@/lib/catalog-classify";
import { plateRetailCents, shippingForSupplier } from "@/lib/retail-price";
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

const SKIP_IMAGE = /ProductDefault\.gif|giphy|placeholder|1x1|blank|favicon|no[_-]?image/i;

function decodeHtml(value: string) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&#39;", "'");
}

/** City frames are one mould, four prints: city vs LT arms × LT vs ES flag. */
function plateShopTitle(title: string) {
  const t = decodeHtml(title).replace(/\s+/g, " ").trim();
  const slogan = t.match(/"([^"]+)"/)?.[1];
  if (!slogan) return t;
  const arms = /Lietuvos herbu/.test(t) ? "Lietuvos herbas" : /herbu/.test(t) ? "miesto herbas" : null;
  const flag = /EU|Europos|ES europos/i.test(t)
    ? "ES vėliava"
    : /trispave|Lietuvos vėliav/i.test(t)
      ? "LT vėliava"
      : /Vytis/.test(t)
        ? "Vytis"
        : null;
  const bits = [slogan.replace(/\s+Lietuva$/i, ""), arms, flag].filter(Boolean);
  return `Numerio rėmelis · ${bits.join(" · ")}`;
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
  .filter((row) => row.supplierId !== "eventuri")
  .map((row) => {
    const { category, subcategory } = resolveManufacturerCategory(row);
    const easy = category === "accessories" || category === "detailing" || category === "interior";
    const media = bindSupplierMedia(row.sku, SKIP_IMAGE.test(row.image) ? [] : [row.image], row.title);
    return {
    id: `mfr-${row.supplierId}-${row.sku}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
    title: row.supplierId === "autoremeliai" ? plateShopTitle(row.title) : decodeHtml(row.title),
    slug: row.slug,
    description: decodeHtml(row.description),
    brand: row.brand,
    category,
    subcategory,
    price: subcategory === "plates" ? plateRetailCents(row.price) : row.price,
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
    shipping: shippingForSupplier(row.supplierId),
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
