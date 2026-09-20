"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useT } from "@/context/LocaleContext";
import { formatMoney } from "@/lib/money";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

type SessionInfo = {
  paymentStatus?: string;
  email?: string | null;
  amountTotal?: number | null;
  currency?: string | null;
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted">…</div>}>
      <CheckoutSuccessView />
    </Suspense>
  );
}

function CheckoutSuccessView() {
  const { t } = useT();
  const { clear } = useCart();
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setError(true);
      return;
    }
    let cancelled = false;
    fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error("bad session");
        if (!cancelled) {
          setSession(data);
          if (data.paymentStatus === "paid") clear();
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId, clear]);

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <EmptyState title={t("checkout.error")} actions={<Link href="/checkout">{t("checkout.title")}</Link>} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <p className="text-sm text-muted">{t("empty.loading")}</p>
      </div>
    );
  }

  const paid = session.paymentStatus === "paid";
  const total = session.amountTotal != null ? formatMoney(session.amountTotal, (session.currency ?? "eur").toUpperCase()) : "";

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-4xl">{paid ? t("checkout.paid") : t("checkout.success")}</h1>
      <p className="mt-4 rounded-3xl border border-line p-6 text-sm">
        {paid ? t("checkout.paidHint") : t("checkout.success")}
        {session.email ? <><br />{session.email}</> : null}
        {total ? <><br />{total}</> : null}
      </p>
      <Link href="/shop" className="mt-8 inline-block text-[11px] font-semibold uppercase tracking-[0.18em]">
        {t("nav.shop")}
      </Link>
    </div>
  );
}
