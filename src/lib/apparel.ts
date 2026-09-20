export function isApparelMerch(input: {
  sku?: string;
  mpn?: string;
  title?: string;
  slug?: string;
  sourceUrl?: string;
  image?: string;
  brand?: string;
}) {
  const hay = [input.sku, input.mpn, input.title, input.slug, input.sourceUrl, input.image, input.brand]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return /\b(hoodie|hoodies|t-?shirts?|sweatshirts?|pullovers?|snapbacks?|beanies?|apparel|clothing)\b/.test(hay)
    || /short-sleeve|long-sleeve|tee-shirt/.test(hay)
    || /(?:^|[\s/_-])(tee|hood)(?:$|[\s/_-])/.test(hay);
}

/** Turbo-brand merch and novelty frames, not real EU 520x110 plates people fit on a car. */
export function isJunkCatalogItem(input: {
  sku?: string;
  mpn?: string;
  title?: string;
  slug?: string;
  sourceUrl?: string;
  image?: string;
  brand?: string;
  price?: number;
}) {
  if (isApparelMerch(input)) return true;
  const hay = [input.sku, input.mpn, input.title, input.slug, input.sourceUrl, input.brand]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (/\b(enamel pin|sticker set|optional sticker|gift card|item fee)\b/.test(hay)) return true;
  if (/license.?plate/.test(hay) && /pure.?turbo/.test(hay)) return true;
  if (input.sku?.toUpperCase() === "LICENSE-PLATE-FRAME-SET") return true;
  if (/license.?plate.?frame/.test(hay) && (input.price ?? 0) >= 50000) return true;
  return false;
}
