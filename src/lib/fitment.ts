import type { FitmentType, ProductFitment, Vehicle, VehicleSelection } from "@/lib/types";
import { matchesSelection, vehicles } from "@/data/vehicles";

export type FitmentRule = {
  make?: string;
  model?: string;
  generation?: string;
  yearFrom?: number;
  yearTo?: number;
  engines?: string[];
  engineCodes?: string[];
  bodies?: string[];
  fuel?: string[];
  drive?: string[];
  fitmentType: Exclude<FitmentType, "NOT_COMPATIBLE">;
  notes?: string;
};

export function vehiclesForRule(rule: FitmentRule, pool: Vehicle[] = vehicles): Vehicle[] {
  return pool.filter((vehicle) => {
    const selection: VehicleSelection = {
      make: rule.make,
      model: rule.model,
      generation: rule.generation,
    };
    if (!matchesSelection(vehicle, selection)) return false;
    if (rule.yearFrom && vehicle.yearTo < rule.yearFrom) return false;
    if (rule.yearTo && vehicle.yearFrom > rule.yearTo) return false;
    if (rule.engines && !rule.engines.includes(vehicle.engine)) return false;
    if (rule.engineCodes && !rule.engineCodes.includes(vehicle.engineCode)) return false;
    if (rule.bodies && !rule.bodies.includes(vehicle.body)) return false;
    if (rule.fuel && !rule.fuel.includes(vehicle.fuel)) return false;
    if (rule.drive && !rule.drive.includes(vehicle.drive)) return false;
    return true;
  });
}

export function resolveFitment(rules: FitmentRule[]): ProductFitment[] {
  const map = new Map<string, ProductFitment>();
  for (const rule of rules) {
    for (const vehicle of vehiclesForRule(rule)) {
      const current = map.get(vehicle.id);
      const next: ProductFitment = {
        vehicleId: vehicle.id,
        fitmentType: rule.fitmentType,
        notes: rule.notes,
      };
      if (!current || rank(next.fitmentType) < rank(current.fitmentType)) {
        map.set(vehicle.id, next);
      }
    }
  }
  return [...map.values()];
}

function rank(type: FitmentType) {
  switch (type) {
    case "EXACT":
      return 0;
    case "COMPATIBLE":
      return 1;
    case "MODIFICATION_REQUIRED":
      return 2;
    default:
      return 3;
  }
}

export function relatedVehicleIds(vehicleId: string, pool: Vehicle[] = vehicles): string[] {
  const vehicle = pool.find((item) => item.id === vehicleId);
  if (!vehicle) return [];
  return pool
    .filter((item) => item.make === vehicle.make && item.model === vehicle.model && item.generation === vehicle.generation)
    .map((item) => item.id);
}

export function fitmentForVehicle(
  compatibility: ProductFitment[],
  vehicleId: string | null | undefined,
): ProductFitment | { fitmentType: "NOT_COMPATIBLE" | "UNKNOWN"; notes?: string } {
  if (!vehicleId) return { fitmentType: "UNKNOWN" };
  const ids = new Set(relatedVehicleIds(vehicleId));
  let best: ProductFitment | undefined;
  for (const item of compatibility) {
    if (!ids.has(item.vehicleId)) continue;
    if (!best || rank(item.fitmentType) < rank(best.fitmentType)) best = item;
  }
  return best ?? { fitmentType: "NOT_COMPATIBLE" };
}

export type FitmentApplication = {
  make: string;
  model: string;
  generation: string;
  yearFrom: number;
  yearTo: number;
  engines: string[];
  bodies: string[];
};

export function fitmentApplications(compatibility: ProductFitment[]): FitmentApplication[] {
  const groups = new Map<string, FitmentApplication & { engineSet: Set<string>; bodySet: Set<string> }>();
  for (const fit of compatibility) {
    const vehicle = vehicles.find((item) => item.id === fit.vehicleId);
    if (!vehicle) continue;
    const key = `${vehicle.make}|${vehicle.model}|${vehicle.generation}`;
    const current = groups.get(key);
    if (!current) {
      groups.set(key, {
        make: vehicle.make,
        model: vehicle.model,
        generation: vehicle.generation,
        yearFrom: vehicle.yearFrom,
        yearTo: vehicle.yearTo,
        engines: [],
        bodies: [],
        engineSet: new Set([vehicle.engine]),
        bodySet: new Set([vehicle.body]),
      });
      continue;
    }
    current.yearFrom = Math.min(current.yearFrom, vehicle.yearFrom);
    current.yearTo = Math.max(current.yearTo, vehicle.yearTo);
    current.engineSet.add(vehicle.engine);
    current.bodySet.add(vehicle.body);
  }
  return [...groups.values()].map((item) => ({
    make: item.make,
    model: item.model,
    generation: item.generation,
    yearFrom: item.yearFrom,
    yearTo: item.yearTo,
    engines: [...item.engineSet],
    bodies: [...item.bodySet],
  }));
}

export function fitmentHeadline(compatibility: ProductFitment[]): string {
  const apps = fitmentApplications(compatibility);
  if (!apps.length) return "";
  const first = apps[0];
  const base = `${first.make} · ${first.model} · ${first.generation} · ${first.yearFrom}–${first.yearTo}`;
  if (apps.length === 1) {
    const engines = first.engines.slice(0, 3).join(" / ");
    return engines ? `${base} · ${engines}` : base;
  }
  return `${base} +${apps.length - 1}`;
}

export function normalizePartNumber(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}
