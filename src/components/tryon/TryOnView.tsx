"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { products } from "@/data/products";
import { productsForVehicle, shopProducts } from "@/lib/shop-catalog";
import { vehicles, vehicleLabel } from "@/data/vehicles";
import { useGarage } from "@/context/GarageContext";
import { useCart } from "@/context/CartContext";
import { useT } from "@/context/LocaleContext";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { VehiclePicker } from "@/components/vehicle/VehiclePicker";
import { TryOnStage } from "@/components/tryon/TryOnStage";
import { prepareCarPhoto } from "@/components/tryon/cutout";
import { tryOnDecision, tryOnPreviewKind, type TryOnScene, type TryOnUnchangedReason } from "@/lib/tryon";
import { searchCatalog } from "@/lib/search";

const scenes: TryOnScene[] = ["exterior", "engine", "interior"];

function reasonKey(reason: TryOnUnchangedReason) {
  switch (reason) {
    case "under-hood":
      return "tryOn.underHood";
    case "interior":
      return "tryOn.cabinOnly";
    case "need-exterior":
      return "tryOn.needExterior";
    case "need-engine":
      return "tryOn.needEngine";
    case "need-interior":
      return "tryOn.needInterior";
    default:
      return "tryOn.notVisible";
  }
}

export function TryOnView({ productSlug }: { productSlug?: string }) {
  const { t } = useT();
  const params = useSearchParams();
  const garage = useGarage();
  const { add } = useCart();
  const [picker, setPicker] = useState(false);
  const [query, setQuery] = useState("");
  const [carSrc, setCarSrc] = useState<string | null>(null);
  const [modifiedSrc, setModifiedSrc] = useState<string | null>(null);
  const [scene, setScene] = useState<TryOnScene>("exterior");
  const [compare, setCompare] = useState(0);
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const vehicle = vehicles.find((item) => item.id === garage.activeVehicle?.vehicleId);
  const listed = shopProducts();
  const compatible = vehicle ? productsForVehicle(vehicle.id) : listed;
  const product = useMemo(() => {
    const slug = params.get("product") ?? productSlug;
    if (slug) {
      return products.find((item) => item.slug === slug) ?? listed.find((item) => item.slug === slug);
    }
    return (
      listed.find((item) => {
        const preview = tryOnPreviewKind(item);
        return preview === "body" || preview === "stance";
      }) ??
      compatible[0] ??
      listed[0]
    );
  }, [params, productSlug, listed, compatible]);
  const suggestions = useMemo(() => {
    const q = query.trim();
    if (q) return searchCatalog(q, 8).products;
    return (compatible.length ? compatible : listed).slice(0, 8);
  }, [query, compatible, listed]);
  const kind = product ? tryOnPreviewKind(product) : "hidden";
  const decision = tryOnDecision(kind, scene);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/try-on")
      .then((response) => response.json())
      .then((payload: { configured?: boolean }) => {
        if (!cancelled) setConfigured(Boolean(payload.configured));
      })
      .catch(() => {
        if (!cancelled) setConfigured(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setModifiedSrc(null);
    setError(null);
    setCompare(0);
  }, [product?.id, scene]);

  async function onUpload(file: File | undefined) {
    if (!file) return;
    const prepared = await prepareCarPhoto(file);
    setCarSrc(prepared);
    setModifiedSrc(null);
    setCompare(0);
    setError(null);
  }

  async function visualize() {
    if (!carSrc || !product || decision.action !== "generate") return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          scene,
          image: carSrc,
          vehicleLabel: vehicle ? vehicleLabel(vehicle, false) : undefined,
        }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { image?: string; unchanged?: boolean; reason?: TryOnUnchangedReason; error?: string }
        | null;
      if (!response.ok) {
        setError(payload?.error === "not-configured" ? t("tryOn.notConfigured") : payload?.error || t("tryOn.error"));
        return;
      }
      if (payload?.unchanged) return;
      if (payload?.image) {
        setModifiedSrc(payload.image);
        setCompare(0);
      } else {
        setError(t("tryOn.error"));
      }
    } catch {
      setError(t("tryOn.error"));
    } finally {
      setLoading(false);
    }
  }

  const hintKey =
    kind === "stance"
      ? "tryOn.hintStance"
      : kind === "engine"
        ? "tryOn.hintEngine"
        : kind === "interior"
          ? "tryOn.hintInterior"
          : kind === "body"
            ? "tryOn.hintBody"
            : "tryOn.hintHidden";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <h1 className="text-4xl">{t("tryOn.title")}</h1>
      <p className="mt-2 max-w-2xl text-muted">{t(hintKey)}</p>
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
      <div className="mt-6 flex flex-wrap gap-2">
        {scenes.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setScene(item)}
            className={`border px-3 py-2 text-[11px] uppercase tracking-[0.12em] ${item === scene ? "border-accent text-foreground" : "border-line text-muted hover:text-foreground"}`}
          >
            {t(`tryOn.scene.${item}`)}
          </button>
        ))}
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
          <TryOnStage carSrc={carSrc} modifiedSrc={modifiedSrc} compare={compare} loading={loading} />
          {decision.action === "unchanged" ? (
            <p className="mt-3 text-sm text-muted">{t(reasonKey(decision.reason))}</p>
          ) : (
            <p className="mt-3 text-sm text-muted">{t("tryOn.fitNote")}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {decision.action === "generate" ? (
              <Button onClick={() => void visualize()} disabled={loading || configured !== true}>
                {t("tryOn.run")}
              </Button>
            ) : null}
            {modifiedSrc ? (
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
            ) : null}
          </div>
          {configured === false ? <p className="mt-3 text-sm text-muted">{t("tryOn.notConfigured")}</p> : null}
          {error ? <p className="mt-3 text-sm text-muted">{error}</p> : null}
        </div>
      ) : (
        <EmptyState className="mt-10" title={t("tryOn.upload")} text={t("tryOn.needPhoto")} />
      )}
      <VehiclePicker open={picker} onClose={() => setPicker(false)} />
    </div>
  );
}
