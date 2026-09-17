"use client";

import Link from "next/link";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/product/ProductImage";
import { CompatibilityBadge } from "@/components/product/CompatibilityBadge";
import { useCart } from "@/context/CartContext";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";
import { fitmentHeadline } from "@/lib/fitment";
import { Button } from "@/components/ui/Button";

export const productGridClass = "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4";

export function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useT();
  const { add } = useCart();
  const { activeVehicle } = useGarage();
  const fitment = fitmentHeadline(product.compatibility);
  const availability =
    product.stock <= 0 ? t("product.outOfStock") : product.stock <= 5 ? t("product.lowStock") : t("product.inStock");

  return (
    <article className="flex h-full flex-col border border-line bg-surface transition hover:border-foreground/40">
      <Link href={`/product/${product.slug}`} className="flex min-h-0 flex-1 flex-col">
        <div className="relative h-40 w-full shrink-0 overflow-hidden border-b border-line bg-white sm:h-44">
          <ProductImage product={product} compact sizes="(max-width:768px) 50vw, 25vw" />
          <span className="absolute right-2 top-2 bg-black px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white">
            {availability}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{product.brand}</p>
          <h3 className="text-sm font-medium leading-snug">{product.title}</h3>
          {fitment ? <p className="text-[11px] leading-relaxed text-muted">{fitment}</p> : null}
          <p className="mt-auto pt-2 text-base font-semibold">
            {formatMoney(product.price, product.currency, locale === "lt" ? "lt-LT" : "en-IE")}
          </p>
        </div>
      </Link>
      <div className="space-y-2 px-3 pb-3">
        <CompatibilityBadge product={product} vehicleId={activeVehicle?.vehicleId} compact />
        <Button
          className="w-full px-3 py-2"
          disabled={product.stock < 1}
          onClick={() => add(product.id)}
        >
          {t("product.addToCart")}
        </Button>
      </div>
    </article>
  );
}
