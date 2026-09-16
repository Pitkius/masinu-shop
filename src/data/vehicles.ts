import type { Drive, Fuel, Vehicle } from "@/lib/types";

function slug(value: string) {
  return value
    .toLowerCase()
    .replaceAll("š", "s")
    .replaceAll("ä", "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function vehicle(input: Omit<Vehicle, "id" | "makeSlug" | "modelSlug" | "generationSlug">): Vehicle {
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

type Variant = {
  body: string;
  engine: string;
  engineCode: string;
  fuel: Fuel;
  power: number;
  drive: Drive;
  transmission: string;
};

function family(
  base: {
    make: string;
    model: string;
    generation: string;
    facelift: string | null;
    yearFrom: number;
    yearTo: number;
  },
  variants: Variant[],
): Vehicle[] {
  return variants.map((variant) => vehicle({ ...base, ...variant }));
}

export const vehicles: Vehicle[] = [
  ...family(
    { make: "Audi", model: "A6", generation: "C7", facelift: null, yearFrom: 2011, yearTo: 2014 },
    [
      { body: "Sedan", engine: "3.0 TDI", engineCode: "CDUC", fuel: "DIESEL", power: 245, drive: "AWD", transmission: "Automatic" },
      { body: "Avant", engine: "3.0 TDI", engineCode: "CDUC", fuel: "DIESEL", power: 245, drive: "AWD", transmission: "Automatic" },
      { body: "Sedan", engine: "2.0 TDI", engineCode: "CNHA", fuel: "DIESEL", power: 177, drive: "FWD", transmission: "Automatic" },
      { body: "Sedan", engine: "3.0 TFSI", engineCode: "CGWB", fuel: "PETROL", power: 300, drive: "AWD", transmission: "Automatic" },
    ],
  ),
  ...family(
    { make: "Audi", model: "A6", generation: "C7", facelift: "C7.5", yearFrom: 2015, yearTo: 2018 },
    [
      { body: "Sedan", engine: "3.0 TDI", engineCode: "CVUA", fuel: "DIESEL", power: 272, drive: "AWD", transmission: "Automatic" },
      { body: "Avant", engine: "3.0 TDI", engineCode: "CVUA", fuel: "DIESEL", power: 272, drive: "AWD", transmission: "Automatic" },
      { body: "Sedan", engine: "2.0 TDI", engineCode: "DEJA", fuel: "DIESEL", power: 190, drive: "FWD", transmission: "Automatic" },
      { body: "Sedan", engine: "3.0 TFSI", engineCode: "CREC", fuel: "PETROL", power: 333, drive: "AWD", transmission: "Automatic" },
    ],
  ),
  ...family(
    { make: "Audi", model: "A4", generation: "B8", facelift: "B8.5", yearFrom: 2012, yearTo: 2015 },
    [
      { body: "Sedan", engine: "2.0 TDI", engineCode: "CGLC", fuel: "DIESEL", power: 177, drive: "FWD", transmission: "Manual" },
      { body: "Avant", engine: "2.0 TFSI", engineCode: "CNCD", fuel: "PETROL", power: 225, drive: "AWD", transmission: "Automatic" },
    ],
  ),
  ...family(
    { make: "Audi", model: "A3", generation: "8V", facelift: null, yearFrom: 2012, yearTo: 2016 },
    [
      { body: "Sportback", engine: "2.0 TDI", engineCode: "CRBC", fuel: "DIESEL", power: 150, drive: "FWD", transmission: "Manual" },
      { body: "Sedan", engine: "2.0 TFSI", engineCode: "CNTC", fuel: "PETROL", power: 220, drive: "AWD", transmission: "Automatic" },
    ],
  ),
  ...family(
    { make: "Volkswagen", model: "Golf", generation: "Mk7", facelift: null, yearFrom: 2013, yearTo: 2017 },
    [
      { body: "Hatchback", engine: "2.0 TSI GTI", engineCode: "CHHA", fuel: "PETROL", power: 220, drive: "FWD", transmission: "Manual" },
      { body: "Hatchback", engine: "2.0 TSI R", engineCode: "CJXC", fuel: "PETROL", power: 300, drive: "AWD", transmission: "Automatic" },
      { body: "Hatchback", engine: "2.0 TDI", engineCode: "CRLB", fuel: "DIESEL", power: 150, drive: "FWD", transmission: "Manual" },
    ],
  ),
  ...family(
    { make: "Volkswagen", model: "Passat", generation: "B8", facelift: null, yearFrom: 2015, yearTo: 2019 },
    [
      { body: "Sedan", engine: "2.0 TDI", engineCode: "CRL", fuel: "DIESEL", power: 150, drive: "FWD", transmission: "Automatic" },
      { body: "Variant", engine: "2.0 TSI", engineCode: "CHHB", fuel: "PETROL", power: 220, drive: "AWD", transmission: "Automatic" },
    ],
  ),
  ...family(
    { make: "Škoda", model: "Octavia", generation: "Mk3", facelift: null, yearFrom: 2013, yearTo: 2017 },
    [
      { body: "Liftback", engine: "2.0 TDI", engineCode: "CRMB", fuel: "DIESEL", power: 150, drive: "FWD", transmission: "Manual" },
      { body: "Estate", engine: "2.0 TSI vRS", engineCode: "CHHB", fuel: "PETROL", power: 220, drive: "FWD", transmission: "Manual" },
    ],
  ),
  ...family(
    { make: "SEAT", model: "Leon", generation: "Mk3", facelift: null, yearFrom: 2012, yearTo: 2016 },
    [
      { body: "Hatchback", engine: "2.0 TSI Cupra", engineCode: "CHHA", fuel: "PETROL", power: 265, drive: "FWD", transmission: "Manual" },
      { body: "Hatchback", engine: "2.0 TDI FR", engineCode: "CRBC", fuel: "DIESEL", power: 150, drive: "FWD", transmission: "Manual" },
    ],
  ),
  ...family(
    { make: "BMW", model: "3 Series", generation: "E92", facelift: null, yearFrom: 2006, yearTo: 2010 },
    [
      { body: "Coupe", engine: "3.0 N54", engineCode: "N54B30", fuel: "PETROL", power: 306, drive: "RWD", transmission: "Automatic" },
      { body: "Coupe", engine: "3.0 N57", engineCode: "N57D30", fuel: "DIESEL", power: 245, drive: "RWD", transmission: "Automatic" },
    ],
  ),
  ...family(
    { make: "BMW", model: "3 Series", generation: "E92", facelift: "LCI", yearFrom: 2010, yearTo: 2013 },
    [
      { body: "Coupe", engine: "3.0 N54", engineCode: "N54B30", fuel: "PETROL", power: 306, drive: "RWD", transmission: "Automatic" },
      { body: "Coupe", engine: "3.0 N55", engineCode: "N55B30", fuel: "PETROL", power: 306, drive: "RWD", transmission: "Automatic" },
    ],
  ),
  ...family(
    { make: "BMW", model: "3 Series", generation: "F30", facelift: null, yearFrom: 2012, yearTo: 2015 },
    [
      { body: "Sedan", engine: "2.0 B47", engineCode: "B47D20", fuel: "DIESEL", power: 190, drive: "RWD", transmission: "Automatic" },
      { body: "Sedan", engine: "3.0 N55", engineCode: "N55B30", fuel: "PETROL", power: 306, drive: "RWD", transmission: "Automatic" },
    ],
  ),
  ...family(
    { make: "BMW", model: "5 Series", generation: "F10", facelift: null, yearFrom: 2010, yearTo: 2013 },
    [
      { body: "Sedan", engine: "3.0 N57", engineCode: "N57D30", fuel: "DIESEL", power: 245, drive: "RWD", transmission: "Automatic" },
      { body: "Sedan", engine: "3.0 N55", engineCode: "N55B30", fuel: "PETROL", power: 306, drive: "RWD", transmission: "Automatic" },
    ],
  ),
  ...family(
    { make: "Mercedes-Benz", model: "C-Class", generation: "W204", facelift: null, yearFrom: 2007, yearTo: 2011 },
    [
      { body: "Sedan", engine: "C250 CDI", engineCode: "OM651", fuel: "DIESEL", power: 204, drive: "RWD", transmission: "Automatic" },
      { body: "Sedan", engine: "C63 AMG", engineCode: "M156", fuel: "PETROL", power: 457, drive: "RWD", transmission: "Automatic" },
    ],
  ),
  ...family(
    { make: "Mercedes-Benz", model: "C-Class", generation: "W204", facelift: "LCI", yearFrom: 2011, yearTo: 2014 },
    [
      { body: "Sedan", engine: "C250 CDI", engineCode: "OM651", fuel: "DIESEL", power: 204, drive: "RWD", transmission: "Automatic" },
      { body: "Coupe", engine: "C63 AMG", engineCode: "M156", fuel: "PETROL", power: 457, drive: "RWD", transmission: "Automatic" },
    ],
  ),
  ...family(
    { make: "Mercedes-Benz", model: "C-Class", generation: "W205", facelift: null, yearFrom: 2014, yearTo: 2018 },
    [
      { body: "Sedan", engine: "C220d", engineCode: "OM651", fuel: "DIESEL", power: 170, drive: "RWD", transmission: "Automatic" },
      { body: "Sedan", engine: "C43 AMG", engineCode: "M276", fuel: "PETROL", power: 367, drive: "AWD", transmission: "Automatic" },
    ],
  ),
  ...family(
    { make: "Mercedes-Benz", model: "E-Class", generation: "W212", facelift: "LCI", yearFrom: 2013, yearTo: 2016 },
    [
      { body: "Sedan", engine: "E350 CDI", engineCode: "OM642", fuel: "DIESEL", power: 252, drive: "RWD", transmission: "Automatic" },
      { body: "Estate", engine: "E400", engineCode: "M276", fuel: "PETROL", power: 333, drive: "AWD", transmission: "Automatic" },
    ],
  ),
];

export function vehicleLabel(vehicle: Vehicle, detail = true) {
  const base = `${vehicle.make} ${vehicle.model} ${vehicle.generation}`;
  if (!detail) return base;
  return `${base} ${vehicle.engine} ${vehicle.drive === "AWD" ? "Quattro" : vehicle.drive}`;
}

export function matchesSelection(vehicle: Vehicle, selection: {
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
  if (selection.make && vehicle.make !== selection.make) return false;
  if (selection.model && vehicle.model !== selection.model) return false;
  if (selection.generation && vehicle.generation !== selection.generation) return false;
  if (selection.year && (vehicle.yearFrom > selection.year || vehicle.yearTo < selection.year)) return false;
  if (selection.body && vehicle.body !== selection.body) return false;
  if (selection.engine && vehicle.engine !== selection.engine) return false;
  if (selection.fuel && vehicle.fuel !== selection.fuel) return false;
  if (selection.drive && vehicle.drive !== selection.drive) return false;
  if (selection.transmission && vehicle.transmission !== selection.transmission) return false;
  return true;
}

export function uniqueOptions<K extends keyof Vehicle>(list: Vehicle[], key: K) {
  return [...new Set(list.map((item) => item[key]))] as Vehicle[K][];
}
