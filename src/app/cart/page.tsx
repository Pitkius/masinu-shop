"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";
import { products } from "@/data/products";
import { fitmentForVehicle } from "@/lib/fitment";
import { formatMoney } from "@/lib/money";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { CompatibilityBadge } from "@/components/product/CompatibilityBadge";

export default function CartPage() {
  const { t } = useT();
  const { items, setQty, remove } = useCart();
  const { activeVehicle } = useGarage();
  const rows = items.map((item) => ({ item, product: products.find((p) => p.id === item.productId) })).filter((row) => row.product);
  const subtotal = rows.reduce((sum, row) => sum + (row.product!.price * row.item.quantity), 0);
  const shipping = rows.reduce((max, row) => Math.max(max, row.product!.shipping.costCents), 0);

  if (!rows.length) {
    return <div className="mx-auto max-w-3xl px-4 py-16"><EmptyState title={t("cart.empty")} actions={<Link href="/shop"><Button>{t("nav.shop")}</Button></Link>} /></div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <h1 className="text-4xl">{t("cart.title")}</h1>
      <div className="mt-8 space-y-4">
        {rows.map(({ item, product }) => {
          if (!product) return null;
          const status = fitmentForVehicle(product.compatibility, activeVehicle?.vehicleId);
          return (
            <div key={product.id} className="rounded-3xl border border-line p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <Link href={`/product/${product.slug}`} className="text-lg">{product.title}</Link>
                  <p className="text-sm text-muted">{formatMoney(product.price)}</p>
                  <div className="mt-2"><CompatibilityBadge product={product} vehicleId={activeVehicle?.vehicleId} compact /></div>
                  {activeVehicle && status.fitmentType === "NOT_COMPATIBLE" ? <p className="mt-2 text-sm text-amber-400">{t("cart.warning")}</p> : null}
                </div>
                <div className="flex items-center gap-3">
                  <input type="number" min={1} value={item.quantity} onChange={(e) => setQty(product.id, Number(e.target.value))} className="w-16 rounded-xl border border-line bg-surface px-2 py-2" />
                  <button onClick={() => remove(product.id)} className="text-sm text-muted">{t("cart.remove")}</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 space-y-2 text-sm">
        <p>{t("cart.subtotal")}: {formatMoney(subtotal)}</p>
        <p>{t("cart.shipping")}: {formatMoney(shipping)}</p>
        <p className="text-lg">{t("cart.total")}: {formatMoney(subtotal + shipping)}</p>
      </div>
      <Link href="/checkout" className="mt-6 inline-flex"><Button>{t("cart.checkout")}</Button></Link>
    </div>
  );
}
