/** ECB-approx FX, Sep 2026: 1 USD ≈ €0.87, 1 GBP ≈ €1.165. */
export const FX_TO_EUR = {
  EUR: 1,
  GBP: 1.165,
  USD: 0.87,
} as const;

export type PriceCurrency = keyof typeof FX_TO_EUR;

export type ShippingQuote = {
  origin: string;
  timeFromDays: number;
  timeToDays: number;
  costCents: number;
};

/** Covers Stripe (~1.5%), handling, and a small profit on EU/UK list. Not US landed cost. */
export const RETAIL_MARKUP = 1.06;

const US_HEAVY = new Set(["csf", "pure-turbos", "vrsf", "apr-performance", "nostrum"]);
const US_LIGHT = new Set([
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
  "ksp",
  "afe",
]);

export function retailEurCents(amount: number, currency: PriceCurrency) {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.max(99, Math.round(amount * FX_TO_EUR[currency] * 100 * RETAIL_MARKUP));
}

/** Number plates: 18% over source, at least +€5, floor €6.90, priced at x.90. Stripe would eat a €1.74 list. */
export function plateRetailCents(sourceCents: number) {
  if (!Number.isFinite(sourceCents) || sourceCents <= 0) return 0;
  const raw = Math.max(Math.round(sourceCents * 1.18), sourceCents + 500, 690);
  const euros = Math.ceil(raw / 100);
  return Math.max(690, euros * 100 - 10);
}

/** Eventuri.net has no public prices. Do not sell catalog rows priced only by this guess. */
export function eventuriStreetEur(title: string) {
  const t = title.toLowerCase();
  if (/filter|replacement panel/.test(t)) return 155;
  if (/inlet/.test(t) && !/intake/.test(t)) return 395;
  if (/scoop|duct/.test(t) && !/intake|airbox/.test(t)) return 320;
  if (/cover/.test(t)) return 680;
  return 1650;
}

export function shippingForSupplier(supplierId: string): ShippingQuote {
  if (supplierId === "autoremeliai" || supplierId === "wurth" || supplierId === "erformance") {
    return { origin: "LT", timeFromDays: 1, timeToDays: 4, costCents: 490 };
  }
  if (supplierId === "eventuri") {
    return { origin: "UK", timeFromDays: 7, timeToDays: 16, costCents: 3900 };
  }
  if (US_HEAVY.has(supplierId)) {
    return { origin: "US", timeFromDays: 12, timeToDays: 24, costCents: 14900 };
  }
  if (US_LIGHT.has(supplierId)) {
    return { origin: "US", timeFromDays: 10, timeToDays: 21, costCents: 8900 };
  }
  return { origin: "EU", timeFromDays: 5, timeToDays: 12, costCents: 1900 };
}
