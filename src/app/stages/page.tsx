"use client";

import { performanceStages } from "@/data/stages";
import { products } from "@/data/products";
import { vehicles, vehicleLabel } from "@/data/vehicles";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";
import { formatMoney } from "@/lib/money";
import { ProductCard, productGridClass } from "@/components/product/ProductCard";
import Link from "next/link";

export default function StagesPage() {
  const { t } = useT();
  const { activeVehicle } = useGarage();
  const vehicle = vehicles.find((item) => item.id === activeVehicle?.vehicleId);
  const stages = vehicle ? performanceStages.filter((s) => s.engineCode === vehicle.engineCode) : [];
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <h1 className="text-4xl">{t("stages.title")}</h1>
      {vehicle ? <p className="mt-2 text-muted">{vehicleLabel(vehicle)} · {vehicle.engineCode}</p> : <p className="mt-2 text-muted">{t("header.selectCar")}</p>}
      <p className="mt-4 text-sm text-muted">{t("stages.estimated")}</p>
      {!vehicle ? null : !stages.length ? (
        <p className="mt-10 text-muted">{t("stages.noData")}</p>
      ) : (
        <div className="mt-10 space-y-8">
          <div className="rounded-3xl border border-line p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{t("stages.stock")}</p>
            <p className="mt-2 text-2xl">{vehicle.power} hp factory</p>
          </div>
          {stages.map((stage) => {
            const parts = stage.productSkus.map((sku) => products.find((p) => p.sku === sku)).filter(Boolean);
            const price = parts.reduce((sum, p) => sum + (p?.price ?? 0), 0);
            return (
              <section key={stage.id} className="rounded-3xl border border-line p-6">
                <h2 className="text-2xl">{stage.title}</h2>
                <p className="mt-2 text-muted">{stage.summary}</p>
                <div className="mt-4 grid gap-2 text-sm md:grid-cols-3">
                  <p>{t("stages.price")}: {formatMoney(price)}</p>
                  <p>
                    {t("stages.power")}: {stage.estimatedPowerFrom && stage.estimatedPowerTo ? `${stage.estimatedPowerFrom}–${stage.estimatedPowerTo} hp` : t("stages.noData")}
                    <span className="block text-xs text-muted">{t("product.estimated")}</span>
                  </p>
                  <p>
                    {t("stages.torque")}: {stage.estimatedTorqueFrom && stage.estimatedTorqueTo ? `${stage.estimatedTorqueFrom}–${stage.estimatedTorqueTo} Nm` : t("stages.noData")}
                    <span className="block text-xs text-muted">{t("product.estimated")}</span>
                  </p>
                </div>
                <p className="mt-3 text-xs text-muted">{stage.notes}</p>
                <div className={`mt-6 ${productGridClass}`}>
                  {parts.map((p) => p && <ProductCard key={p.id} product={p} />)}
                </div>
              </section>
            );
          })}
        </div>
      )}
      <Link href="/goals" className="mt-10 inline-block text-sm text-accent">{t("nav.goals")}</Link>
    </div>
  );
}
