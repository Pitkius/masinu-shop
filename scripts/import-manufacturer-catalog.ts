import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseManufacturerFitment } from "../src/lib/manufacturer-fitment";
import { isApparelMerch } from "../src/lib/apparel";

type ManufacturerRow = {
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
  roadLegalStatus?: "ROAD_LEGAL" | "TRACK_ONLY" | "UNKNOWN";
};

const UA = "Mozilla/5.0 (compatible; APEX-catalog/1.0; +https://masinu-shop.vercel.app)";
const OUT = resolve("src/data/manufacturer-catalog.json");

const SKIP_IMAGE = /giphy\.gif|placeholder|logo|sprite|1x1|blank|favicon|no[_-]?image/i;

const existing = new Set(
  [
    "SSXVW395",
    "200001085",
    "3521000B",
    "EVE-C7RS6-CF-INT",
    "VRSF-N54-DP",
    "54-11472",
    "7045",
    "bmw-n54-pure-stage-2",
    "EVT-C7-RS6",
    "MLT-MK7-GTI",
    "KW-C7-V2",
    "WGN-C7-IC",
    "VRSF-E92-N54",
    "VRSF-N54-IC",
    "AFE-N54",
    "CSF-N54",
    "PURE-N54-H22",
  ].map((value) => value.toUpperCase()),
);

function slugify(value: string) {
  return value
    .toLowerCase()
    .replaceAll("š", "s")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function decode(value: string) {
  return value.replaceAll("&amp;", "&").replaceAll("\\/", "/").replaceAll("\\u002f", "/");
}

function classify(title: string): { category: string; subcategory: string } {
  const t = title.toLowerCase();
  if (t.includes("downpipe") || t.includes("de-cat") || t.includes("decat")) return { category: "exhaust", subcategory: "downpipes" };
  if (t.includes("cat-back") || t.includes("gpf-back") || t.includes("opf-back") || t.includes("cat back")) return { category: "exhaust", subcategory: "catback" };
  if (t.includes("exhaust") || t.includes("silencer")) return { category: "exhaust", subcategory: "systems" };
  if (t.includes("intercooler") || t.includes("radiator") || t.includes("cooler")) return { category: "engine", subcategory: "cooling" };
  if (t.includes("intake") || t.includes("airbox")) return { category: "engine", subcategory: "intakes" };
  if (t.includes("coilover") || t.includes("suspension")) return { category: "suspension", subcategory: "coilovers" };
  if (t.includes("turbo")) return { category: "performance", subcategory: "turbos" };
  if (t.includes("brake") || t.includes("disc") || t.includes("pad")) return { category: "brakes", subcategory: "discs" };
  if (t.includes("tune") || t.includes("flash") || t.includes("license")) return { category: "electronics", subcategory: "ecu" };
  return { category: "performance", subcategory: "hardware" };
}

function legal(title: string): ManufacturerRow["roadLegalStatus"] {
  const t = title.toLowerCase();
  if (t.includes("ec approved") || t.includes("e-mark")) return "ROAD_LEGAL";
  if (t.includes("de-cat") || t.includes("decat") || t.includes("race") || t.includes("track") || t.includes("motorsport")) return "TRACK_ONLY";
  return "UNKNOWN";
}

function imageOk(url: string) {
  return /^https?:\/\//i.test(url) && !SKIP_IMAGE.test(url);
}

async function fetchText(url: string, timeoutMs = 25000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { headers: { "User-Agent": UA, Accept: "*/*" }, signal: controller.signal });
    if (!response.ok) throw new Error(String(response.status));
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

async function pool<T, R>(items: T[], size: number, fn: (item: T, index: number) => Promise<R>) {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      out[index] = await fn(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, worker));
  return out;
}

function takeJsonLd(html: string) {
  const sku = html.match(/"sku"\s*:\s*"([^"]+)"/)?.[1];
  const mpn = html.match(/"mpn"\s*:\s*"([^"]+)"/)?.[1];
  const image = html.match(/"image"\s*:\s*"(https:[^"]+)"/)?.[1];
  const name = html.match(/"@type"\s*:\s*"Product"[\s\S]{0,800}"name"\s*:\s*"([^"]+)"/)?.[1]
    ?? html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1];
  const price = html.match(/"price"\s*:\s*"?([0-9.]+)"?/)?.[1];
  const description = html.match(/"description"\s*:\s*"([^"]{20,400})"/)?.[1];
  return {
    sku: sku ? decode(sku) : undefined,
    mpn: mpn ? decode(mpn) : undefined,
    image: image ? decode(image) : undefined,
    name: name ? decode(name).replace(/\\u0026/g, "&").replace(/\\"/g, '"') : undefined,
    price: price ? Number(price) : undefined,
    description: description ? decode(description).replaceAll("\\n", " ") : undefined,
  };
}

function accept(sku: string, image: string, usedSku: Set<string>, usedImg: Set<string>) {
  const key = sku.toUpperCase();
  const img = image.split("?")[0];
  if (existing.has(key) || usedSku.has(key) || usedImg.has(img) || usedImg.has(image)) return false;
  if (!imageOk(image)) return false;
  return true;
}

function row(partial: Omit<ManufacturerRow, "slug" | "category" | "subcategory" | "roadLegalStatus"> & Partial<ManufacturerRow>): ManufacturerRow | null {
  const sku = partial.sku.trim().toUpperCase().replace(/\s+/g, "");
  if (!sku || sku.length < 3) return null;
  const title = partial.title.trim();
  if (!title) return null;
  if (isApparelMerch({ sku, title, sourceUrl: partial.sourceUrl, mpn: partial.mpn })) return null;
  const kind = classify(title);
  const fit = parseManufacturerFitment({
    sku,
    title,
    description: partial.description,
    sourceUrl: partial.sourceUrl,
  });
  return {
    sku,
    mpn: (partial.mpn || sku).trim(),
    brand: partial.brand,
    supplierId: partial.supplierId,
    title: title.slice(0, 140),
    slug: slugify(`${partial.brand}-${sku}-${title}`),
    description: (partial.description || title).slice(0, 400),
    category: partial.category ?? kind.category,
    subcategory: partial.subcategory ?? kind.subcategory,
    price: Math.max(2900, Math.round(partial.price)),
    image: partial.image,
    sourceUrl: partial.sourceUrl,
    make: partial.make ?? fit.make,
    model: partial.model ?? fit.model,
    generation: partial.generation ?? fit.generation,
    yearFrom: partial.yearFrom ?? fit.yearFrom,
    yearTo: partial.yearTo ?? fit.yearTo,
    roadLegalStatus: partial.roadLegalStatus ?? legal(title),
  };
}

async function milltek(): Promise<ManufacturerRow[]> {
  const xml = await fetchText("https://milltekshop.com/xmlsitemap.php?type=products&page=1", 60000);
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1])).filter((url) => /ssx/i.test(url));
  console.log(`milltek urls ${urls.length}`);
  const usedSku = new Set<string>();
  const usedImg = new Set<string>();
  const rows: ManufacturerRow[] = [];
  await pool(urls, 8, async (url, index) => {
    try {
      const html = await fetchText(url);
      const parsed = takeJsonLd(html);
      const rawSku = (parsed.mpn || parsed.sku || url.match(/(ssx[a-z0-9]+)/i)?.[1] || "").replace(/_\d+$/, "");
      const image = parsed.image;
      if (!parsed.name || !image || !rawSku) return;
      if (!accept(rawSku, image, usedSku, usedImg)) return;
      const item = row({
        sku: rawSku,
        mpn: parsed.mpn || rawSku,
        brand: "Milltek",
        supplierId: "milltek",
        title: parsed.name,
        description: parsed.description ?? parsed.name,
        price: (parsed.price ?? 499) * 117,
        image,
        sourceUrl: url,
      });
      if (!item) return;
      usedSku.add(item.sku);
      usedImg.add(item.image.split("?")[0]);
      rows.push(item);
    } catch {
      /* skip failed page */
    }
    if ((index + 1) % 200 === 0) console.log(`milltek ${index + 1}/${urls.length} kept ${rows.length}`);
  });
  return rows;
}

async function sitemapBrand(name: string, supplierId: string, sitemap: string, brand: string): Promise<ManufacturerRow[]> {
  const xml = await fetchText(sitemap, 60000);
  const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
  console.log(`${name} urls ${blocks.length}`);
  const usedSku = new Set<string>();
  const usedImg = new Set<string>();
  const rows: ManufacturerRow[] = [];
  const pages = blocks
    .map((block) => {
      const loc = decode(block.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? "");
      const images = [...block.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)]
        .map((match) => decode(match[1]))
        .filter(imageOk);
      return loc && images[0] ? { loc, image: images[0] } : null;
    })
    .filter((item): item is { loc: string; image: string } => Boolean(item));

  await pool(pages, 6, async ({ loc, image }, index) => {
    try {
      const html = await fetchText(loc);
      const parsed = takeJsonLd(html);
      const slug = loc.replace(/\/$/, "").split("/").at(-1) ?? "";
      const sku = (parsed.mpn || parsed.sku || slug).toUpperCase();
      const title = parsed.name || slug.replaceAll("-", " ");
      if (!accept(sku, image, usedSku, usedImg)) return;
      const item = row({
        sku,
        mpn: parsed.mpn || sku,
        brand,
        supplierId,
        title,
        description: parsed.description ?? title,
        price: (parsed.price ?? 399) * 100,
        image,
        sourceUrl: loc,
      });
      if (!item) return;
      usedSku.add(item.sku);
      usedImg.add(item.image.split("?")[0]);
      rows.push(item);
    } catch {
      /* skip */
    }
    if ((index + 1) % 40 === 0) console.log(`${name} ${index + 1}/${pages.length} kept ${rows.length}`);
  });
  return rows;
}

async function shopify(name: string, supplierId: string, brand: string, base: string): Promise<ManufacturerRow[]> {
  const usedSku = new Set<string>();
  const usedImg = new Set<string>();
  const rows: ManufacturerRow[] = [];
  for (let page = 1; page <= 20; page++) {
    const text = await fetchText(`${base}/products.json?limit=250&page=${page}`);
    const json = JSON.parse(text) as {
      products: Array<{
        title: string;
        handle: string;
        body_html?: string;
        images?: Array<{ src: string }>;
        variants?: Array<{ sku?: string; price?: string }>;
      }>;
    };
    if (!json.products?.length) break;
    for (const product of json.products) {
      const sku = product.variants?.[0]?.sku || product.handle;
      const image = product.images?.[0]?.src;
      const price = Number(product.variants?.[0]?.price ?? 0);
      if (!sku || !image) continue;
      if (!accept(sku, image, usedSku, usedImg)) continue;
      const item = row({
        sku,
        mpn: sku,
        brand,
        supplierId,
        title: product.title,
        description: (product.body_html ?? product.title).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
        price: price > 20 ? price * 100 : price * 10000,
        image,
        sourceUrl: `${base}/products/${product.handle}`,
      });
      if (!item) continue;
      usedSku.add(item.sku);
      usedImg.add(item.image.split("?")[0]);
      rows.push(item);
    }
    console.log(`${name} page ${page} kept ${rows.length}`);
  }
  return rows;
}

async function main() {
  const milltekRows = await milltek();
  const eventuriRows = await sitemapBrand("eventuri", "eventuri", "https://www.eventuri.net/product-sitemap.xml", "Eventuri");
  const vrsfRows = await sitemapBrand("vrsf", "vrsf", "https://www.vr-speed.com/product-sitemap.xml", "VRSF");
  const csfRows = await shopify("csf", "csf", "CSF", "https://csfrace.com");
  const pureRows = await shopify("pure", "pure-turbos", "Pure Turbos", "https://pureturbos.com");
  const all: ManufacturerRow[] = [];
  const sku = new Set<string>();
  const img = new Set<string>();
  for (const item of [...milltekRows, ...eventuriRows, ...vrsfRows, ...csfRows, ...pureRows]) {
    const key = item.sku.toUpperCase();
    const image = item.image.split("?")[0];
    if (sku.has(key) || img.has(image) || existing.has(key)) continue;
    sku.add(key);
    img.add(image);
    all.push(item);
  }
  writeFileSync(OUT, `${JSON.stringify(all, null, 2)}\n`);
  console.log(`wrote ${all.length} unique manufacturer SKUs`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
