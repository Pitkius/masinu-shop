"use client";

import Link from "next/link";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/product/ProductImage";
import { CompatibilityBadge } from "@/components/product/CompatibilityBadge";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";
import { fitmentHeadline } from "@/lib/fitment";

export function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useT();
  const { activeVehicle } = useGarage();
  const fitment = fitmentHeadline(product.compatibility);
  const specEntries = Object.entries(product.specifications).slice(0, 2);
  const availability =
    product.stock <= 0 ? t("product.outOfStock") : product.stock <= 5 ? t("product.lowStock") : t("product.inStock");

  return (
    <Link href={`/product/${product.slug}`} className="group block border border-line bg-surface transition hover:border-accent">
      <div className="relative aspect-square overflow-hidden border-b border-line">
        <ProductImage product={product} sizes="(max-width:768px) 50vw, 25vw" />
        <span className="absolute right-3 top-3 bg-black px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white">
          {availability}
        </span>
      </div>
      <div className="space-y-2 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{product.brand}</p>
        <h3 className="text-sm font-medium leading-snug">{product.title}</h3>
        {fitment ? <p className="text-xs leading-relaxed text-muted">{fitment}</p> : null}
        {specEntries.length ? (
          <p className="text-[11px] text-muted">
            {specEntries.map(([key, value]) => `${key} ${value}`).join(" · ")}
          </p>
        ) : null}
        <p className="text-sm font-semibold">{formatMoney(product.price, product.currency, locale === "lt" ? "lt-LT" : "en-IE")}</p>
        <CompatibilityBadge product={product} vehicleId={activeVehicle?.vehicleId} compact />
      </div>
    </Link>
  );
}
