"use client";

import { useT } from "@/context/LocaleContext";

export function TryOnStage({
  carSrc,
  modifiedSrc,
  compare,
  loading,
}: {
  carSrc: string;
  modifiedSrc: string | null;
  compare: number;
  loading?: boolean;
}) {
  const { t } = useT();
  const result = modifiedSrc ?? carSrc;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-surface [container-type:inline-size]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={result} alt={t("tryOn.modified")} className="block h-auto w-full select-none" draggable={false} />
      {modifiedSrc ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ width: `${compare}%` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={carSrc} alt="" className="absolute left-0 top-0 h-full w-[100cqw] max-w-none select-none" draggable={false} />
        </div>
      ) : null}
      {modifiedSrc ? (
        <>
          <span className="pointer-events-none absolute left-4 top-4 text-[11px] uppercase tracking-[0.18em]">{t("tryOn.original")}</span>
          <span className="pointer-events-none absolute right-4 top-4 text-[11px] uppercase tracking-[0.18em]">{t("tryOn.modified")}</span>
        </>
      ) : null}
      {loading ? (
        <div className="absolute inset-0 grid place-items-center bg-black/45 px-6 text-center text-sm text-white">
          {t("tryOn.loading")}
        </div>
      ) : null}
    </div>
  );
}
