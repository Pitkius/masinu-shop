"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Product, ProductMedia } from "@/lib/types";
import { productHero } from "@/lib/product-media";
import { useT } from "@/context/LocaleContext";

export function ProductPlaceholder({
  product,
  className,
}: {
  product: Pick<Product, "sku" | "category" | "subcategory" | "brand">;
  className?: string;
}) {
  const { t } = useT();
  return (
    <div className={cn("flex h-full w-full flex-col justify-between bg-surface p-4", className)}>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">{product.subcategory ?? product.category}</p>
        <p className="mt-2 font-mono text-[11px] text-muted">{product.sku}</p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{t("media.pending")}</p>
        <p className="mt-1 max-w-[16rem] text-xs leading-relaxed text-muted">{t("media.pendingHint")}</p>
      </div>
    </div>
  );
}

export function ProductImage({
  product,
  asset,
  className,
  sizes = "(max-width:768px) 100vw, 50vw",
  priority = false,
}: {
  product: Product;
  asset?: ProductMedia | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const media = asset ?? productHero(product);
  if (!media) {
    return <ProductPlaceholder product={product} className={className} />;
  }

  return (
    <Image
      src={media.src}
      alt={media.alt || product.title}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-contain object-center p-3", className)}
    />
  );
}

