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

export function fitmentForVehicle(
  compatibility: ProductFitment[],
  vehicleId: string | null | undefined,
): ProductFitment | { fitmentType: "NOT_COMPATIBLE" | "UNKNOWN"; notes?: string } {
  if (!vehicleId) return { fitmentType: "UNKNOWN" };
  return compatibility.find((item) => item.vehicleId === vehicleId) ?? { fitmentType: "NOT_COMPATIBLE" };
}

export function normalizePartNumber(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}
