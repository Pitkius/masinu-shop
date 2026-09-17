"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product, Review as ReviewType } from "@/lib/types";
import { formatHours, formatMoney } from "@/lib/money";
import { CompatibilityBadge } from "@/components/product/CompatibilityBadge";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";
import { vehicles, vehicleLabel } from "@/data/vehicles";
import { VehiclePicker } from "@/components/vehicle/VehiclePicker";
import { productMedia } from "@/lib/product-media";
import { fitmentApplications } from "@/lib/fitment";

const roleKey: Record<string, string> = {
  hero: "media.role.hero",
  gallery: "media.role.gallery",
  installed: "media.role.installed",
  closeup: "media.role.closeup",
  packaging: "media.role.packaging",
  kit: "media.role.kit",
  supplier: "media.role.supplier",
  install: "media.role.install",
  diagram: "media.role.diagram",
};

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
  const media = productMedia(product);
  const applications = fitmentApplications(product.compatibility);
  const availability =
    product.stock > 5 ? t("product.inStock") : product.stock > 0 ? t("product.lowStock") : t("product.outOfStock");

  useEffect(() => {
    garage.viewProduct(product.slug);
    setImage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="relative aspect-square overflow-hidden border border-line bg-surface">
            <ProductImage product={product} asset={media[image] ?? null} priority sizes="(max-width:1024px) 100vw, 50vw" />
          </div>
          {media.length > 1 ? (
            <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
              {media.map((asset, i) => (
                <button
                  key={`${asset.src}-${asset.role}`}
                  type="button"
                  onClick={() => setImage(i)}
                  className={`relative aspect-square overflow-hidden border ${i === image ? "border-accent" : "border-line"}`}
                >
                  <ProductImage product={product} asset={asset} sizes="80px" />
                </button>
              ))}
            </div>
          ) : null}
          {media[image] ? (
            <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted">
              {t(roleKey[media[image].role] ?? "media.role.gallery")}
              {media[image].caption ? ` · ${media[image].caption}` : ""}
            </p>
          ) : null}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{product.brand}</p>
          <h1 className="mt-2 text-4xl tracking-tight">{product.title}</h1>
          <p className="mt-2 font-mono text-xs text-muted">SKU {product.sku}{product.mpn ? ` · MPN ${product.mpn}` : ""}</p>
          {reviews.length ? <p className="mt-2 text-sm text-muted">{avg.toFixed(1)} · {reviews.length} {t("product.reviews").toLowerCase()}</p> : null}
          <p className="mt-4 text-3xl">{money(product.price)}</p>
          {product.compareAtPrice ? <p className="text-sm text-muted line-through">{money(product.compareAtPrice)}</p> : null}
          <p className="mt-4 text-sm">{t("product.availability")}: {availability}</p>
          <p className="text-sm text-muted">
            {t("product.delivery")}: {product.shipping.timeFromDays}–{product.shipping.timeToDays} d · {money(product.shipping.costCents)}
          </p>
          <div className="mt-6 space-y-3 border border-line p-5">
            <CompatibilityBadge product={product} vehicleId={car?.id} />
            {car ? (
              <p className="text-sm">
                {vehicleLabel(car, false)}
                <br />
                {car.yearFrom}–{car.yearTo} · {car.body} · {car.engine}
              </p>
            ) : (
              <Button variant="secondary" onClick={() => setPicker(true)}>{t("header.selectCar")}</Button>
            )}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <label className="text-[11px] uppercase tracking-[0.16em] text-muted">
              {t("product.quantity")}
              <input type="number" min={1} max={product.stock} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="ml-3 w-16 border border-line bg-surface px-2 py-2" />
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
          <div className="mt-3 space-y-4">
            {applications.slice(0, 12).map((app) => (
              <div key={`${app.make}-${app.model}-${app.generation}`} className="border border-line p-4 text-sm">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{t("picker.make")}</p>
                <p className="font-semibold">{app.make}</p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted">{t("picker.model")}</p>
                <p>{app.model}</p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted">{t("picker.generation")}</p>
                <p>{app.generation}</p>
                <p className="mt-3 text-muted">{app.yearFrom}–{app.yearTo}</p>
                {app.bodies.length ? <p className="text-muted">{app.bodies.join(" / ")}</p> : null}
                {app.engines.length ? <p className="mt-1 font-medium">{app.engines.join(" / ")}</p> : null}
              </div>
            ))}
          </div>
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
          {product.documents.length ? (
            <>
              <h2 className="mt-6 text-xl">{t("product.documents")}</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {product.documents.map((doc) => (
                  <li key={doc.href}><a href={doc.href} className="underline decoration-accent underline-offset-4">{doc.title}</a></li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      </div>

      {setup.length ? (
        <section className="mt-16">
          <h2 className="text-xl">{t("product.complete")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
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
            <article key={review.id} className="border border-line p-5">
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
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      ) : null}
      <VehiclePicker open={picker} onClose={() => setPicker(false)} />
    </div>
  );
}
