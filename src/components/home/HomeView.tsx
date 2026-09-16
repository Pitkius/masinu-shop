"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { img } from "@/data/images";
import { categories } from "@/data/categories";
import { publicBuilds } from "@/data/builds";
import { products } from "@/data/products";
import { vehicles, vehicleLabel } from "@/data/vehicles";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";
import { VehiclePicker } from "@/components/vehicle/VehiclePicker";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";

export function HomeView() {
  const { t } = useT();
  const { activeVehicle } = useGarage();
  const [picker, setPicker] = useState(false);
  const car = vehicles.find((item) => item.id === activeVehicle?.vehicleId);
  const popularKinds = ["headlights", "coilovers", "wheels", "catback"];
  const popular = popularKinds
    .map((kind) => products.find((product) => product.subcategory === kind))
    .filter((product): product is (typeof products)[number] => Boolean(product));
  const arrivals: typeof products = [];
  const usedKinds = new Set<string>();
  const usedMakes = new Set<string>();
  const newest = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.slug.localeCompare(b.slug));
  for (const product of newest) {
    const make = product.tags[0] ?? product.slug;
    if (usedKinds.has(product.subcategory ?? "") || usedMakes.has(make)) continue;
    usedKinds.add(product.subcategory ?? "");
    usedMakes.add(make);
    arrivals.push(product);
    if (arrivals.length >= 4) break;
  }
  if (arrivals.length < 4) {
    for (const product of newest) {
      if (arrivals.includes(product) || usedKinds.has(product.subcategory ?? "")) continue;
      usedKinds.add(product.subcategory ?? "");
      arrivals.push(product);
      if (arrivals.length >= 4) break;
    }
  }

  return (
    <div>
      <section className="relative min-h-[78vh] overflow-hidden">
        <Image src={img.hero} alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-black/30" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-16 lg:px-8">
          <h1 className="max-w-xl text-5xl leading-[0.95] tracking-tight sm:text-7xl">
            {t("hero.title")}
            <br />
            {t("hero.title2")}
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => setPicker(true)}>{t("hero.selectCar")}</Button>
            <Link href="/search" className="inline-flex items-center rounded-full border border-white/30 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em]">
              {t("hero.enterPart")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("yourCar.title")}</p>
        {car ? (
          <div className="mt-6 flex flex-col justify-between gap-6 rounded-3xl border border-line bg-surface p-8 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{t("yourCar.myCar")}</p>
              <h2 className="mt-2 text-4xl">{vehicleLabel(car, false)}</h2>
              <p className="mt-2 text-muted">
                {car.engine}
                <br />
                {car.drive === "AWD" ? "Quattro" : car.drive}
              </p>
            </div>
            <Link href={`/shop?vehicle=${car.id}`}>
              <Button>{t("yourCar.viewCompatible")}</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-line p-8">
            <h2 className="text-3xl">{t("yourCar.findParts")}</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setPicker(true)}>{t("yourCar.selectMake")}</Button>
              <Button variant="secondary" onClick={() => setPicker(true)}>{t("yourCar.selectModel")}</Button>
              <Button variant="secondary" onClick={() => setPicker(true)}>{t("yourCar.selectGeneration")}</Button>
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("categories.title")}</p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/shop/${category.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image src={category.image} alt={category.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute bottom-4 left-4 text-sm tracking-wide">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-2 lg:px-8">
        <div className="relative min-h-[360px] overflow-hidden rounded-3xl">
          <Image src={img.garage} alt="" fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("buildCta.title")}</p>
          <h2 className="mt-4 text-4xl">{t("buildCta.text")}</h2>
          <div className="mt-8">
            <Link href="/try-on"><Button>{t("buildCta.upload")}</Button></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("popular")}</p>
        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {popular.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("trending")}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {publicBuilds.map((build) => (
            <Link key={build.slug} href={`/builds/${build.slug}`} className="group">
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
                <Image src={build.photo} alt={build.title} fill className="object-cover transition group-hover:scale-[1.03]" />
              </div>
              <h3 className="mt-4 text-xl">{build.title}</h3>
              <p className="text-sm text-muted">{build.story}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("arrivals")}</p>
        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {arrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("why.title")}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-5">
          {[t("why.compatibility"), t("why.curated"), t("why.suppliers"), t("why.returns"), t("why.shipping")].map((item) => (
            <div key={item} className="rounded-3xl border border-line p-6 text-sm">
              {item}
            </div>
          ))}
        </div>
      </section>
      <VehiclePicker open={picker} onClose={() => setPicker(false)} />
    </div>
  );
}
