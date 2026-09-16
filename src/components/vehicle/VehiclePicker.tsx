"use client";

import { vehicles, matchesSelection, uniqueOptions, vehicleLabel, compareAlpha } from "@/data/vehicles";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";
import { Button } from "@/components/ui/Button";
import type { Vehicle, VehicleSelection } from "@/lib/types";
import { useMemo, useState } from "react";

const fields: { key: keyof VehicleSelection; label: string; from: (v: Vehicle) => string | number }[] = [
  { key: "make", label: "picker.make", from: (v) => v.make },
  { key: "model", label: "picker.model", from: (v) => v.model },
  { key: "generation", label: "picker.generation", from: (v) => v.generation },
  { key: "year", label: "picker.year", from: (v) => v.yearFrom },
  { key: "body", label: "picker.body", from: (v) => v.body },
  { key: "engine", label: "picker.engine", from: (v) => v.engine },
  { key: "fuel", label: "picker.fuel", from: (v) => v.fuel },
  { key: "drive", label: "picker.drive", from: (v) => v.drive },
  { key: "transmission", label: "picker.transmission", from: (v) => v.transmission },
];

export function VehiclePicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useT();
  const { addVehicle } = useGarage();
  const [selection, setSelection] = useState<VehicleSelection>({});

  const filtered = useMemo(() => vehicles.filter((vehicle) => matchesSelection(vehicle, selection)), [selection]);
  const exact = filtered.length === 1 ? filtered[0] : null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-line bg-bg p-6 sm:rounded-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl tracking-wide">{t("picker.title")}</h2>
          <button onClick={onClose} className="text-sm text-muted">
            {t("picker.close")}
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map((field, index) => {
            const prevOk = fields.slice(0, index).every((item) => selection[item.key]);
            const options = [...new Set(filtered.map((vehicle) => String(field.from(vehicle))))].sort(compareAlpha);
            if (field.key === "year") {
              const years = new Set<number>();
              for (const vehicle of filtered) {
                for (let year = vehicle.yearFrom; year <= vehicle.yearTo; year += 1) years.add(year);
              }
              return (
                <label key={field.key} className="block text-[11px] uppercase tracking-[0.16em] text-muted">
                  {t(field.label)}
                  <select
                    disabled={!prevOk}
                    className="mt-2 w-full rounded-2xl border border-line bg-surface px-3 py-3 text-sm text-foreground"
                    value={selection.year ?? ""}
                    onChange={(e) => setSelection((prev) => ({ ...prev, year: e.target.value ? Number(e.target.value) : undefined }))}
                  >
                    <option value="">—</option>
                    {[...years].sort().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }
            return (
              <label key={field.key} className="block text-[11px] uppercase tracking-[0.16em] text-muted">
                {t(field.label)}
                <select
                  disabled={!prevOk && index > 0}
                  className="mt-2 w-full rounded-2xl border border-line bg-surface px-3 py-3 text-sm text-foreground"
                  value={(selection[field.key] as string) ?? ""}
                  onChange={(e) => {
                    const next: VehicleSelection = { ...selection, [field.key]: e.target.value || undefined };
                    fields.slice(index + 1).forEach((item) => {
                      delete next[item.key];
                    });
                    setSelection(next);
                  }}
                >
                  <option value="">—</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {field.key === "fuel" ? t(`fuel.${option}`) : field.key === "drive" ? t(`drive.${option}`) : option}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}
        </div>
        {exact ? (
          <p className="mt-5 text-sm text-muted">
            {vehicleLabel(exact)} · {exact.engineCode} · {exact.yearFrom}–{exact.yearTo}
          </p>
        ) : (
          <p className="mt-5 text-sm text-muted">{filtered.length} configurations</p>
        )}
        <div className="mt-6 flex justify-end">
          <Button
            disabled={!exact}
            onClick={() => {
              if (!exact) return;
              addVehicle(exact.id);
              onClose();
            }}
          >
            {t("picker.confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function useVehicleOptions() {
  return uniqueOptions(vehicles, "make");
}
