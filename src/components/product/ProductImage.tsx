"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Product, ProductMedia } from "@/lib/types";
import { productHero } from "@/lib/product-media";
import { useT } from "@/context/LocaleContext";

export function ProductPlaceholder({
  product,
  className,
  compact = false,
}: {
  product: Pick<Product, "sku" | "category" | "subcategory" | "brand">;
  className?: string;
  compact?: boolean;
}) {
  const { t } = useT();
  return (
    <div className={cn("flex h-full w-full flex-col items-center justify-center bg-white px-3 text-center", className)}>
      <p className="font-mono text-[10px] text-zinc-500">{product.sku}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-700">{t("media.pending")}</p>
      {compact ? null : <p className="mt-2 max-w-[16rem] text-xs leading-relaxed text-zinc-500">{t("media.pendingHint")}</p>}
    </div>
  );
}

export function ProductImage({
  product,
  asset,
  className,
  sizes = "(max-width:768px) 50vw, 25vw",
  priority = false,
  compact = false,
}: {
  product: Product;
  asset?: ProductMedia | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
  compact?: boolean;
}) {
  const media = asset ?? productHero(product);
  if (!media) {
    return <ProductPlaceholder product={product} className={className} compact={compact} />;
  }

  return (
    <Image
      src={media.src}
      alt={media.alt || product.title}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-contain object-center p-4", className)}
    />
  );
}
