"use client";

import { fitmentForVehicle } from "@/lib/fitment";
import type { Product } from "@/lib/types";
import { useT } from "@/context/LocaleContext";
import { cn } from "@/lib/cn";
import { useState } from "react";

export function CompatibilityBadge({
  product,
  vehicleId,
  compact = false,
}: {
  product: Product;
  vehicleId?: string | null;
  compact?: boolean;
}) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const status = fitmentForVehicle(product.compatibility, vehicleId);

  if (!vehicleId) {
    return <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{t("fitment.selectCar")}</p>;
  }

  const map = {
    EXACT: { label: t("fitment.fits"), className: "text-emerald-400" },
    COMPATIBLE: { label: t("fitment.fits"), className: "text-emerald-400" },
    MODIFICATION_REQUIRED: { label: t("fitment.mods"), className: "text-amber-400" },
    NOT_COMPATIBLE: { label: t("fitment.no"), className: "text-red-400" },
    UNKNOWN: { label: t("fitment.unknown"), className: "text-muted" },
  } as const;
  const view = map[status.fitmentType];

  return (
    <div>
      <button type="button" onClick={() => setOpen((v) => !v)} className={cn("text-left text-[11px] font-semibold uppercase tracking-[0.16em]", view.className)}>
        {status.fitmentType === "EXACT" || status.fitmentType === "COMPATIBLE" ? "✓ " : status.fitmentType === "MODIFICATION_REQUIRED" ? "⚠ " : status.fitmentType === "NOT_COMPATIBLE" ? "✕ " : ""}
        {view.label}
      </button>
      {!compact && open ? (
        <div className="mt-3 rounded-2xl border border-line bg-surface p-4 text-sm text-muted">
          <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-foreground">{t("fitment.why")}</p>
          <p>{"notes" in status && status.notes ? status.notes : view.label}</p>
        </div>
      ) : null}
    </div>
  );
}
