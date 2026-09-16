"use client";

import { FormEvent, useState } from "react";
import { useT } from "@/context/LocaleContext";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useGarage } from "@/context/GarageContext";

export default function FinderPage() {
  const { t } = useT();
  const { activeVehicle } = useGarage();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [ids, setIds] = useState<string[]>([]);
  const [note, setNote] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = String(new FormData(event.currentTarget).get("query") ?? "");
    setStatus("loading");
    const response = await fetch("/api/finder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, vehicleId: activeVehicle?.vehicleId }),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus("error");
      return;
    }
    setIds(data.products.map((p: { id: string }) => p.id));
    setNote(data.note);
    setStatus("ok");
  }

  const found = products.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <h1 className="text-4xl">{t("finder.title")}</h1>
      <p className="mt-3 text-sm text-muted">{t("finder.onlyCatalog")}</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <textarea name="query" required minLength={8} rows={5} placeholder={t("finder.placeholder")} className="w-full rounded-3xl border border-line bg-surface px-4 py-3" />
        <Button disabled={status === "loading"}>{t("finder.submit")}</Button>
      </form>
      {status === "loading" ? <p className="mt-8 text-muted">{t("empty.loading")}</p> : null}
      {status === "error" ? <EmptyState className="mt-8" title={t("empty.error")} /> : null}
      {status === "ok" && !found.length ? <EmptyState className="mt-8" title={t("finder.empty")} /> : null}
      {found.length ? (
        <>
          <p className="mt-8 text-sm text-muted">{note}</p>
          <div className="mt-6 grid grid-cols-2 gap-6">{found.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </>
      ) : null}
    </div>
  );
}
