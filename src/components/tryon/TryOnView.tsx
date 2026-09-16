"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import { vehicles, vehicleLabel } from "@/data/vehicles";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { VehiclePicker } from "@/components/vehicle/VehiclePicker";

export function TryOnView() {
  const { t } = useT();
  const params = useSearchParams();
  const garage = useGarage();
  const [picker, setPicker] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [result, setResult] = useState<{ original: string; modified: string | null; mock: boolean; message: string } | null>(null);
  const [pos, setPos] = useState(50);
  const vehicle = vehicles.find((item) => item.id === garage.activeVehicle?.vehicleId);
  const product = useMemo(() => products.find((item) => item.slug === params.get("product")) ?? products[0], [params]);

  async function run() {
    if (!vehicle || !file || !product) return;
    setStatus("loading");
    const response = await fetch("/api/try-on", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId: vehicle.id, productId: product.id, imageDataUrl: file }),
    });
    const data = await response.json();
    if (!response.ok || data.status === "error") {
      setStatus("error");
      setResult({ original: file, modified: null, mock: false, message: data.message || t("tryOn.error") });
      return;
    }
    setResult(data);
    setStatus("ok");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <h1 className="text-4xl">{t("tryOn.title")}</h1>
      <p className="mt-2 text-muted">{vehicle ? vehicleLabel(vehicle) : t("tryOn.needCar")}</p>
      <p className="text-sm text-muted">{product ? product.title : t("tryOn.needProduct")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => setPicker(true)}>{t("header.selectCar")}</Button>
        <label className="inline-flex cursor-pointer items-center rounded-full border border-line px-5 py-3 text-[11px] uppercase tracking-[0.18em]">
          {t("tryOn.upload")}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const next = e.target.files?.[0];
              if (!next) return;
              const reader = new FileReader();
              reader.onload = () => setFile(String(reader.result));
              reader.readAsDataURL(next);
            }}
          />
        </label>
        <Button disabled={!file || !vehicle} onClick={run}>{t("tryOn.run")}</Button>
      </div>
      {status === "loading" ? <p className="mt-8 text-muted">{t("tryOn.loading")}</p> : null}
      {status === "error" ? <EmptyState className="mt-8" title={t("tryOn.error")} text={result?.message} /> : null}
      {status === "ok" && result?.original ? (
        <div className="mt-10">
          {result.mock ? <p className="mb-4 text-sm text-amber-400">{t("tryOn.mockNote")}</p> : null}
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.original} alt={t("tryOn.original")} className="absolute inset-0 h-full w-full object-cover" />
            {result.modified ? (
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.modified} alt={t("tryOn.modified")} className="h-full w-[100vw] max-w-none object-cover contrast-125 saturate-125" />
              </div>
            ) : null}
            <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="absolute bottom-4 left-1/2 w-2/3 -translate-x-1/2" />
            <span className="absolute left-4 top-4 text-[11px] uppercase tracking-[0.18em]">{t("tryOn.original")}</span>
            <span className="absolute right-4 top-4 text-[11px] uppercase tracking-[0.18em]">{t("tryOn.modified")}</span>
          </div>
        </div>
      ) : null}
      <VehiclePicker open={picker} onClose={() => setPicker(false)} />
    </div>
  );
}
