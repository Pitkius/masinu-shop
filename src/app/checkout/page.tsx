"use client";

import { FormEvent, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useT } from "@/context/LocaleContext";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

export default function CheckoutPage() {
  const { t } = useT();
  const { items, clear } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("loading");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        name: form.get("name"),
        items,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error === "STOCK" ? t("checkout.stock") : t("checkout.error"));
      return;
    }
    clear();
    setStatus("ok");
    setMessage(`${t("checkout.success")} · ${data.orderId} · ${formatMoney(data.total)}`);
  }

  if (!items.length && status !== "ok") {
    return <div className="mx-auto max-w-xl px-4 py-16"><EmptyState title={t("cart.empty")} actions={<Link href="/shop">{t("nav.shop")}</Link>} /></div>;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-4xl">{t("checkout.title")}</h1>
      <p className="mt-3 text-sm text-muted">{t("checkout.validated")}</p>
      <p className="mt-2 text-sm text-muted">{t("checkout.noPayment")}</p>
      {status === "ok" ? <p className="mt-8 rounded-3xl border border-line p-6">{message}</p> : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            {t("checkout.name")}
            <input name="name" required className="mt-2 w-full rounded-2xl border border-line bg-surface px-4 py-3" />
          </label>
          <label className="block text-sm">
            {t("checkout.email")}
            <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-line bg-surface px-4 py-3" />
          </label>
          {status === "error" ? <p className="text-sm text-red-400">{message}</p> : null}
          <Button disabled={status === "loading"}>{t("checkout.place")}</Button>
        </form>
      )}
    </div>
  );
}
