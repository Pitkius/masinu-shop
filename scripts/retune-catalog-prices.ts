import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { eventuriStreetEur, retailEurCents } from "../src/lib/retail-price";

throw new Error("retune-catalog-prices.ts already applied 2026-09-20 — reimport from source, do not run again");

type Row = {
  sku: string;
  supplierId: string;
  title: string;
  price: number;
  [key: string]: unknown;
};

const OUT = resolve("src/data/manufacturer-catalog.json");

const USD_AS_EUR = new Set(["vrsf", "csf", "pure-turbos"]);
const USD_TIMES_92 = new Set([
  "alpharex",
  "fifteen52",
  "method",
  "konig",
  "vors",
  "chemical-guys",
  "gledring",
  "vantrue",
  "blackvue",
  "aeroflow",
  "apr-performance",
  "ksp",
]);
const EUR_LIST = new Set(["maxton", "autoremeliai", "wurth"]);

function retune(row: Row) {
  const id = row.supplierId;
  if (id === "milltek") {
    const gbp = row.price <= 2900 ? 8.33 : row.price / 117;
    return retailEurCents(gbp, "GBP");
  }
  if (id === "eventuri") {
    return retailEurCents(eventuriStreetEur(row.title), "EUR");
  }
  if (USD_AS_EUR.has(id)) {
    return retailEurCents(row.price / 100, "USD");
  }
  if (USD_TIMES_92.has(id)) {
    return retailEurCents(row.price / 92, "USD");
  }
  if (EUR_LIST.has(id)) {
    return retailEurCents(row.price / 100, "EUR");
  }
  return retailEurCents(row.price / 100, "EUR");
}

const rows = JSON.parse(readFileSync(OUT, "utf8")) as Row[];
const before = new Map<string, { n: number; sum: number }>();
const after = new Map<string, { n: number; sum: number }>();
for (const row of rows) {
  const prev = before.get(row.supplierId) ?? { n: 0, sum: 0 };
  prev.n += 1;
  prev.sum += row.price;
  before.set(row.supplierId, prev);
  row.price = retune(row);
  const next = after.get(row.supplierId) ?? { n: 0, sum: 0 };
  next.n += 1;
  next.sum += row.price;
  after.set(row.supplierId, next);
}
writeFileSync(OUT, `${JSON.stringify(rows, null, 2)}\n`);
console.log("retuned", rows.length);
for (const [id, a] of [...after.entries()].sort((x, y) => y[1].n - x[1].n)) {
  const b = before.get(id)!;
  const from = Math.round(b.sum / b.n / 100);
  const to = Math.round(a.sum / a.n / 100);
  const delta = Math.round(((to - from) / Math.max(1, from)) * 100);
  console.log(`${id.padEnd(18)} n=${String(a.n).padStart(4)}  €${from} → €${to}  (${delta > 0 ? "+" : ""}${delta}%)`);
}
