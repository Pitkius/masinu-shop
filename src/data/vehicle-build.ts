import type { Drive, Fuel, Vehicle } from "@/lib/types";

export function slug(value: string) {
  return value
    .toLowerCase()
    .replaceAll("š", "s")
    .replaceAll("ä", "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function compareAlpha(a: string | number, b: string | number) {
  return String(a).localeCompare(String(b), "en", { numeric: true, sensitivity: "base" });
}

export function vehicle(input: Omit<Vehicle, "id" | "makeSlug" | "modelSlug" | "generationSlug">): Vehicle {
  const makeSlug = slug(input.make);
  const modelSlug = slug(input.model);
  const generationSlug = slug(input.generation);
  const id = [
    makeSlug,
    modelSlug,
    generationSlug,
    input.yearFrom,
    slug(input.body),
    slug(input.engine),
    slug(input.engineCode),
    input.fuel.toLowerCase(),
    input.drive.toLowerCase(),
    slug(input.transmission),
  ].join("-");
  return { ...input, id, makeSlug, modelSlug, generationSlug };
}

export type Variant = {
  body: string;
  engine: string;
  engineCode: string;
  fuel: Fuel;
  power: number;
  drive: Drive;
  transmission: string;
};

export type Powertrain = Omit<Variant, "body">;

export type VehicleFamily = {
  make: string;
  model: string;
  generation: string;
  facelift: string | null;
  yearFrom: number;
  yearTo: number;
  pcd: string;
  centerBore: string;
  variants: Variant[];
};

function family(base: Omit<VehicleFamily, "variants" | "pcd" | "centerBore"> & { pcd?: string; centerBore?: string }, variants: Variant[]): VehicleFamily {
  return {
    ...base,
    facelift: base.facelift,
    pcd: base.pcd ?? "5x112",
    centerBore: base.centerBore ?? "57.1",
    variants,
  };
}

export const petrol = (engine: string, code: string, power: number, drive: Drive = "FWD", transmission = "Manual"): Powertrain => ({
  engine, engineCode: code, fuel: "PETROL", power, drive, transmission,
});
export const diesel = (engine: string, code: string, power: number, drive: Drive = "FWD", transmission = "Automatic"): Powertrain => ({
  engine, engineCode: code, fuel: "DIESEL", power, drive, transmission,
});

export const BMW = { pcd: "5x120", centerBore: "72.6" };
export const BMWG = { pcd: "5x112", centerBore: "66.6" };
export const VAG100 = { pcd: "5x100", centerBore: "57.1" };
export const VOLVO = { pcd: "5x108", centerBore: "63.4" };
export const TOYOTA = { pcd: "5x114.3", centerBore: "60.1" };
export const HONDA = { pcd: "5x114.3", centerBore: "64.1" };
export const NISSAN = { pcd: "5x114.3", centerBore: "66.1" };
export const FORD4 = { pcd: "4x108", centerBore: "63.4" };
export const FORD5 = { pcd: "5x108", centerBore: "63.4" };
export const PORSCHE = { pcd: "5x130", centerBore: "71.6" };
export const LC = { pcd: "5x150", centerBore: "110" };
export const YARIS = { pcd: "4x100", centerBore: "54.1" };
export const MUSTANG = { pcd: "5x114.3", centerBore: "70.5" };
export const HYUNDAI = { pcd: "5x114.3", centerBore: "67.1" };
export const SUBARU = { pcd: "5x100", centerBore: "56.1" };
export const MINI = { pcd: "5x112", centerBore: "66.6" };
export const MINIR = { pcd: "4x100", centerBore: "56.1" };
export const LANDROVER = { pcd: "5x120", centerBore: "72.6" };
export const MAZDA = { pcd: "5x114.3", centerBore: "67.1" };
export const RENAULT = { pcd: "5x114.3", centerBore: "66.1" };
export const ALFA = { pcd: "5x110", centerBore: "65.1" };
export const JEEP = { pcd: "5x127", centerBore: "71.5" };
export const PEUGEOT = { pcd: "5x108", centerBore: "65.1" };
export const MITSU = { pcd: "5x114.3", centerBore: "67.1" };

export function f(
  make: string,
  model: string,
  generation: string,
  yearFrom: number,
  yearTo: number,
  bodies: string[],
  trains: Powertrain[],
  extra: { facelift?: string | null; pcd?: string; centerBore?: string } = {},
): VehicleFamily {
  return family(
    {
      make,
      model,
      generation,
      facelift: extra.facelift ?? null,
      yearFrom,
      yearTo,
      pcd: extra.pcd,
      centerBore: extra.centerBore,
    },
    bodies.flatMap((body) => trains.map((train) => ({ ...train, body }))),
  );
}
