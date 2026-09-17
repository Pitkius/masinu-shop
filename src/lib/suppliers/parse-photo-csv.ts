export type SupplierFeedFile = Record<string, { images: string[] }>;

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

/** Map a supplier reply CSV onto per-SKU image URLs. Duplicate URLs across SKUs are rejected. */
export function parseSupplierPhotoCsv(text: string): SupplierFeedFile {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return {};
  const header = splitCsvLine(lines[0]).map((item) => item.toLowerCase());
  const skuIndex = header.indexOf("sku");
  if (skuIndex < 0) throw new Error("CSV must include a sku column.");
  const imageIndexes = header
    .map((name, index) => (name.startsWith("image") ? index : -1))
    .filter((index) => index >= 0);

  const feed: SupplierFeedFile = {};
  const owner = new Map<string, string>();
  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line);
    const sku = cells[skuIndex];
    if (!sku) continue;
    const images = imageIndexes
      .map((index) => cells[index])
      .filter((src): src is string => Boolean(src));
    if (!images.length) continue;
    for (const src of images) {
      const existing = owner.get(src);
      if (existing && existing !== sku) {
        throw new Error(`Shared photo ${src} on ${existing} and ${sku}`);
      }
      owner.set(src, sku);
    }
    feed[sku] = { images: [...new Set(images)] };
  }
  return feed;
}
