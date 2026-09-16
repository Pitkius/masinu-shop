function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/style|look|front|grill[e]?|audi|bmw|mercedes|for/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export type CanonicalCandidate = {
  supplierTitle: string;
  productTitle: string;
  productId: string;
  confidence: number;
};

export function canonicalConfidence(supplierTitle: string, productTitle: string) {
  const a = new Set(normalizeTitle(supplierTitle).split(" ").filter(Boolean));
  const b = new Set(normalizeTitle(productTitle).split(" ").filter(Boolean));
  if (!a.size || !b.size) return 0;
  let overlap = 0;
  for (const token of a) if (b.has(token)) overlap += 1;
  return overlap / Math.max(a.size, b.size);
}

export function suggestCanonical(supplierTitle: string, catalog: { id: string; title: string }[]): CanonicalCandidate[] {
  return catalog
    .map((product) => ({
      supplierTitle,
      productTitle: product.title,
      productId: product.id,
      confidence: canonicalConfidence(supplierTitle, product.title),
    }))
    .filter((item) => item.confidence >= 0.35)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}
