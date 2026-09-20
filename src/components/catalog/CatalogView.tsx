"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { productsForVehicle, shopProducts } from "@/lib/shop-catalog";
import { categories, categoryFilterFields } from "@/data/categories";
import { sortPartTypes } from "@/lib/catalog-classify";
import { ProductCard, productGridClass } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";
import { VehiclePicker } from "@/components/vehicle/VehiclePicker";
import { vehicles, vehicleLabel } from "@/data/vehicles";
import { visiblePageNumbers } from "@/lib/pagination";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";

const PAGE_SIZE = 24;

export function CatalogView({ category }: { category?: string }) {
  const { t } = useT();
  const router = useRouter();
  const params = useSearchParams();
  const { activeVehicle } = useGarage();
  const [picker, setPicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [category]);
  const vehicleId = params.get("vehicle") || activeVehicle?.vehicleId || "";
  const brand = params.get("brand") || "";
  const inStock = params.get("stock") === "1";
  const goal = params.get("goal") || "";
  const partType = params.get("type") || "";
  const extra = useMemo(() => (category ? categoryFilterFields[category] ?? [] : []), [category]);

  const scoped = useMemo(() => {
    const pool = vehicleId && params.get("fit") !== "off" ? productsForVehicle(vehicleId) : shopProducts();
    return pool.filter((product) => {
      if (category && product.category !== category) return false;
      return true;
    });
  }, [category, params, vehicleId]);

  const typeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const product of scoped) {
      const slug = product.subcategory || "other";
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
    return sortPartTypes(category, [...counts.keys()]).map((slug) => ({ slug, count: counts.get(slug) ?? 0 }));
  }, [category, scoped]);

  const brands = useMemo(
    () => [...new Set(scoped.filter((product) => !partType || product.subcategory === partType).map((product) => product.brand))].sort(),
    [partType, scoped],
  );

  const filtered = useMemo(() => {
    return scoped.filter((product) => {
      if (partType && (product.subcategory || "other") !== partType) return false;
      if (brand && product.brand !== brand) return false;
      if (inStock && product.stock <= 0) return false;
      if (goal && !product.goalTags.includes(goal)) return false;
      for (const field of extra) {
        const value = params.get(field.key);
        if (value && product.specifications[field.spec ?? field.label] !== value) return false;
      }
      return true;
    });
  }, [brand, extra, goal, inStock, params, partType, scoped]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const slice = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pageItems = visiblePageNumbers(currentPage, totalPages, 10);
  const car = vehicles.find((item) => item.id === vehicleId);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    setPage(1);
    router.push(`?${next.toString()}`);
  };

  const partLabel = (slug: string) => {
    const key = `parts.${slug}`;
    const label = t(key);
    return label === key ? slug.replace(/-/g, " ") : label;
  };

  const chipClass = (active: boolean) =>
    `border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${active ? "border-accent bg-accent text-white" : "border-line hover:border-foreground"}`;

  const filters = (
    <div className="space-y-5 text-sm">
      {typeCounts.length > 1 ? (
        <label className="block">
          {t("filters.partType")}
          <select className="mt-2 w-full border border-line bg-surface px-3 py-2" value={partType} onChange={(e) => setParam("type", e.target.value)}>
            <option value="">{t("filters.allParts")}</option>
            {typeCounts.map((item) => (
              <option key={item.slug} value={item.slug}>{partLabel(item.slug)} ({item.count})</option>
            ))}
          </select>
        </label>
      ) : null}
      <label className="block">
        {t("filters.brand")}
        <select className="mt-2 w-full border border-line bg-surface px-3 py-2" value={brand} onChange={(e) => setParam("brand", e.target.value)}>
          <option value="">{t("filters.all")}</option>
          {brands.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={inStock} onChange={(e) => setParam("stock", e.target.checked ? "1" : "")} />
        {t("filters.inStock")}
      </label>
      {extra.map((field) => {
        const options = [...new Set(scoped.filter((p) => !partType || p.subcategory === partType).map((p) => p.specifications[field.spec ?? field.label]).filter(Boolean))];
        return (
          <label key={field.key} className="block">
            {field.label}
            <select className="mt-2 w-full border border-line bg-surface px-3 py-2" value={params.get(field.key) ?? ""} onChange={(e) => setParam(field.key, e.target.value)}>
              <option value="">{t("filters.all")}</option>
              {options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        );
      })}
      <Button variant="secondary" onClick={() => router.push(category ? `/shop/${category}` : "/shop")}>{t("filters.reset")}</Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("nav.shop")}</p>
          <h1 className="mt-2 text-4xl">{category ? categories.find((c) => c.slug === category)?.name : t("nav.shop")}</h1>
          {category ? <p className="mt-2 max-w-xl text-sm text-muted">{categories.find((c) => c.slug === category)?.description}</p> : null}
          {car ? <p className="mt-2 text-sm text-muted">{vehicleLabel(car, false)} · {car.yearFrom}–{car.yearTo}</p> : null}
        </div>
        <button className="lg:hidden" onClick={() => setOpen(true)}><SlidersHorizontal /></button>
      </div>

      {!category ? (
        <div className="mt-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("filters.category")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((item) => (
              <Link key={item.slug} href={`/shop/${item.slug}`} className={chipClass(false)}>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      ) : typeCounts.length ? (
        <div className="mt-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("filters.lookingFor")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={chipClass(!partType)} onClick={() => setParam("type", "")}>
              {t("filters.allParts")}
            </button>
            {typeCounts.map((item) => (
              <button key={item.slug} type="button" className={chipClass(partType === item.slug)} onClick={() => setParam("type", partType === item.slug ? "" : item.slug)}>
                {partLabel(item.slug)} ({item.count})
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>
        <div>
          {!slice.length ? (
            <EmptyState
              title={car ? t("search.emptyVehicle", { car: vehicleLabel(car, false) }) : t("search.empty")}
              actions={
                <>
                  <Button variant="secondary" onClick={() => setPicker(true)}>{t("search.changeVehicle")}</Button>
                  <Button variant="secondary" onClick={() => router.push(category ? `/shop/${category}` : "/shop")}>{t("search.clearFilters")}</Button>
                </>
              }
            />
          ) : (
            <div className={productGridClass}>
              {slice.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
          {totalPages > 1 ? (
            <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
                className="flex h-9 w-9 items-center justify-center border border-line disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {pageItems.map((item, index) =>
                item === "gap" ? (
                  <span key={`gap-${index}`} className="px-1 text-muted">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPage(item)}
                    className={`h-9 min-w-9 px-2 ${currentPage === item ? "bg-accent text-white" : "border border-line"}`}
                  >
                    {item}
                  </button>
                ),
              )}
              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="flex h-9 w-9 items-center justify-center border border-line disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          ) : null}
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/70 lg:hidden">
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto border-t border-line bg-bg p-6">
            <div className="mb-4 flex justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em]">{t("filters.title")}</p>
              <button onClick={() => setOpen(false)}><X /></button>
            </div>
            {filters}
          </div>
        </div>
      ) : null}
      <VehiclePicker open={picker} onClose={() => setPicker(false)} />
    </div>
  );
}
