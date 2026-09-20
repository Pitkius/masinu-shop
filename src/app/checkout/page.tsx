"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useT } from "@/context/LocaleContext";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

function CheckoutForm() {
  const { t } = useT();
  const { items } = useCart();
  const params = useSearchParams();
  const canceled = params.get("canceled") === "1";
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
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
    if (!response.ok || !data.url) {
      setStatus("error");
      setMessage(
        data.error === "STOCK"
          ? t("checkout.stock")
          : data.error === "PAYMENT_UNCONFIGURED"
            ? t("checkout.noPayment")
            : t("checkout.error"),
      );
      return;
    }
    window.location.assign(data.url as string);
  }

  if (!items.length) {
    return <div className="mx-auto max-w-xl px-4 py-16"><EmptyState title={t("cart.empty")} actions={<Link href="/shop">{t("nav.shop")}</Link>} /></div>;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-4xl">{t("checkout.title")}</h1>
      <p className="mt-3 text-sm text-muted">{t("checkout.validated")}</p>
      {canceled ? <p className="mt-4 text-sm text-red-400">{t("checkout.canceled")}</p> : null}
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
        <Button disabled={status === "loading"}>{t("checkout.pay")}</Button>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted">…</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
