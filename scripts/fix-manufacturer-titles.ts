import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const path = resolve("src/data/manufacturer-catalog.json");
const rows = JSON.parse(readFileSync(path, "utf8")) as Array<Record<string, unknown>>;

const MAKES: Array<{ match: RegExp; make: string }> = [
  { match: /\baudi\b/i, make: "Audi" },
  { match: /\bvolkswagen\b|\bvw\b/i, make: "Volkswagen" },
  { match: /\bseat\b/i, make: "SEAT" },
  { match: /\bskoda\b/i, make: "Škoda" },
  { match: /\bcupra\b/i, make: "Cupra" },
  { match: /\bbmw\b/i, make: "BMW" },
  { match: /\bmercedes/i, make: "Mercedes-Benz" },
  { match: /\bford\b/i, make: "Ford" },
  { match: /\bporsche\b/i, make: "Porsche" },
  { match: /\bmini\b/i, make: "MINI" },
  { match: /\btoyota\b|\btacoma\b/i, make: "Toyota" },
  { match: /\bhonda\b/i, make: "Honda" },
  { match: /\bhyundai\b/i, make: "Hyundai" },
  { match: /\bkia\b/i, make: "Kia" },
  { match: /\bvolvo\b/i, make: "Volvo" },
  { match: /\bnissan\b/i, make: "Nissan" },
  { match: /\bmazda\b/i, make: "Mazda" },
  { match: /\bsubaru\b/i, make: "Subaru" },
  { match: /\bpeugeot\b/i, make: "Peugeot" },
  { match: /\brenaul/i, make: "Renault" },
  { match: /\bjaguar\b/i, make: "Jaguar" },
  { match: /\blexus\b/i, make: "Lexus" },
  { match: /\bjeep\b/i, make: "Jeep" },
  { match: /\bferrari\b/i, make: "Ferrari" },
  { match: /\blamborghini\b/i, make: "Lamborghini" },
];

function classify(title: string) {
  const t = title.toLowerCase();
  if (t.includes("downpipe") || t.includes("de-cat") || t.includes("decat") || t.includes("cat replacement")) {
    return { category: "exhaust", subcategory: "downpipes" };
  }
  if (t.includes("cat-back") || t.includes("gpf") || t.includes("opf") || t.includes("particulate") || t.includes("resonated")) {
    return { category: "exhaust", subcategory: "catback" };
  }
  if (t.includes("exhaust") || t.includes("silencer") || t.includes("full system")) {
    return { category: "exhaust", subcategory: "systems" };
  }
  if (t.includes("intercooler") || t.includes("radiator") || t.includes("cooler")) return { category: "engine", subcategory: "cooling" };
  if (t.includes("intake") || t.includes("inlet") || t.includes("airbox")) return { category: "engine", subcategory: "intakes" };
  if (t.includes("turbo")) return { category: "performance", subcategory: "turbos" };
  return { category: "exhaust", subcategory: "systems" };
}

function titleFromUrl(url: string, sku: string) {
  const last = url.split("/").filter(Boolean).at(-1) ?? "";
  return last
    .replace(new RegExp(`-?${sku}$`, "i"), "")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replaceAll("š", "s")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

function cap(value: string) {
  return value.replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

let milltekFixed = 0;
for (const row of rows) {
  const sku = String(row.sku);
  if (row.brand === "Milltek" && (String(row.title) === "Milltek" || String(row.title).length < 12)) {
    const next = titleFromUrl(String(row.sourceUrl), sku);
    if (next) {
      row.title = cap(next);
      row.description = `${row.title}. Official Milltek Sport catalog photo for ${sku}.`;
      milltekFixed += 1;
    }
  }
  if (String(row.description) === "Your Trusted Partner" || String(row.description) === "Milltek") {
    row.description = `${row.brand} ${row.title}. Official manufacturer catalog photo for ${sku}.`;
  }
  const kind = classify(`${row.title} ${row.sourceUrl}`);
  if (row.brand === "Milltek" || row.brand === "Eventuri") {
    row.category = kind.category;
    row.subcategory = kind.subcategory;
  }
  const blob = `${row.title} ${row.sourceUrl}`;
  const found = MAKES.find((item) => item.match.test(blob));
  if (found && !row.make) row.make = found.make;
  const gen = blob.match(/\b(mk\s?\d+(?:\.\d)?|[bcfgwe]\d{2}|c[5-8]|8[njpvsy])\b/i)?.[1];
  if (gen && !row.generation) row.generation = gen.replace(/\s+/g, "");
  if (typeof row.yearFrom === "number" && typeof row.yearTo === "number" && row.yearFrom > row.yearTo) {
    const swap = row.yearFrom;
    row.yearFrom = row.yearTo;
    row.yearTo = swap;
  }
  row.slug = slugify(`${row.brand}-${sku}-${row.title}`);
}

const slugs = new Set<string>();
for (const row of rows) {
  let slug = String(row.slug);
  if (slugs.has(slug)) slug = `${slug}-${String(row.sku).toLowerCase()}`;
  slugs.add(slug);
  row.slug = slug;
}

writeFileSync(path, `${JSON.stringify(rows, null, 2)}\n`);
console.log(`fixed milltek titles ${milltekFixed}, rows ${rows.length}`);
