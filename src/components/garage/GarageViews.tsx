"use client";

import Link from "next/link";
import { useState } from "react";
import { useGarage } from "@/context/GarageContext";
import { useCart } from "@/context/CartContext";
import { useT } from "@/context/LocaleContext";
import { vehicles, vehicleLabel } from "@/data/vehicles";
import { products } from "@/data/products";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { VehiclePicker } from "@/components/vehicle/VehiclePicker";
import { formatMoney } from "@/lib/money";

export function GarageView() {
  const { t } = useT();
  const garage = useGarage();
  const [picker, setPicker] = useState(false);
  const wishlist = products.filter((p) => garage.wishlist.includes(p.id));
  const recent = garage.recent.map((slug) => products.find((p) => p.slug === slug)).filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 lg:px-8">
      <div className="flex items-end justify-between">
        <h1 className="text-4xl">{t("garage.title")}</h1>
        <Button onClick={() => setPicker(true)}>{t("header.addCar")}</Button>
      </div>
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted">{t("garage.myCars")}</h2>
        {!garage.vehicles.length ? (
          <EmptyState className="mt-6" title={t("garage.emptyCars")} actions={<Button onClick={() => setPicker(true)}>{t("header.selectCar")}</Button>} />
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {garage.vehicles.map((saved) => {
              const vehicle = vehicles.find((item) => item.id === saved.vehicleId);
              if (!vehicle) return null;
              const installed = garage.installed[saved.id] ?? [];
              const buildItems = garage.builds.filter((b) => b.vehicleId === saved.vehicleId).flatMap((b) => b.items);
              const total = buildItems.reduce((sum, item) => sum + (products.find((p) => p.id === item.productId)?.price ?? 0), 0);
              return (
                <div key={saved.id} className="border border-line p-6">
                  <p className="text-xl">{vehicleLabel(vehicle, false)}</p>
                  <p className="text-sm text-muted">{vehicle.engine} · {vehicle.engineCode}</p>
                  <p className="mt-4 text-sm">{t("garage.installed")}: {installed.length}</p>
                  <p className="text-sm">{t("build.total")}: {formatMoney(total)}</p>
                  <p className="text-sm">{t("garage.progress")}: {Math.min(100, installed.length * 12)}%</p>
                  <div className="mt-4 flex gap-3 text-sm">
                    <button onClick={() => garage.setActive(saved.id)}>{t("header.setActive")}</button>
                    <Link href={`/shop?vehicle=${vehicle.id}`}>{t("yourCar.viewCompatible")}</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted">{t("garage.myBuilds")}</h2>
          <button
            className="text-sm"
            onClick={() => {
              const vehicleId = garage.activeVehicle?.vehicleId;
              if (!vehicleId) {
                setPicker(true);
                return;
              }
              const car = vehicles.find((v) => v.id === vehicleId);
              garage.createBuild(`My ${car ? vehicleLabel(car, false) : "car"} Build`, vehicleId);
            }}
          >
            {t("garage.newBuild")}
          </button>
        </div>
        {!garage.builds.length ? (
          <EmptyState className="mt-6" title={t("garage.emptyBuilds")} />
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {garage.builds.map((build) => (
              <Link key={build.id} href={`/garage/builds/${build.id}`} className="border border-line p-6">
                <p className="text-xl">{build.title}</p>
                <p className="text-sm text-muted">{build.items.length} {t("build.parts").toLowerCase()}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted">{t("garage.wishlist")}</h2>
        {!wishlist.length ? <EmptyState className="mt-6" title={t("garage.emptyWishlist")} /> : (
          <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">{wishlist.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        )}
      </section>
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted">{t("garage.recent")}</h2>
        {!recent.length ? <EmptyState className="mt-6" title={t("garage.emptyRecent")} /> : (
          <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">{recent.map((p) => p && <ProductCard key={p.id} product={p} />)}</div>
        )}
      </section>
      <VehiclePicker open={picker} onClose={() => setPicker(false)} />
    </div>
  );
}

export function UserBuildView({ id }: { id: string }) {
  const { t } = useT();
  const garage = useGarage();
  const { addMany } = useCart();
  const build = garage.builds.find((item) => item.id === id);
  if (!build) return <div className="p-10"><EmptyState title={t("build.empty")} /></div>;
  const groups = ["exterior", "wheels", "suspension", "brakes", "engine", "exhaust", "interior", "lighting", "electronics"];
  const productList = build.items.map((item) => products.find((p) => p.id === item.productId)).filter(Boolean);
  const total = productList.reduce((sum, p) => sum + (p?.price ?? 0), 0);
  const time = productList.reduce((sum, p) => sum + (p?.installationTimeMin ?? 0), 0);
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <h1 className="text-4xl">{build.title}</h1>
      <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted">
        <span>{t("build.total")}: {formatMoney(total)}</span>
        <span>{t("build.parts")}: {build.items.length}</span>
        <span>{t("build.time")}: {Math.round(time / 60)} h</span>
      </div>
      <div className="mt-4 flex gap-3">
        <Button variant="secondary" onClick={() => garage.updateBuild(build.id, { visibility: build.visibility === "public" ? "private" : "public" })}>
          {build.visibility === "public" ? t("build.public") : t("build.private")}
        </Button>
        <Button onClick={() => addMany(build.items.map((i) => i.productId))}>{t("build.addAll")}</Button>
      </div>
      {groups.map((group) => {
        const items = build.items.filter((item) => item.category === group);
        if (!items.length) return null;
        return (
          <section key={group} className="mt-10">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted">{group}</h2>
            <div className="mt-4 grid gap-3">
              {items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                return (
                  <div key={item.productId} className="flex items-center justify-between border border-line p-4">
                    <Link href={`/product/${product.slug}`}>{product.title}</Link>
                    <span className="text-xs uppercase text-muted">{item.status === "installed" ? t("build.installed") : t("build.wishlist")}</span>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
