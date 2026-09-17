import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { products } from "../src/data/products";
import { suppliers } from "../src/data/suppliers";
import { buildPhotoLetters, filterPhotoRequestProducts, supplierPhotoRequestCsv } from "../src/lib/suppliers/photo-request";

const outDir = resolve("supplier-outbox");
mkdirSync(outDir, { recursive: true });

const letters = buildPhotoLetters(products, suppliers);
for (const letter of letters) {
  const slug = letter.id.replaceAll(":", "-").replaceAll(" ", "-");
  const params = new URLSearchParams(letter.csvQuery);
  const rows = filterPhotoRequestProducts(products, params.get("supplier"), params.get("brand"));
  writeFileSync(
    resolve(outDir, `${slug}.txt`),
    `To: ${letter.to ?? "(no inbox — use contact form)"}\nContact: ${letter.contactUrl ?? "—"}\nSubject: ${letter.subject}\nSKUs: ${letter.skuCount}\n\n${letter.body}\n`,
  );
  writeFileSync(resolve(outDir, `${slug}.csv`), supplierPhotoRequestCsv(rows));
}

writeFileSync(
  resolve(outDir, "index.txt"),
  letters.map((letter) => `${letter.id}\t${letter.to ?? "NO-EMAIL"}\t${letter.skuCount}\t${letter.subject}`).join("\n") + "\n",
);

console.log(`Wrote ${letters.length} letters to ${outDir}`);
