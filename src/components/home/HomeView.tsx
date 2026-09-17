"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CircleDot,
  Cpu,
  Disc3,
  Droplets,
  Gauge,
  Lightbulb,
  PanelsTopLeft,
  Sparkles,
  Speaker,
  Armchair,
  Wind,
  Wrench,
} from "lucide-react";
import { categories } from "@/data/categories";
import { publicBuilds } from "@/data/builds";
import { productsForVehicle, shopProducts } from "@/lib/shop-catalog";
import { vehicles, vehicleLabel } from "@/data/vehicles";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";
import { VehiclePicker } from "@/components/vehicle/VehiclePicker";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";

const categoryIcons = {
  performance: Gauge,
  exterior: PanelsTopLeft,
  wheels: CircleDot,
  lighting: Lightbulb,
  suspension: Wind,
  brakes: Disc3,
  exhaust: Speaker,
  engine: Wrench,
  interior: Armchair,
  electronics: Cpu,
  accessories: Sparkles,
  detailing: Droplets,
} as const;

export function HomeView() {
  const { t } = useT();
  const { activeVehicle } = useGarage();
  const [picker, setPicker] = useState(false);
  const car = vehicles.find((item) => item.id === activeVehicle?.vehicleId);
  const listed = car ? productsForVehicle(car.id) : shopProducts();
  const catalogKinds = ["coilovers", "downpipes", "intakes", "cooling"];
  const featured = catalogKinds
    .map((kind) => listed.find((product) => product.subcategory === kind))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">{t("hero.kicker")}</p>
            <h1 className="mt-4 max-w-3xl text-5xl leading-[0.92] tracking-tight sm:text-7xl">
              {t("hero.title")}
              <br />
              {t("hero.title2")}
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">{t("hero.lede")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => setPicker(true)}>{t("hero.selectCar")}</Button>
              <Link href="/shop" className="inline-flex items-center border border-line px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] hover:border-foreground">
                {t("nav.shop")}
              </Link>
              <Link href="/search" className="inline-flex items-center px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted hover:text-foreground">
                {t("hero.enterPart")}
              </Link>
            </div>
          </div>
          <div className="border border-line bg-surface p-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("yourCar.title")}</p>
            {car ? (
              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{t("yourCar.myCar")}</p>
                <h2 className="mt-2 text-3xl leading-tight">{vehicleLabel(car, false)}</h2>
                <p className="mt-3 font-mono text-xs text-muted">
                  {car.yearFrom}–{car.yearTo}
                  <br />
                  {car.body} · {car.engine}
                  <br />
                  {car.drive === "AWD" ? "Quattro / AWD" : car.drive}
                </p>
                <Link href={`/shop?vehicle=${car.id}`} className="mt-6 inline-block">
                  <Button>{t("yourCar.viewCompatible")}</Button>
                </Link>
              </div>
            ) : (
              <div className="mt-6">
                <h2 className="text-2xl">{t("yourCar.findParts")}</h2>
                <p className="mt-3 text-sm text-muted">{t("hero.fitmentNote")}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => setPicker(true)}>{t("yourCar.selectMake")}</Button>
                  <Button variant="secondary" onClick={() => setPicker(true)}>{t("yourCar.selectModel")}</Button>
                  <Button variant="secondary" onClick={() => setPicker(true)}>{t("yourCar.selectGeneration")}</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("categories.title")}</p>
        <div className="mt-6 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] ?? Wrench;
            return (
              <Link key={category.slug} href={`/shop/${category.slug}`} className="bg-bg p-5 transition hover:bg-surface">
                <Icon className="h-4 w-4 text-accent" />
                <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.16em]">{category.name}</h2>
                <p className="mt-2 text-xs leading-relaxed text-muted">{category.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("popular")}</p>
            <h2 className="mt-2 text-3xl">{t("popularLead")}</h2>
          </div>
          <Link href="/shop" className="text-[11px] uppercase tracking-[0.18em] text-muted hover:text-foreground">{t("nav.shop")}</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("buildCta.title")}</p>
            <h2 className="mt-4 max-w-md text-4xl">{t("buildCta.text")}</h2>
          </div>
          <div className="flex items-end">
            <Link href="/try-on"><Button>{t("buildCta.upload")}</Button></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("trending")}</p>
        <div className="mt-8 grid gap-px border border-line bg-line md:grid-cols-3">
          {publicBuilds.map((build) => {
            const vehicle = vehicles.find((item) => item.id === build.vehicleId);
            return (
              <Link key={build.slug} href={`/builds/${build.slug}`} className="bg-bg p-6 hover:bg-surface">
                <p className="text-[11px] uppercase tracking-[0.18em] text-accent">{build.owner}</p>
                <h3 className="mt-3 text-xl">{build.title}</h3>
                {vehicle ? (
                  <p className="mt-2 font-mono text-xs text-muted">
                    {vehicle.make} · {vehicle.model} · {vehicle.generation} · {vehicle.yearFrom}–{vehicle.yearTo}
                  </p>
                ) : null}
                <p className="mt-3 text-sm text-muted">{build.story}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("why.title")}</p>
        <div className="mt-8 grid gap-px border border-line bg-line md:grid-cols-5">
          {[t("why.compatibility"), t("why.curated"), t("why.suppliers"), t("why.returns"), t("why.shipping")].map((item) => (
            <div key={item} className="bg-bg p-6 text-sm">
              {item}
            </div>
          ))}
        </div>
      </section>
      <VehiclePicker open={picker} onClose={() => setPicker(false)} />
    </div>
  );
}
