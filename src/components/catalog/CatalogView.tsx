"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import { categories, categoryFilterFields } from "@/data/categories";
import { brands } from "@/lib/catalog";
import { fitmentForVehicle } from "@/lib/fitment";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";
import { VehiclePicker } from "@/components/vehicle/VehiclePicker";
import { vehicles, vehicleLabel } from "@/data/vehicles";
import { SlidersHorizontal, X } from "lucide-react";

const PAGE_SIZE = 12;

export function CatalogView({ category }: { category?: string }) {
  const { t } = useT();
  const router = useRouter();
  const params = useSearchParams();
  const { activeVehicle } = useGarage();
  const [picker, setPicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const vehicleId = params.get("vehicle") || activeVehicle?.vehicleId || "";
  const brand = params.get("brand") || "";
  const inStock = params.get("stock") === "1";
  const goal = params.get("goal") || "";
  const extra = useMemo(() => (category ? categoryFilterFields[category] ?? [] : []), [category]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      if (category && product.category !== category) return false;
      if (brand && product.brand !== brand) return false;
      if (inStock && product.stock <= 0) return false;
      if (goal && !product.goalTags.includes(goal)) return false;
      for (const field of extra) {
        const value = params.get(field.key);
        if (value && product.specifications[field.spec ?? field.label] !== value) return false;
      }
      if (vehicleId && params.get("fit") !== "off") {
        const status = fitmentForVehicle(product.compatibility, vehicleId);
        if (status.fitmentType === "NOT_COMPATIBLE") return false;
      }
      return true;
    });
  }, [brand, category, extra, goal, inStock, params, vehicleId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const car = vehicles.find((item) => item.id === vehicleId);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    setPage(1);
    router.push(`?${next.toString()}`);
  };

  const filters = (
    <div className="space-y-5 text-sm">
      <label className="block">
        {t("filters.brand")}
        <select className="mt-2 w-full rounded-2xl border border-line bg-surface px-3 py-2" value={brand} onChange={(e) => setParam("brand", e.target.value)}>
          <option value="">{t("filters.category") === t("filters.brand") ? "—" : "All"}</option>
          {brands().map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={inStock} onChange={(e) => setParam("stock", e.target.checked ? "1" : "")} />
        {t("filters.inStock")}
      </label>
      {extra.map((field) => {
        const options = [...new Set(products.filter((p) => !category || p.category === category).map((p) => p.specifications[field.spec ?? field.label]).filter(Boolean))];
        return (
          <label key={field.key} className="block">
            {field.label}
            <select className="mt-2 w-full rounded-2xl border border-line bg-surface px-3 py-2" value={params.get(field.key) ?? ""} onChange={(e) => setParam(field.key, e.target.value)}>
              <option value="">All</option>
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
          {car ? <p className="mt-2 text-sm text-muted">{vehicleLabel(car)}</p> : null}
        </div>
        <button className="lg:hidden" onClick={() => setOpen(true)}><SlidersHorizontal /></button>
      </div>
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
            <div className="grid grid-cols-2 gap-6 xl:grid-cols-3">
              {slice.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
          {totalPages > 1 ? (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`h-10 w-10 rounded-full ${page === i + 1 ? "bg-accent text-black" : "border border-line"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/70 lg:hidden">
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-bg p-6">
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
