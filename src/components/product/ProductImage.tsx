"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { categoryImage, img } from "@/data/images";

export function ProductImage({
  src,
  alt,
  category,
  className,
  sizes = "(max-width:768px) 100vw, 50vw",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  category?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const fallback = (category && categoryImage[category]) || img.car;
  const [current, setCurrent] = useState(src || fallback);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center bg-surface", className)}>
        <div className="px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-accent">{category ?? "APEX"}</p>
          <p className="mt-2 text-sm text-muted">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={current}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
      onError={() => {
        if (current !== fallback) {
          setCurrent(fallback);
          return;
        }
        setFailed(true);
      }}
    />
  );
}
