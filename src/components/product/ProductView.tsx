"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product, Review as ReviewType } from "@/lib/types";
import { formatHours, formatMoney } from "@/lib/money";
import { CompatibilityBadge } from "@/components/product/CompatibilityBadge";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";
import { vehicles, vehicleLabel } from "@/data/vehicles";
import { VehiclePicker } from "@/components/vehicle/VehiclePicker";

export function ProductView({
  product,
  reviews,
  related,
  setup,
}: {
  product: Product;
  reviews: ReviewType[];
  related: Product[];
  setup: Product[];
}) {
  const { t, locale } = useT();
  const { add } = useCart();
  const garage = useGarage();
  const [qty, setQty] = useState(1);
  const [image, setImage] = useState(0);
  const [picker, setPicker] = useState(false);
  const car = vehicles.find((item) => item.id === garage.activeVehicle?.vehicleId);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.stars, 0) / reviews.length : 0;
  const money = (value: number) => formatMoney(value, product.currency, locale === "lt" ? "lt-LT" : "en-IE");

  useEffect(() => {
    garage.viewProduct(product.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug]);

  const compatible = product.compatibility
    .map((fit) => vehicles.find((v) => v.id === fit.vehicleId))
    .filter(Boolean)
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-surface">
            {product.images[image] ? <Image src={product.images[image]} alt={product.title} fill className="object-cover" priority /> : null}
          </div>
          <div className="mt-3 flex gap-2">
            {product.images.map((src, i) => (
              <button key={src} onClick={() => setImage(i)} className={`relative h-16 w-16 overflow-hidden rounded-xl ${i === image ? "ring-2 ring-accent" : ""}`}>
                <Image src={src} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{product.brand}</p>
          <h1 className="mt-2 text-4xl">{product.title}</h1>
          {reviews.length ? <p className="mt-2 text-sm text-muted">{avg.toFixed(1)} · {reviews.length} {t("product.reviews").toLowerCase()}</p> : null}
          <p className="mt-4 text-2xl">{money(product.price)}</p>
          {product.compareAtPrice ? <p className="text-sm text-muted line-through">{money(product.compareAtPrice)}</p> : null}
          <p className="mt-4 text-sm text-muted">
            {t("product.availability")}: {product.stock > 5 ? t("product.inStock") : product.stock > 0 ? t("product.lowStock") : t("product.outOfStock")}
          </p>
          <p className="text-sm text-muted">
            {t("product.delivery")}: {product.shipping.timeFromDays}–{product.shipping.timeToDays} d · {money(product.shipping.costCents)}
          </p>
          <div className="mt-6 space-y-3 rounded-3xl border border-line p-5">
            <CompatibilityBadge product={product} vehicleId={car?.id} />
            {car ? (
              <p className="text-sm">
                {vehicleLabel(car, false)}
                <br />
                {car.engine} · {car.drive === "AWD" ? "Quattro" : car.drive}
              </p>
            ) : (
              <Button variant="secondary" onClick={() => setPicker(true)}>{t("header.selectCar")}</Button>
            )}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <label className="text-[11px] uppercase tracking-[0.16em] text-muted">
              {t("product.quantity")}
              <input type="number" min={1} max={product.stock} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="ml-3 w-16 rounded-xl border border-line bg-surface px-2 py-2" />
            </label>
            <Button disabled={product.stock < 1} onClick={() => add(product.id, qty)}>{t("product.addToCart")}</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/try-on?product=${product.slug}`}><Button variant="secondary">{t("product.viewOnCar")}</Button></Link>
            <Button variant="secondary" onClick={() => {
              const vehicleId = garage.activeVehicle?.vehicleId;
              if (!vehicleId) { setPicker(true); return; }
              const existing = garage.builds.find((b) => b.vehicleId === vehicleId);
              const build = existing ?? garage.createBuild(`My ${car ? vehicleLabel(car, false) : "car"} Build`, vehicleId);
              garage.addToBuild(build.id, { productId: product.id, category: product.category, status: "wishlist" });
            }}>{t("product.addToBuild")}</Button>
            <Button variant="secondary" onClick={() => garage.activeVehicle && garage.addInstalled(garage.activeVehicle.id, product.id)}>{t("product.addToGarage")}</Button>
            <Button variant="ghost" onClick={() => garage.toggleWishlist(product.id)}>
              {garage.wishlist.includes(product.id) ? t("product.inWishlist") : t("product.addToWishlist")}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-xl">{t("product.description")}</h2>
          <p className="mt-3 text-muted">{product.description}</p>
        </section>
        <section>
          <h2 className="text-xl">{t("product.specs")}</h2>
          <dl className="mt-3 space-y-2 text-sm">
            {Object.entries(product.specifications).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-line py-2"><dt className="text-muted">{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </section>
        <section>
          <h2 className="text-xl">{t("product.included")}</h2>
          <ul className="mt-3 list-disc pl-5 text-muted">{product.included.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section>
          <h2 className="text-xl">{t("product.fitment")}</h2>
          <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted">{t("fitment.compatibleConfigs")}</p>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {compatible.map((vehicle) => vehicle ? <li key={vehicle.id}>{vehicleLabel(vehicle)} · {vehicle.yearFrom}–{vehicle.yearTo}</li> : null)}
          </ul>
        </section>
        <section>
          <h2 className="text-xl">{t("product.installation")}</h2>
          <p className="mt-3 text-muted">{product.installationNotes ?? "—"}</p>
          <p className="mt-2 text-sm text-muted">{product.installationDifficulty} · {formatHours(product.installationTimeMin)}</p>
        </section>
        <section>
          <h2 className="text-xl">{t("product.shipping")}</h2>
          <p className="mt-3 text-muted">{product.shipping.origin} · {product.shipping.timeFromDays}–{product.shipping.timeToDays} d</p>
          <h2 className="mt-6 text-xl">{t("product.warranty")}</h2>
          <p className="mt-3 text-muted">{product.warranty ?? "—"}</p>
        </section>
      </div>

      {setup.length ? (
        <section className="mt-16">
          <h2 className="text-xl">{t("product.complete")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {setup.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
          <div className="mt-6">
            <Button onClick={() => { add(product.id); setup.forEach((item) => add(item.id)); }}>{t("product.addSetup")}</Button>
          </div>
        </section>
      ) : null}

      <section className="mt-16">
        <h2 className="text-xl">{t("product.reviews")}</h2>
        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-3xl border border-line p-5">
              <p className="text-sm">{review.stars}/5 · {review.author} {review.verifiedPurchase ? "· verified purchase" : ""}</p>
              <h3 className="mt-2">{review.title}</h3>
              <p className="mt-1 text-muted">{review.comment}</p>
              {car && review.verifiedPurchase ? <p className="mt-2 text-xs text-muted">Verified fitment: {vehicleLabel(car)}</p> : null}
            </article>
          ))}
        </div>
      </section>

      {related.length ? (
        <section className="mt-16">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      ) : null}
      <VehiclePicker open={picker} onClose={() => setPicker(false)} />
    </div>
  );
}
