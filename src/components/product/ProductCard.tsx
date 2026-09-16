"use client";

import Link from "next/link";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/product/ProductImage";
import { CompatibilityBadge } from "@/components/product/CompatibilityBadge";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";

export function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useT();
  const { activeVehicle } = useGarage();
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface">
        <ProductImage
          src={product.images[0]}
          alt={product.title}
          category={product.category}
          sizes="(max-width:768px) 50vw, 25vw"
          className="transition duration-500 group-hover:scale-[1.03]"
        />
        {product.stock <= 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.16em]">{t("product.outOfStock")}</span>
        ) : null}
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{product.brand}</p>
        <h3 className="text-base leading-snug">{product.title}</h3>
        <p className="text-sm">{formatMoney(product.price, product.currency, locale === "lt" ? "lt-LT" : "en-IE")}</p>
        <CompatibilityBadge product={product} vehicleId={activeVehicle?.vehicleId} compact />
      </div>
    </Link>
  );
}
