import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseSupplierPhotoCsv } from "../src/lib/suppliers/parse-photo-csv";

const input = process.argv[2];
if (!input) {
  console.error("Usage: npx tsx scripts/import-supplier-photos.ts <supplier-reply.csv>");
  process.exit(1);
}

const csv = readFileSync(resolve(input), "utf8");
const feed = parseSupplierPhotoCsv(csv);
const out = resolve("src/data/supplier-feed.json");
writeFileSync(out, `${JSON.stringify(feed, null, 2)}\n`);
console.log(`Wrote ${Object.keys(feed).length} SKUs to ${out}`);
