import type { Product } from "@/lib/types";
import type { SupplierRecord } from "@/data/suppliers";
import { brandPhotoContacts } from "@/data/brand-contacts";

export type PhotoLetter = {
  id: string;
  kind: "supplier" | "brand";
  name: string;
  to: string | null;
  contactUrl: string | null;
  skuCount: number;
  subject: string;
  body: string;
  csvQuery: string;
};

function cell(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

export function supplierPhotoRequestCsv(products: Product[]) {
  const header = ["sku", "supplier_id", "supplier_sku", "brand", "title", "mpn", "oem", "image_1", "image_2", "image_3"];
  const lines = [header.join(",")];
  for (const product of products) {
    if (!product.supplierSku) continue;
    lines.push(
      [
        product.sku,
        product.supplierId ?? "",
        product.supplierSku,
        product.brand,
        product.title,
        product.mpn ?? "",
        product.oemNumbers[0] ?? "",
        "",
        "",
        "",
      ]
        .map((value) => cell(String(value)))
        .join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}

function skuLines(products: Product[]) {
  return products
    .map((product) => `- ${product.sku} | ${product.supplierSku ?? "—"} | ${product.title} | ${product.mpn ?? "—"}`)
    .join("\n");
}

const RULES = `Photo rules (mandatory):
1. One SKU = photos of that exact part only.
2. Studio / white-background catalog shot of the part (wholesaler style).
3. Do not reuse one photo on another SKU.
4. Do not send another vehicle, another part, lifestyle cars, or stock fillers.
5. If you have no photo, leave image_1/2/3 empty. We will show "photo not uploaded" — we will not invent one.

Please return the CSV with public image URLs filled in.`;

function letterBody(name: string, products: Product[], csvNote: string) {
  const list = products.length <= 40 ? `\nSKUs:\n${skuLines(products)}\n` : "";
  return `Hello ${name},

APEX is an EU dropship catalog (https://masinu-shop.vercel.app). We list your parts against our vehicle-fitment SKUs and need the official catalog photos for those SKUs.

${csvNote}
${list}
${RULES}

Reply with the completed CSV. Do not send a shared image pack.

Thank you,
APEX
https://masinu-shop.vercel.app`;
}

export function buildPhotoLetters(products: Product[], suppliers: SupplierRecord[]): PhotoLetter[] {
  const letters: PhotoLetter[] = [];

  for (const supplier of suppliers) {
    const rows = products.filter((product) => product.supplierId === supplier.id && product.supplierSku);
    letters.push({
      id: `supplier:${supplier.id}`,
      kind: "supplier",
      name: supplier.name,
      to: supplier.contactEmail,
      contactUrl: null,
      skuCount: rows.length,
      subject: `APEX dropship — ${rows.length} SKU catalog photos for ${supplier.name}`,
      body: letterBody(
        supplier.name,
        rows,
        `Please fill the attached CSV (${rows.length} rows) for supplier id "${supplier.id}".`,
      ),
      csvQuery: `supplier=${encodeURIComponent(supplier.id)}`,
    });
  }

  for (const contact of brandPhotoContacts) {
    const rows = products.filter((product) => product.brand === contact.brand && product.supplierSku);
    if (!rows.length) continue;
    letters.push({
      id: `brand:${contact.brand}`,
      kind: "brand",
      name: contact.brand,
      to: contact.email,
      contactUrl: contact.contactUrl,
      skuCount: rows.length,
      subject: `APEX — catalog photos for ${rows.length} ${contact.brand} SKU(s)`,
      body: letterBody(
        contact.brand,
        rows,
        `We only need photos for the ${contact.brand} SKUs below (also in the CSV).`,
      ),
      csvQuery: `brand=${encodeURIComponent(contact.brand)}`,
    });
  }

  return letters;
}

export function filterPhotoRequestProducts(products: Product[], supplierId?: string | null, brand?: string | null) {
  return products.filter((product) => {
    if (!product.supplierSku) return false;
    if (supplierId && product.supplierId !== supplierId) return false;
    if (brand && product.brand !== brand) return false;
    return true;
  });
}
