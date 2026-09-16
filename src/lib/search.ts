import { allCategories, allProducts, allVehicles } from "@/lib/catalog";
import { normalizePartNumber } from "@/lib/fitment";
import { vehicleLabel } from "@/data/vehicles";
import type { Product, SearchHit } from "@/lib/types";

function tokens(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((item) => item.length > 1);
}

function scoreProduct(product: Product, query: string) {
  const q = query.trim();
  if (!q) return 0;
  const compact = normalizePartNumber(q);
  const hay = normalizePartNumber(
    [product.title, product.sku, product.mpn, product.brand, product.ean, ...product.oemNumbers, ...product.crossReferences, ...product.tags].join(" "),
  );
  let score = 0;
  if (product.sku && normalizePartNumber(product.sku) === compact) score += 120;
  if (product.mpn && normalizePartNumber(product.mpn) === compact) score += 130;
  if (product.oemNumbers.some((n) => normalizePartNumber(n) === compact)) score += 140;
  if (product.crossReferences.some((n) => normalizePartNumber(n) === compact)) score += 90;
  if (product.title.toLowerCase() === q.toLowerCase()) score += 100;
  if (product.title.toLowerCase().includes(q.toLowerCase())) score += 40;
  if (product.brand.toLowerCase() === q.toLowerCase()) score += 30;
  for (const token of tokens(q)) {
    if (product.title.toLowerCase().includes(token)) score += 12;
    if (product.tags.some((tag) => tag.includes(token))) score += 8;
    if (product.brand.toLowerCase().includes(token)) score += 6;
    if (product.category.includes(token)) score += 6;
    if (hay.includes(token.toUpperCase())) score += 4;
  }
  return score;
}

export function searchCatalog(query: string, limit = 24) {
  const q = query.trim();
  if (!q) return { products: [] as Product[], hits: [] as SearchHit[] };

  const productHits = allProducts()
    .map((product) => ({ product, score: scoreProduct(product, q) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const vehicles = allVehicles()
    .map((vehicle) => {
      const label = vehicleLabel(vehicle);
      const blob = `${label} ${vehicle.engineCode} ${vehicle.make} ${vehicle.model} ${vehicle.generation}`.toLowerCase();
      let score = 0;
      for (const token of tokens(q)) if (blob.includes(token)) score += 10;
      if (blob.includes(q.toLowerCase())) score += 25;
      return { vehicle, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const categories = allCategories()
    .map((category) => {
      const blob = `${category.name} ${category.slug} ${category.description}`.toLowerCase();
      let score = 0;
      for (const token of tokens(q)) if (blob.includes(token)) score += 10;
      return { category, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const compact = normalizePartNumber(q);
  const partHits: SearchHit[] = [];
  if (compact.length >= 6) {
    for (const product of allProducts()) {
      const numbers = [product.sku, product.mpn, ...product.oemNumbers, ...product.crossReferences].filter(Boolean) as string[];
      for (const number of numbers) {
        if (normalizePartNumber(number).includes(compact)) {
          partHits.push({
            kind: "part",
            id: `${product.id}-${number}`,
            title: number,
            subtitle: product.title,
            href: `/part/${encodeURIComponent(normalizePartNumber(number))}`,
            score: normalizePartNumber(number) === compact ? 150 : 70,
          });
        }
      }
    }
  }

  const hits: SearchHit[] = [
    ...productHits.slice(0, 8).map(({ product, score }) => ({
      kind: "product" as const,
      id: product.id,
      title: product.title,
      subtitle: `${product.brand} · ${product.sku}`,
      href: `/product/${product.slug}`,
      score,
    })),
    ...vehicles.slice(0, 5).map(({ vehicle, score }) => ({
      kind: "vehicle" as const,
      id: vehicle.id,
      title: vehicleLabel(vehicle, false),
      subtitle: `${vehicle.engine} · ${vehicle.yearFrom}–${vehicle.yearTo}`,
      href: `/cars/${vehicle.makeSlug}/${vehicle.modelSlug}/${vehicle.generationSlug}`,
      score,
    })),
    ...categories.slice(0, 4).map(({ category, score }) => ({
      kind: "category" as const,
      id: category.slug,
      title: category.name,
      href: `/shop/${category.slug}`,
      score,
    })),
    ...partHits.sort((a, b) => b.score - a.score).slice(0, 5),
  ].sort((a, b) => b.score - a.score);

  return {
    products: productHits.slice(0, limit).map((item) => item.product),
    hits: hits.slice(0, 16),
  };
}

export function searchPartNumber(number: string) {
  const compact = normalizePartNumber(number);
  const catalog = allProducts();
  const exactMpn = catalog.filter((p) => p.mpn && normalizePartNumber(p.mpn) === compact);
  const exactOem = catalog.filter((p) => p.oemNumbers.some((n) => normalizePartNumber(n) === compact));
  const cross = catalog.filter((p) => p.crossReferences.some((n) => normalizePartNumber(n) === compact));
  const oem = [...new Map([...exactMpn, ...exactOem].map((p) => [p.id, p])).values()];
  const aftermarket = catalog.filter(
    (p) =>
      !oem.some((o) => o.id === p.id) &&
      (p.oemNumbers.some((n) => normalizePartNumber(n) === compact) || p.crossReferences.some((n) => normalizePartNumber(n) === compact) || p.tags.some((tag) => normalizePartNumber(tag) === compact)),
  );
  const compatible = catalog.filter((p) => {
    if (oem.some((o) => o.id === p.id) || aftermarket.some((o) => o.id === p.id) || cross.some((o) => o.id === p.id)) return false;
    return oem.some((o) => o.category === p.category && o.compatibility.some((fit) => p.compatibility.some((pf) => pf.vehicleId === fit.vehicleId)));
  });
  return {
    query: compact,
    oem,
    aftermarket: [...new Map([...aftermarket, ...cross.filter((p) => !oem.some((o) => o.id === p.id))].map((p) => [p.id, p])).values()],
    compatible: compatible.slice(0, 8),
  };
}
