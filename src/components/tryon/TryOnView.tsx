"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { productsForVehicle, shopProducts } from "@/lib/shop-catalog";
import { vehicles, vehicleLabel } from "@/data/vehicles";
import { useGarage } from "@/context/GarageContext";
import { useCart } from "@/context/CartContext";
import { useT } from "@/context/LocaleContext";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { VehiclePicker } from "@/components/vehicle/VehiclePicker";
import { TryOnStage } from "@/components/tryon/TryOnStage";
import { cutoutPart, prepareCarPhoto } from "@/components/tryon/cutout";
import { clampTransform, defaultPartTransform, type PartTransform } from "@/lib/tryon";
import { searchCatalog } from "@/lib/search";

export function TryOnView() {
  const { t } = useT();
  const params = useSearchParams();
  const garage = useGarage();
  const { add } = useCart();
  const [picker, setPicker] = useState(false);
  const [query, setQuery] = useState("");
  const [carSrc, setCarSrc] = useState<string | null>(null);
  const [partSrc, setPartSrc] = useState<string | null>(null);
  const [partError, setPartError] = useState(false);
  const [compare, setCompare] = useState(0);
  const [transform, setTransform] = useState<PartTransform>(defaultPartTransform("exterior"));
  const vehicle = vehicles.find((item) => item.id === garage.activeVehicle?.vehicleId);
  const listed = shopProducts();
  const compatible = vehicle ? productsForVehicle(vehicle.id) : listed;
  const product = useMemo(() => {
    const slug = params.get("product");
    return listed.find((item) => item.slug === slug) ?? compatible[0] ?? listed[0];
  }, [params, listed, compatible]);
  const suggestions = useMemo(() => {
    const q = query.trim();
    if (q) return searchCatalog(q, 8).products;
    return (compatible.length ? compatible : listed).slice(0, 8);
  }, [query, compatible, listed]);

  useEffect(() => {
    if (!product) return;
    setTransform(defaultPartTransform(product.category));
    setPartError(false);
    let cancelled = false;
    const src = `/api/try-on/part?productId=${encodeURIComponent(product.id)}`;
    cutoutPart(src)
      .then((next) => {
        if (!cancelled) setPartSrc(next);
      })
      .catch(() => {
        if (!cancelled) {
          setPartSrc(product.images[0] ?? null);
          setPartError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [product]);

  async function onUpload(file: File | undefined) {
    if (!file) return;
    const prepared = await prepareCarPhoto(file);
    setCarSrc(prepared);
    setCompare(0);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <h1 className="text-4xl">{t("tryOn.title")}</h1>
      <p className="mt-2 max-w-2xl text-muted">{t("tryOn.hint")}</p>
      <p className="mt-4 text-sm">{vehicle ? vehicleLabel(vehicle) : t("tryOn.needCar")}</p>
      <p className="text-sm text-muted">{product ? `${product.brand} · ${product.title}` : t("tryOn.needProduct")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => setPicker(true)}>{t("header.selectCar")}</Button>
        <label className="inline-flex cursor-pointer items-center rounded-full border border-line px-5 py-3 text-[11px] uppercase tracking-[0.18em]">
          {t("tryOn.upload")}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              void onUpload(e.target.files?.[0]);
              e.currentTarget.value = "";
            }}
          />
        </label>
        {product ? (
          <Button onClick={() => add(product.id, 1)} disabled={product.stock < 1}>{t("product.addToCart")}</Button>
        ) : null}
      </div>
      <div className="mt-6">
        <label className="text-[11px] uppercase tracking-[0.16em] text-muted">{t("tryOn.chooseProduct")}</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("tryOn.searchProduct")}
          className="mt-2 w-full border border-line bg-surface px-3 py-3 text-sm"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <Link
              key={item.id}
              href={`/try-on?product=${item.slug}`}
              className={`border px-3 py-2 text-[11px] uppercase tracking-[0.12em] ${item.id === product?.id ? "border-accent text-foreground" : "border-line text-muted hover:text-foreground"}`}
            >
              {item.brand} {item.sku}
            </Link>
          ))}
        </div>
      </div>
      {carSrc && product ? (
        <div className="mt-10">
          <TryOnStage
            carSrc={carSrc}
            partSrc={partSrc}
            transform={transform}
            onTransform={setTransform}
            compare={compare}
          />
          <p className="mt-3 text-sm text-muted">{t("tryOn.drag")}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="text-[11px] uppercase tracking-[0.16em] text-muted">
              {t("tryOn.compare")}
              <input
                type="range"
                min={0}
                max={100}
                value={compare}
                onChange={(e) => setCompare(Number(e.target.value))}
                className="ml-3 align-middle"
              />
            </label>
            <Button
              variant="secondary"
              onClick={() => setTransform((current) => clampTransform({ ...current, scale: current.scale * 0.9 }))}
            >
              −
            </Button>
            <Button
              variant="secondary"
              onClick={() => setTransform((current) => clampTransform({ ...current, scale: current.scale * 1.1 }))}
            >
              +
            </Button>
            <Button
              variant="secondary"
              onClick={() => setTransform((current) => clampTransform({ ...current, rotate: current.rotate - 8 }))}
            >
              {t("tryOn.rotate")} −
            </Button>
            <Button
              variant="secondary"
              onClick={() => setTransform((current) => clampTransform({ ...current, rotate: current.rotate + 8 }))}
            >
              {t("tryOn.rotate")} +
            </Button>
            <Button variant="ghost" onClick={() => setTransform(defaultPartTransform(product.category))}>
              {t("tryOn.reset")}
            </Button>
          </div>
          {partError ? <p className="mt-3 text-sm text-muted">{t("tryOn.partFallback")}</p> : null}
        </div>
      ) : (
        <EmptyState className="mt-10" title={t("tryOn.upload")} text={t("tryOn.needPhoto")} />
      )}
      <VehiclePicker open={picker} onClose={() => setPicker(false)} />
    </div>
  );
}
