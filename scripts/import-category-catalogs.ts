import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { classifyCatalogTitle } from "../src/lib/catalog-classify";
import { isJunkCatalogItem } from "../src/lib/apparel";
import { parseManufacturerFitment } from "../src/lib/manufacturer-fitment";

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
const SKIP_IMAGE = /giphy\.gif|placeholder|logo|sprite|1x1|blank|favicon|no[_-]?image|ProductDefault/i;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replaceAll("š", "s")
    .replaceAll("ė", "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function cleanText(value: string) {
  const decoded = value
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&#39;", "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return [...decoded]
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code >= 32 && (code < 0xd800 || code > 0xdfff);
    })
    .join("");
}

function toEurCents(price: number, currency: "EUR" | "USD") {
  if (currency === "EUR") return Math.max(99, Math.round(price * 100));
  return Math.max(99, Math.round(price * 92));
}

function imageOk(url: string) {
  return /^https?:\/\//i.test(url) && !SKIP_IMAGE.test(url);
}

function cleanSku(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "").replace(/[^A-Z0-9._-]+/g, "-").slice(0, 64);
}

async function fetchText(url: string, timeoutMs = 25000) {
  const response = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "*/*" },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(String(response.status));
  return await response.text();
}

function row(partial: Omit<ManufacturerRow, "slug" | "category" | "subcategory" | "roadLegalStatus"> & Partial<ManufacturerRow>): ManufacturerRow | null {
  const sku = cleanSku(partial.sku);
  if (!sku || sku.length < 3) return null;
  const title = cleanText(partial.title).slice(0, 140);
  if (!title) return null;
  if (isJunkCatalogItem({ ...partial, sku, title })) return null;
  const kind = classifyCatalogTitle(title, partial.subcategory);
  const fit = parseManufacturerFitment({ sku, title, description: partial.description, sourceUrl: partial.sourceUrl });
  return {
    sku,
    mpn: cleanSku(partial.mpn || sku),
    brand: partial.brand,
    supplierId: partial.supplierId,
    title,
    slug: slugify(`${partial.brand}-${sku}-${title}`),
    description: cleanText(partial.description || title).slice(0, 400),
    category: partial.category ?? kind.category,
    subcategory: partial.subcategory ?? kind.subcategory,
    price: partial.price,
    image: partial.image,
    sourceUrl: partial.sourceUrl,
    make: partial.make ?? fit.make,
    model: partial.model ?? fit.model,
    generation: partial.generation ?? fit.generation,
    yearFrom: partial.yearFrom ?? fit.yearFrom,
    yearTo: partial.yearTo ?? fit.yearTo,
    roadLegalStatus: partial.roadLegalStatus ?? "UNKNOWN",
  };
}

type Shop = {
  name: string;
  supplierId: string;
  brand: string;
  base: string;
  currency: "EUR" | "USD";
  limit: number;
  category: string;
  subcategory: string;
  keep?: (title: string, type: string) => boolean;
};

const shops: Shop[] = [
  { name: "maxton", supplierId: "maxton", brand: "Maxton Design", base: "https://www.maxtondesign.com", currency: "EUR", limit: 350, category: "exterior", subcategory: "aero", keep: (title, type) => /spoiler|diffuser|splitter|skirt|lip|valance|bumper|grille|aero|body/.test(`${title} ${type}`.toLowerCase()) },
  { name: "alpharex", supplierId: "alpharex", brand: "AlphaRex", base: "https://www.alpharexusa.com", currency: "USD", limit: 180, category: "lighting", subcategory: "headlights", keep: (title, type) => /light|nova|luxx|prohal/.test(`${title} ${type}`.toLowerCase()) },
  { name: "fifteen52", supplierId: "fifteen52", brand: "Fifteen52", base: "https://www.fifteen52.com", currency: "USD", limit: 90, category: "wheels", subcategory: "wheels", keep: (title, type) => /wheel/.test(`${title} ${type}`.toLowerCase()) },
  { name: "method", supplierId: "method", brand: "Method Race Wheels", base: "https://www.methodracewheels.com", currency: "USD", limit: 90, category: "wheels", subcategory: "wheels", keep: (title, type) => /wheel|bead/.test(`${title} ${type}`.toLowerCase()) && !/markdown/.test(title.toLowerCase()) },
  { name: "konig", supplierId: "konig", brand: "Konig", base: "https://www.konigwheels.com", currency: "USD", limit: 80, category: "wheels", subcategory: "wheels", keep: (title, type) => /wheel/.test(`${title} ${type}`.toLowerCase()) },
  { name: "vors", supplierId: "vors", brand: "Vors", base: "https://www.vorswheels.com", currency: "USD", limit: 70, category: "wheels", subcategory: "wheels", keep: (title, type) => /wheel/.test(`${title} ${type}`.toLowerCase()) },
  { name: "chemicalguys", supplierId: "chemical-guys", brand: "Chemical Guys", base: "https://chemicalguys.com", currency: "USD", limit: 140, category: "detailing", subcategory: "care", keep: (title, type) => /wax|polish|shampoo|coating|clean|detail|compound|towel|odor|kit|soap|dressing/.test(`${title} ${type}`.toLowerCase()) },
  { name: "gledring", supplierId: "gledring", brand: "Gledring", base: "https://gledringusa.com", currency: "USD", limit: 220, category: "interior", subcategory: "mats", keep: (title, type) => /mat|cargo|kidmat|roof/.test(`${title} ${type}`.toLowerCase()) },
  { name: "vantrue", supplierId: "vantrue", brand: "Vantrue", base: "https://www.vantrue.com", currency: "USD", limit: 40, category: "electronics", subcategory: "dashcam", keep: (title, type) => /dash|cam|n4|n2|e1|s1/.test(`${title} ${type}`.toLowerCase()) && !/bundle/.test(title.toLowerCase()) },
  { name: "blackvue", supplierId: "blackvue", brand: "BlackVue", base: "https://www.blackvue.com", currency: "USD", limit: 40, category: "electronics", subcategory: "dashcam", keep: (title, type) => /dash|cam|elite|dr\d/.test(`${title} ${type}`.toLowerCase()) },
  { name: "aeroflow", supplierId: "aeroflow", brand: "Aeroflow Dynamics", base: "https://www.aeroflowdynamics.com", currency: "USD", limit: 160, category: "exterior", subcategory: "aero", keep: (title, type) => /spoiler|diffuser|skirt|lip|bumper|splitter|wing/.test(`${title} ${type}`.toLowerCase()) },
  { name: "apr", supplierId: "apr-performance", brand: "APR Performance", base: "https://www.aprperformance.com", currency: "USD", limit: 80, category: "exterior", subcategory: "aero", keep: (title, type) => /lip|spoiler|aero|wing|diffuser|kit/.test(`${title} ${type}`.toLowerCase()) },
  { name: "ksp", supplierId: "ksp", brand: "KSP Performance", base: "https://www.kspperformance.com", currency: "USD", limit: 80, category: "suspension", subcategory: "chassis", keep: (title, type) => /coilover|shock|strut|lowering spring|control arm/.test(`${title} ${type}`.toLowerCase()) },
];

async function shopify(shop: Shop, usedSku: Set<string>, usedImg: Set<string>): Promise<ManufacturerRow[]> {
  const rows: ManufacturerRow[] = [];
  for (let page = 1; page <= 12 && rows.length < shop.limit; page++) {
    const text = await fetchText(`${shop.base}/products.json?limit=250&page=${page}`);
    const json = JSON.parse(text) as {
      products: Array<{
        title: string;
        handle: string;
        body_html?: string;
        product_type?: string;
        images?: Array<{ src: string }>;
        variants?: Array<{ sku?: string; price?: string }>;
      }>;
    };
    if (!json.products?.length) break;
    for (const product of json.products) {
      if (rows.length >= shop.limit) break;
      const type = product.product_type ?? "";
      if (shop.keep && !shop.keep(product.title, type)) continue;
      const rawSku = product.variants?.[0]?.sku || product.handle;
      const image = product.images?.[0]?.src;
      const price = Number(product.variants?.[0]?.price ?? 0);
      if (!rawSku || !image || price <= 0) continue;
      if (!imageOk(image)) continue;
      const sku = cleanSku(rawSku);
      const img = image.split("?")[0];
      if (usedSku.has(sku) || usedImg.has(img)) continue;
      const item = row({
        sku,
        mpn: sku,
        brand: shop.brand,
        supplierId: shop.supplierId,
        title: product.title,
        description: product.body_html ?? product.title,
        price: toEurCents(price, shop.currency),
        image,
        sourceUrl: `${shop.base}/products/${product.handle}`,
        category: shop.category,
        subcategory: shop.subcategory,
      });
      if (!item) continue;
      usedSku.add(item.sku);
      usedImg.add(img);
      rows.push(item);
    }
    console.log(`${shop.name} page ${page} kept ${rows.length}`);
  }
  return rows;
}

function webautoScore(url: string) {
  const path = url.toLowerCase();
  let score = 0;
  if (/lietuva/.test(path)) score += 12;
  if (/be-uzraso|r3-3001|r1-1001|r6-0001|r9-0001|twin-fix/.test(path)) score += 11;
  if (/vilnius|kaunas|klaipeda|siauliai|panevezys/.test(path)) score += 8;
  if (/chrom|metal/.test(path)) score += 6;
  if (/centravimo|zied/.test(path)) score += 5;
  return score;
}

function webautoSku(href: string, title: string) {
  const fromTitle = title.match(/\b(R-?\d+(?:-\d+)?|R3-\d+|GL-\d+|WURTH[- ]?[A-Z0-9-]+)\b/i)?.[1];
  const fromHref = href.match(/\b(r\d+-\d+|r3-\d+)\b/i)?.[1];
  return cleanSku(fromTitle || fromHref || href.replace(/\/product\/|\/$/g, "").slice(0, 40));
}

async function webauto(usedSku: Set<string>, usedImg: Set<string>): Promise<ManufacturerRow[]> {
  const xml = await fetchText("https://webauto.lt/sitemap-shop.xml", 40000);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const productUrls = locs
    .filter((url) => {
      const path = url.toLowerCase();
      if (!path.includes("/product/")) return false;
      if (/savisrieg|din7981|sraigtas/.test(path)) return false;
      return /remel|ramka|lietuva|numer|centravimo|zied|twin-fix|gaubtel|r3-|r1-|r6-|r9-|r-3|r-1/.test(path);
    })
    .sort((a, b) => webautoScore(b) - webautoScore(a))
    .slice(0, 120);
  console.log(`webauto product urls ${productUrls.length}`);
  const rows: ManufacturerRow[] = [];
  let cursor = 0;
  async function worker() {
    while (cursor < productUrls.length && rows.length < 110) {
      const url = productUrls[cursor++];
      try {
        const html = await fetchText(url, 20000);
        const title =
          html.match(/<h1[^>]*class="product-name"[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
          ?? "";
        const skuHint = html.match(/<span class="hint" itemprop="name">([^<]+)<\/span>/)?.[1] ?? "";
        const price = Number(html.match(/itemprop="price"\s+content="([0-9.]+)"/)?.[1] ?? 0);
        let image = html.match(/property="og:image" content="([^"]+)"/)?.[1] ?? "";
        if (!title || !image || price <= 0) continue;
        if (image.startsWith("/")) image = `https://webauto.lt${image}`;
        const sku = webautoSku(url, `${skuHint} ${title}`);
        const img = image.split("?")[0];
        if (!imageOk(image) || usedSku.has(sku) || usedImg.has(img)) continue;
        const wurth = /wurth|würth/i.test(title);
        const hub = /centravimo|žied|zied|gaubtel/i.test(`${url} ${title}`);
        const item = row({
          sku,
          mpn: sku,
          brand: wurth ? "Würth" : "Autoremeliai",
          supplierId: wurth ? "wurth" : "autoremeliai",
          title,
          description: title,
          price: toEurCents(price, "EUR"),
          image,
          sourceUrl: url,
          category: hub ? "wheels" : "accessories",
          subcategory: hub ? "hardware" : "plates",
        });
        if (!item) continue;
        usedSku.add(item.sku);
        usedImg.add(img);
        rows.push(item);
      } catch {
        /* skip */
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, () => worker()));
  console.log(`webauto kept ${rows.length}`);
  return rows;
}

function merge(existing: ManufacturerRow[], extra: ManufacturerRow[]) {
  const sku = new Set<string>();
  const img = new Set<string>();
  const out: ManufacturerRow[] = [];
  for (const item of [...extra, ...existing]) {
    if (isJunkCatalogItem(item)) continue;
    const key = item.sku.toUpperCase();
    const image = item.image.split("?")[0];
    if (sku.has(key) || img.has(image)) continue;
    sku.add(key);
    img.add(image);
    const kind = classifyCatalogTitle(item.title, item.subcategory);
    out.push({
      ...item,
      category: item.category === "electronics" && kind.category === "accessories" ? kind.category : item.category,
      subcategory: item.subcategory === "ecu" && kind.subcategory === "plates" ? kind.subcategory : item.subcategory,
    });
  }
  return { out, sku, img };
}

async function main() {
  const existing = JSON.parse(readFileSync(OUT, "utf8")) as ManufacturerRow[];
  const { out, sku, img } = merge(existing, []);
  console.log(`existing kept ${out.length}`);
  const extra: ManufacturerRow[] = [];
  for (const shop of shops) {
    try {
      extra.push(...(await shopify(shop, sku, img)));
    } catch (error) {
      console.log(`${shop.name} fail ${(error as Error).message}`);
    }
  }
  extra.push(...(await webauto(sku, img)));
  const merged = merge(existing, extra);
  writeFileSync(OUT, `${JSON.stringify(merged.out, null, 2)}\n`);
  const by: Record<string, number> = {};
  for (const item of merged.out) by[item.category] = (by[item.category] || 0) + 1;
  console.log(`wrote ${merged.out.length}`, by);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
