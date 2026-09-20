export function isApparelMerch(input: {
  sku?: string;
  mpn?: string;
  title?: string;
  slug?: string;
  sourceUrl?: string;
  image?: string;
}) {
  const hay = [input.sku, input.mpn, input.title, input.slug, input.sourceUrl, input.image]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return /\b(hoodie|hoodies|t-?shirts?|sweatshirts?|pullovers?|snapbacks?|beanies?|apparel|clothing)\b/.test(hay)
    || /short-sleeve|long-sleeve|tee-shirt/.test(hay)
    || /(?:^|[\s/_-])(tee|hood)(?:$|[\s/_-])/.test(hay);
}
