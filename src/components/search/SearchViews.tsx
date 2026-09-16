"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { searchCatalog, searchPartNumber } from "@/lib/search";
import { ProductCard } from "@/components/product/ProductCard";
import { SearchBox } from "@/components/search/SearchBox";
import { EmptyState } from "@/components/ui/EmptyState";
import { useT } from "@/context/LocaleContext";
import Link from "next/link";

export function SearchView() {
  const { t } = useT();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const [local] = useState(q);
  const result = useMemo(() => searchCatalog(q || local), [q, local]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h1 className="text-4xl">{t("search.title")}</h1>
      <div className="mt-6 max-w-xl"><SearchBox /></div>
      {!result.products.length ? (
        <EmptyState title={t("search.empty")} className="mt-10" />
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {result.products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}

export function PartView({ number }: { number: string }) {
  const { t } = useT();
  const result = searchPartNumber(number);
  const has = result.oem.length || result.aftermarket.length || result.compatible.length;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">OEM / MPN</p>
      <h1 className="mt-2 text-4xl">{result.query}</h1>
      {!has ? (
        <EmptyState
          title={t("search.noExact")}
          text={t("search.searchCompatible")}
          className="mt-10"
          actions={<Link href={`/search?q=${result.query}`} className="text-accent">{t("search.searchCompatible")}</Link>}
        />
      ) : (
        <div className="mt-10 space-y-12">
          {result.oem.length ? (
            <section>
              <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted">{t("search.oem")}</h2>
              <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">{result.oem.map((p) => <ProductCard key={p.id} product={p} />)}</div>
            </section>
          ) : null}
          {result.aftermarket.length ? (
            <section>
              <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted">{t("search.aftermarket")}</h2>
              <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">{result.aftermarket.map((p) => <ProductCard key={p.id} product={p} />)}</div>
            </section>
          ) : null}
          {result.compatible.length ? (
            <section>
              <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted">{t("search.compatible")}</h2>
              <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">{result.compatible.map((p) => <ProductCard key={p.id} product={p} />)}</div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
