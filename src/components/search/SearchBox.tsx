"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useT } from "@/context/LocaleContext";
import type { SearchHit } from "@/lib/types";

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const { t } = useT();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    if (!q.trim()) {
      return;
    }
    timer.current = window.setTimeout(async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}&suggest=1`);
      if (!response.ok) return;
      const data = (await response.json()) as { hits: SearchHit[] };
      setHits(data.hits);
      setOpen(true);
    }, 280);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [q]);

  const shown = q.trim() ? hits : [];

  return (
    <div className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!q.trim()) return;
          const part = q.replace(/[^a-zA-Z0-9]/g, "");
          if (/^[A-Z0-9]{8,}$/i.test(part) && !q.includes(" ")) {
            router.push(`/part/${part.toUpperCase()}`);
          } else {
            router.push(`/search?q=${encodeURIComponent(q)}`);
          }
          setOpen(false);
        }}
        className="flex items-center gap-2 border border-line bg-surface px-4 py-2"
      >
        <Search className="h-4 w-4 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => shown.length && setOpen(true)}
          placeholder={t("header.searchPlaceholder")}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </form>
      {open && shown.length > 0 && !compact ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden border border-line bg-bg shadow-2xl">
          {(["product", "vehicle", "category", "part"] as const).map((kind) => {
            const group = shown.filter((hit) => hit.kind === kind);
            if (!group.length) return null;
            return (
              <div key={kind} className="border-b border-line px-4 py-3 last:border-0">
                <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-muted">{t(`search.${kind === "part" ? "parts" : kind === "product" ? "products" : kind === "vehicle" ? "vehicles" : "categories"}`)}</p>
                {group.map((hit) => (
                  <Link key={hit.id} href={hit.href} onClick={() => setOpen(false)} className="block py-1.5 text-sm hover:text-accent">
                    {hit.title}
                    {hit.subtitle ? <span className="block text-xs text-muted">{hit.subtitle}</span> : null}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
