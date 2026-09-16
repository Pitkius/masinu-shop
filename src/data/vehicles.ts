import type { Vehicle } from "@/lib/types";
import { compareAlpha, vehicle, type VehicleFamily } from "./vehicle-build";
import { vehicleFamilyCatalog } from "./vehicle-families";

export type { Variant, VehicleFamily } from "./vehicle-build";
export { compareAlpha } from "./vehicle-build";

export const vehicleFamilies: VehicleFamily[] = [...vehicleFamilyCatalog].sort((a, b) => {
  return compareAlpha(a.make, b.make) || compareAlpha(a.model, b.model) || a.yearFrom - b.yearFrom || compareAlpha(a.generation, b.generation);
});

export const vehicles: Vehicle[] = vehicleFamilies.flatMap((item) =>
  item.variants.map((variant) =>
    vehicle({
      make: item.make,
      model: item.model,
      generation: item.generation,
      facelift: item.facelift,
      yearFrom: item.yearFrom,
      yearTo: item.yearTo,
      ...variant,
    }),
  ),
);

export function familyForVehicle(item: Vehicle) {
  return vehicleFamilies.find(
    (family) => family.make === item.make && family.model === item.model && family.generation === item.generation && family.yearFrom === item.yearFrom,
  );
}

export function vehicleLabel(item: Vehicle, detail = true) {
  const base = `${item.make} ${item.model} ${item.generation}`;
  if (!detail) return base;
  const drive = item.drive === "AWD" ? (item.make === "Audi" ? "Quattro" : "AWD") : item.drive;
  return `${base} ${item.body} ${item.engine} ${drive}`;
}

export function matchesSelection(item: Vehicle, selection: {
  make?: string;
  model?: string;
  generation?: string;
  year?: number;
  body?: string;
  engine?: string;
  fuel?: string;
  drive?: string;
  transmission?: string;
}) {
  if (selection.make && item.make !== selection.make) return false;
  if (selection.model && item.model !== selection.model) return false;
  if (selection.generation && item.generation !== selection.generation) return false;
  if (selection.year && (item.yearFrom > selection.year || item.yearTo < selection.year)) return false;
  if (selection.body && item.body !== selection.body) return false;
  if (selection.engine && item.engine !== selection.engine) return false;
  if (selection.fuel && item.fuel !== selection.fuel) return false;
  if (selection.drive && item.drive !== selection.drive) return false;
  if (selection.transmission && item.transmission !== selection.transmission) return false;
  return true;
}

export function uniqueOptions<K extends keyof Vehicle>(list: Vehicle[], key: K) {
  return [...new Set(list.map((item) => item[key]))].sort((a, b) => compareAlpha(String(a ?? ""), String(b ?? ""))) as Vehicle[K][];
}
