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

export type Variant = {
  body: string;
  engine: string;
  engineCode: string;
  fuel: Fuel;
  power: number;
  drive: Drive;
  transmission: string;
};

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

const petrol = (body: string, engine: string, code: string, power: number, drive: Drive = "FWD", transmission = "Manual"): Variant => ({
  body, engine, engineCode: code, fuel: "PETROL", power, drive, transmission,
});
const diesel = (body: string, engine: string, code: string, power: number, drive: Drive = "FWD", transmission = "Automatic"): Variant => ({
  body, engine, engineCode: code, fuel: "DIESEL", power, drive, transmission,
});

export const vehicleFamilies: VehicleFamily[] = [
  family({ make: "Audi", model: "A1", generation: "GB", facelift: null, yearFrom: 2018, yearTo: 2024 }, [
    petrol("Sportback", "1.0 TFSI", "DKRF", 116), diesel("Sportback", "1.6 TDI", "DGTB", 116),
  ]),
  family({ make: "Audi", model: "A3", generation: "8V", facelift: null, yearFrom: 2012, yearTo: 2016 }, [
    diesel("Sportback", "2.0 TDI", "CRBC", 150), petrol("Sedan", "2.0 TFSI", "CNTC", 220, "AWD", "Automatic"),
  ]),
  family({ make: "Audi", model: "A3", generation: "8Y", facelift: null, yearFrom: 2020, yearTo: 2025 }, [
    petrol("Sportback", "2.0 TFSI S3", "DNUE", 310, "AWD", "Automatic"), diesel("Sportback", "2.0 TDI", "DTUA", 150, "FWD", "Automatic"),
  ]),
  family({ make: "Audi", model: "A4", generation: "B8", facelift: "B8.5", yearFrom: 2012, yearTo: 2015 }, [
    diesel("Sedan", "2.0 TDI", "CGLC", 177, "FWD", "Manual"), petrol("Avant", "2.0 TFSI", "CNCD", 225, "AWD", "Automatic"),
  ]),
  family({ make: "Audi", model: "A4", generation: "B9", facelift: null, yearFrom: 2015, yearTo: 2019 }, [
    diesel("Sedan", "2.0 TDI", "DETA", 190, "AWD", "Automatic"), petrol("Avant", "2.0 TFSI", "CYRB", 252, "AWD", "Automatic"),
  ]),
  family({ make: "Audi", model: "A5", generation: "B8", facelift: "B8.5", yearFrom: 2011, yearTo: 2016 }, [
    diesel("Coupe", "3.0 TDI", "CDUC", 245, "AWD", "Automatic"), petrol("Sportback", "2.0 TFSI", "CNCD", 225, "AWD", "Automatic"),
  ]),
  family({ make: "Audi", model: "A5", generation: "B9", facelift: null, yearFrom: 2016, yearTo: 2020 }, [
    diesel("Coupe", "3.0 TDI", "DELA", 286, "AWD", "Automatic"), petrol("Sportback", "2.0 TFSI", "CYRB", 252, "AWD", "Automatic"),
  ]),
  family({ make: "Audi", model: "A6", generation: "C7", facelift: null, yearFrom: 2011, yearTo: 2014 }, [
    diesel("Sedan", "3.0 TDI", "CDUC", 245, "AWD", "Automatic"), diesel("Avant", "3.0 TDI", "CDUC", 245, "AWD", "Automatic"),
    diesel("Sedan", "2.0 TDI", "CNHA", 177), petrol("Sedan", "3.0 TFSI", "CGWB", 300, "AWD", "Automatic"),
  ]),
  family({ make: "Audi", model: "A6", generation: "C7", facelift: "C7.5", yearFrom: 2015, yearTo: 2018 }, [
    diesel("Sedan", "3.0 TDI", "CVUA", 272, "AWD", "Automatic"), diesel("Avant", "3.0 TDI", "CVUA", 272, "AWD", "Automatic"),
    diesel("Sedan", "2.0 TDI", "DEJA", 190), petrol("Sedan", "3.0 TFSI", "CREC", 333, "AWD", "Automatic"),
  ]),
  family({ make: "Audi", model: "A6", generation: "C8", facelift: null, yearFrom: 2018, yearTo: 2025 }, [
    diesel("Sedan", "3.0 TDI", "DDVB", 286, "AWD", "Automatic"), petrol("Avant", "3.0 TFSI", "DLZA", 340, "AWD", "Automatic"),
  ]),
  family({ make: "Audi", model: "A7", generation: "C7", facelift: null, yearFrom: 2010, yearTo: 2018 }, [
    diesel("Sportback", "3.0 TDI", "CDUC", 245, "AWD", "Automatic"), petrol("Sportback", "3.0 TFSI", "CGWB", 300, "AWD", "Automatic"),
  ]),
  family({ make: "Audi", model: "A8", generation: "D4", facelift: null, yearFrom: 2010, yearTo: 2017 }, [
    diesel("Sedan", "3.0 TDI", "CDUC", 250, "AWD", "Automatic"), petrol("Sedan", "4.0 TFSI", "CEUA", 435, "AWD", "Automatic"),
  ]),
  family({ make: "Audi", model: "Q3", generation: "F3", facelift: null, yearFrom: 2018, yearTo: 2025 }, [
    petrol("SUV", "2.0 TFSI", "DNUA", 190, "AWD", "Automatic"), diesel("SUV", "2.0 TDI", "DTUA", 150, "AWD", "Automatic"),
  ]),
  family({ make: "Audi", model: "Q5", generation: "FY", facelift: null, yearFrom: 2017, yearTo: 2025 }, [
    diesel("SUV", "2.0 TDI", "DETA", 190, "AWD", "Automatic"), petrol("SUV", "2.0 TFSI", "CYRB", 252, "AWD", "Automatic"),
  ]),
  family({ make: "Audi", model: "Q7", generation: "4M", facelift: null, yearFrom: 2015, yearTo: 2025 }, [
    diesel("SUV", "3.0 TDI", "CRTC", 272, "AWD", "Automatic"), petrol("SUV", "3.0 TFSI", "CREC", 333, "AWD", "Automatic"),
  ]),
  family({ make: "Audi", model: "TT", generation: "8S", facelift: null, yearFrom: 2014, yearTo: 2023 }, [
    petrol("Coupe", "2.0 TFSI", "CHHC", 230, "AWD", "Automatic"), diesel("Coupe", "2.0 TDI", "CUNA", 184),
  ]),
  family({ make: "Audi", model: "RS6", generation: "C7", facelift: null, yearFrom: 2013, yearTo: 2018 }, [
    petrol("Avant", "4.0 TFSI", "CRDB", 560, "AWD", "Automatic"),
  ]),
  family({ make: "Volkswagen", model: "Polo", generation: "6C", facelift: null, yearFrom: 2014, yearTo: 2017 }, [
    petrol("Hatchback", "1.2 TSI", "CJZC", 90), diesel("Hatchback", "1.4 TDI", "CUTA", 90),
  ]),
  family({ make: "Volkswagen", model: "Polo", generation: "AW", facelift: null, yearFrom: 2017, yearTo: 2025 }, [
    petrol("Hatchback", "2.0 TSI GTI", "DKZC", 200), diesel("Hatchback", "1.6 TDI", "DGTD", 95),
  ]),
  family({ make: "Volkswagen", model: "Golf", generation: "Mk6", facelift: null, yearFrom: 2008, yearTo: 2012 }, [
    petrol("Hatchback", "2.0 TSI GTI", "CCZB", 210), diesel("Hatchback", "2.0 TDI", "CBAB", 140),
  ]),
  family({ make: "Volkswagen", model: "Golf", generation: "Mk7", facelift: null, yearFrom: 2013, yearTo: 2017 }, [
    petrol("Hatchback", "2.0 TSI GTI", "CHHA", 220), petrol("Hatchback", "2.0 TSI R", "CJXC", 300, "AWD", "Automatic"),
    diesel("Hatchback", "2.0 TDI", "CRLB", 150, "FWD", "Manual"),
  ]),
  family({ make: "Volkswagen", model: "Golf", generation: "Mk8", facelift: null, yearFrom: 2020, yearTo: 2025 }, [
    petrol("Hatchback", "2.0 TSI GTI", "DNUE", 245), diesel("Hatchback", "2.0 TDI", "DTUA", 150, "FWD", "Automatic"),
  ]),
  family({ make: "Volkswagen", model: "Passat", generation: "B7", facelift: null, yearFrom: 2010, yearTo: 2014 }, [
    diesel("Sedan", "2.0 TDI", "CFFB", 140), petrol("Variant", "1.8 TSI", "CDAA", 160),
  ]),
  family({ make: "Volkswagen", model: "Passat", generation: "B8", facelift: null, yearFrom: 2015, yearTo: 2023 }, [
    diesel("Sedan", "2.0 TDI", "CRL", 150, "FWD", "Automatic"), petrol("Variant", "2.0 TSI", "CHHB", 220, "AWD", "Automatic"),
  ]),
  family({ make: "Volkswagen", model: "Tiguan", generation: "Mk1", facelift: null, yearFrom: 2007, yearTo: 2016 }, [
    diesel("SUV", "2.0 TDI", "CFFB", 140, "AWD", "Automatic"), petrol("SUV", "2.0 TSI", "CCZA", 200, "AWD", "Automatic"),
  ]),
  family({ make: "Volkswagen", model: "Tiguan", generation: "Mk2", facelift: null, yearFrom: 2016, yearTo: 2023 }, [
    diesel("SUV", "2.0 TDI", "DFGA", 150, "AWD", "Automatic"), petrol("SUV", "2.0 TSI", "CZPA", 190, "AWD", "Automatic"),
  ]),
  family({ make: "Volkswagen", model: "Touareg", generation: "CR", facelift: null, yearFrom: 2018, yearTo: 2025 }, [
    diesel("SUV", "3.0 TDI", "DDVB", 286, "AWD", "Automatic"), petrol("SUV", "3.0 TFSI", "DCFA", 340, "AWD", "Automatic"),
  ]),
  family({ make: "Volkswagen", model: "Arteon", generation: "3H", facelift: null, yearFrom: 2017, yearTo: 2024 }, [
    petrol("Fastback", "2.0 TSI", "DNUE", 280, "AWD", "Automatic"), diesel("Fastback", "2.0 TDI", "DFGA", 190, "AWD", "Automatic"),
  ]),
  family({ make: "Volkswagen", model: "Scirocco", generation: "Mk3", facelift: null, yearFrom: 2008, yearTo: 2017 }, [
    petrol("Coupe", "2.0 TSI", "CCZB", 210), diesel("Coupe", "2.0 TDI", "CBBB", 170),
  ]),
  family({ make: "Škoda", model: "Fabia", generation: "NJ", facelift: null, yearFrom: 2014, yearTo: 2021 }, [
    petrol("Hatchback", "1.2 TSI", "CJZC", 90), diesel("Hatchback", "1.4 TDI", "CUTA", 90),
  ]),
  family({ make: "Škoda", model: "Octavia", generation: "Mk3", facelift: null, yearFrom: 2013, yearTo: 2017 }, [
    diesel("Liftback", "2.0 TDI", "CRMB", 150, "FWD", "Manual"), petrol("Estate", "2.0 TSI vRS", "CHHB", 220),
  ]),
  family({ make: "Škoda", model: "Octavia", generation: "Mk4", facelift: null, yearFrom: 2020, yearTo: 2025 }, [
    petrol("Liftback", "2.0 TSI vRS", "DNUE", 245), diesel("Estate", "2.0 TDI", "DTUA", 150, "FWD", "Automatic"),
  ]),
  family({ make: "Škoda", model: "Superb", generation: "B8", facelift: null, yearFrom: 2015, yearTo: 2023 }, [
    diesel("Hatchback", "2.0 TDI", "CRL", 190, "AWD", "Automatic"), petrol("Estate", "2.0 TSI", "CHHB", 220, "AWD", "Automatic"),
  ]),
  family({ make: "Škoda", model: "Kodiaq", generation: "NS7", facelift: null, yearFrom: 2016, yearTo: 2024 }, [
    diesel("SUV", "2.0 TDI", "DFGA", 190, "AWD", "Automatic"), petrol("SUV", "2.0 TSI", "CZPA", 190, "AWD", "Automatic"),
  ]),
  family({ make: "Škoda", model: "Karoq", generation: "NU7", facelift: null, yearFrom: 2017, yearTo: 2025 }, [
    diesel("SUV", "2.0 TDI", "DFGA", 150, "AWD", "Automatic"), petrol("SUV", "1.5 TSI", "DADA", 150),
  ]),
  family({ make: "Škoda", model: "Scala", generation: "NW1", facelift: null, yearFrom: 2019, yearTo: 2025 }, [
    petrol("Hatchback", "1.5 TSI", "DADA", 150), diesel("Hatchback", "1.6 TDI", "DGTD", 115),
  ]),
  family({ make: "SEAT", model: "Ibiza", generation: "KJ", facelift: null, yearFrom: 2017, yearTo: 2025 }, [
    petrol("Hatchback", "1.5 TSI FR", "DADA", 150), diesel("Hatchback", "1.6 TDI", "DGTD", 95),
  ]),
  family({ make: "SEAT", model: "Leon", generation: "Mk3", facelift: null, yearFrom: 2012, yearTo: 2016 }, [
    petrol("Hatchback", "2.0 TSI Cupra", "CHHA", 265), diesel("Hatchback", "2.0 TDI FR", "CRBC", 150, "FWD", "Manual"),
  ]),
  family({ make: "SEAT", model: "Leon", generation: "Mk4", facelift: null, yearFrom: 2020, yearTo: 2025 }, [
    petrol("Hatchback", "2.0 TSI Cupra", "DNUE", 300, "AWD", "Automatic"), diesel("Sportstourer", "2.0 TDI", "DTUA", 150, "FWD", "Automatic"),
  ]),
  family({ make: "SEAT", model: "Ateca", generation: "KH7", facelift: null, yearFrom: 2016, yearTo: 2024 }, [
    petrol("SUV", "2.0 TSI Cupra", "DNUE", 300, "AWD", "Automatic"), diesel("SUV", "2.0 TDI", "DFGA", 150, "AWD", "Automatic"),
  ]),
  family({ make: "SEAT", model: "Arona", generation: "KJ7", facelift: null, yearFrom: 2017, yearTo: 2025 }, [
    petrol("SUV", "1.5 TSI FR", "DADA", 150), diesel("SUV", "1.6 TDI", "DGTD", 95),
  ]),
  family({ make: "BMW", model: "1 Series", generation: "E87", facelift: null, yearFrom: 2004, yearTo: 2011, pcd: "5x120", centerBore: "72.6" }, [
    petrol("Hatchback", "3.0 N54", "N54B30", 306, "RWD", "Automatic"), diesel("Hatchback", "2.0 N47", "N47D20", 177, "RWD", "Manual"),
  ]),
  family({ make: "BMW", model: "1 Series", generation: "F20", facelift: null, yearFrom: 2011, yearTo: 2019, pcd: "5x120", centerBore: "72.6" }, [
    petrol("Hatchback", "3.0 N55 M135i", "N55B30", 320, "RWD", "Automatic"), diesel("Hatchback", "2.0 N47", "N47D20", 184, "RWD", "Automatic"),
  ]),
  family({ make: "BMW", model: "2 Series", generation: "F22", facelift: null, yearFrom: 2014, yearTo: 2021, pcd: "5x120", centerBore: "72.6" }, [
    petrol("Coupe", "3.0 N55 M235i", "N55B30", 326, "RWD", "Automatic"), diesel("Coupe", "2.0 B47", "B47D20", 190, "RWD", "Automatic"),
  ]),
  family({ make: "BMW", model: "3 Series", generation: "E90", facelift: null, yearFrom: 2005, yearTo: 2011, pcd: "5x120", centerBore: "72.6" }, [
    petrol("Sedan", "3.0 N54", "N54B30", 306, "RWD", "Automatic"), diesel("Sedan", "3.0 M57", "M57D30", 231, "RWD", "Automatic"),
  ]),
  family({ make: "BMW", model: "3 Series", generation: "E92", facelift: null, yearFrom: 2006, yearTo: 2010, pcd: "5x120", centerBore: "72.6" }, [
    petrol("Coupe", "3.0 N54", "N54B30", 306, "RWD", "Automatic"), diesel("Coupe", "3.0 N57", "N57D30", 245, "RWD", "Automatic"),
  ]),
  family({ make: "BMW", model: "3 Series", generation: "E92", facelift: "LCI", yearFrom: 2010, yearTo: 2013, pcd: "5x120", centerBore: "72.6" }, [
    petrol("Coupe", "3.0 N54", "N54B30", 306, "RWD", "Automatic"), petrol("Coupe", "3.0 N55", "N55B30", 306, "RWD", "Automatic"),
  ]),
  family({ make: "BMW", model: "3 Series", generation: "F30", facelift: null, yearFrom: 2012, yearTo: 2015, pcd: "5x120", centerBore: "72.6" }, [
    diesel("Sedan", "2.0 B47", "B47D20", 190, "RWD", "Automatic"), petrol("Sedan", "3.0 N55", "N55B30", 306, "RWD", "Automatic"),
  ]),
  family({ make: "BMW", model: "3 Series", generation: "G20", facelift: null, yearFrom: 2019, yearTo: 2025, pcd: "5x112", centerBore: "66.6" }, [
    petrol("Sedan", "3.0 B58 M340i", "B58B30", 374, "AWD", "Automatic"), diesel("Sedan", "2.0 B47", "B47D20", 190, "RWD", "Automatic"),
  ]),
  family({ make: "BMW", model: "4 Series", generation: "F32", facelift: null, yearFrom: 2013, yearTo: 2020, pcd: "5x120", centerBore: "72.6" }, [
    petrol("Coupe", "3.0 N55", "N55B30", 306, "RWD", "Automatic"), diesel("Coupe", "2.0 B47", "B47D20", 190, "RWD", "Automatic"),
  ]),
  family({ make: "BMW", model: "5 Series", generation: "F10", facelift: null, yearFrom: 2010, yearTo: 2013, pcd: "5x120", centerBore: "72.6" }, [
    diesel("Sedan", "3.0 N57", "N57D30", 245, "RWD", "Automatic"), petrol("Sedan", "3.0 N55", "N55B30", 306, "RWD", "Automatic"),
  ]),
  family({ make: "BMW", model: "5 Series", generation: "G30", facelift: null, yearFrom: 2017, yearTo: 2023, pcd: "5x112", centerBore: "66.6" }, [
    diesel("Sedan", "3.0 B57", "B57D30", 265, "AWD", "Automatic"), petrol("Sedan", "3.0 B58", "B58B30", 340, "AWD", "Automatic"),
  ]),
  family({ make: "BMW", model: "X3", generation: "F25", facelift: null, yearFrom: 2010, yearTo: 2017, pcd: "5x120", centerBore: "72.6" }, [
    diesel("SUV", "3.0 N57", "N57D30", 258, "AWD", "Automatic"), petrol("SUV", "3.0 N55", "N55B30", 306, "AWD", "Automatic"),
  ]),
  family({ make: "BMW", model: "X5", generation: "E70", facelift: null, yearFrom: 2006, yearTo: 2013, pcd: "5x120", centerBore: "72.6" }, [
    diesel("SUV", "3.0 M57", "M57D30", 235, "AWD", "Automatic"), petrol("SUV", "4.8 N62", "N62B48", 355, "AWD", "Automatic"),
  ]),
  family({ make: "BMW", model: "X5", generation: "F15", facelift: null, yearFrom: 2013, yearTo: 2018, pcd: "5x120", centerBore: "72.6" }, [
    diesel("SUV", "3.0 N57", "N57D30", 258, "AWD", "Automatic"), petrol("SUV", "4.4 N63", "N63B44", 450, "AWD", "Automatic"),
  ]),
  family({ make: "BMW", model: "M3", generation: "E92", facelift: null, yearFrom: 2007, yearTo: 2013, pcd: "5x120", centerBore: "72.6" }, [
    petrol("Coupe", "4.0 V8", "S65B40", 420, "RWD", "Manual"),
  ]),
  family({ make: "Mercedes-Benz", model: "A-Class", generation: "W176", facelift: null, yearFrom: 2012, yearTo: 2018 }, [
    petrol("Hatchback", "A250", "M270", 211, "FWD", "Automatic"), diesel("Hatchback", "A200 CDI", "OM651", 136),
  ]),
  family({ make: "Mercedes-Benz", model: "A-Class", generation: "W177", facelift: null, yearFrom: 2018, yearTo: 2025 }, [
    petrol("Hatchback", "A35 AMG", "M260", 306, "AWD", "Automatic"), diesel("Hatchback", "A200d", "OM654", 150, "FWD", "Automatic"),
  ]),
  family({ make: "Mercedes-Benz", model: "C-Class", generation: "W204", facelift: null, yearFrom: 2007, yearTo: 2011 }, [
    diesel("Sedan", "C250 CDI", "OM651", 204, "RWD", "Automatic"), petrol("Sedan", "C63 AMG", "M156", 457, "RWD", "Automatic"),
  ]),
  family({ make: "Mercedes-Benz", model: "C-Class", generation: "W204", facelift: "LCI", yearFrom: 2011, yearTo: 2014 }, [
    diesel("Sedan", "C250 CDI", "OM651", 204, "RWD", "Automatic"), petrol("Coupe", "C63 AMG", "M156", 457, "RWD", "Automatic"),
  ]),
  family({ make: "Mercedes-Benz", model: "C-Class", generation: "W205", facelift: null, yearFrom: 2014, yearTo: 2018 }, [
    diesel("Sedan", "C220d", "OM651", 170, "RWD", "Automatic"), petrol("Sedan", "C43 AMG", "M276", 367, "AWD", "Automatic"),
  ]),
  family({ make: "Mercedes-Benz", model: "C-Class", generation: "W206", facelift: null, yearFrom: 2021, yearTo: 2025 }, [
    diesel("Sedan", "C220d", "OM654", 200, "RWD", "Automatic"), petrol("Sedan", "C43 AMG", "M139", 408, "AWD", "Automatic"),
  ]),
  family({ make: "Mercedes-Benz", model: "CLA", generation: "C117", facelift: null, yearFrom: 2013, yearTo: 2019 }, [
    petrol("Coupe", "CLA45 AMG", "M133", 360, "AWD", "Automatic"), diesel("Coupe", "CLA200 CDI", "OM651", 136, "FWD", "Automatic"),
  ]),
  family({ make: "Mercedes-Benz", model: "E-Class", generation: "W212", facelift: "LCI", yearFrom: 2013, yearTo: 2016 }, [
    diesel("Sedan", "E350 CDI", "OM642", 252, "RWD", "Automatic"), petrol("Estate", "E400", "M276", 333, "AWD", "Automatic"),
  ]),
  family({ make: "Mercedes-Benz", model: "E-Class", generation: "W213", facelift: null, yearFrom: 2016, yearTo: 2023 }, [
    diesel("Sedan", "E220d", "OM654", 194, "RWD", "Automatic"), petrol("Sedan", "E53 AMG", "M256", 435, "AWD", "Automatic"),
  ]),
  family({ make: "Mercedes-Benz", model: "S-Class", generation: "W222", facelift: null, yearFrom: 2013, yearTo: 2020 }, [
    diesel("Sedan", "S350d", "OM642", 258, "RWD", "Automatic"), petrol("Sedan", "S500", "M278", 455, "AWD", "Automatic"),
  ]),
  family({ make: "Mercedes-Benz", model: "GLC", generation: "X253", facelift: null, yearFrom: 2015, yearTo: 2022 }, [
    diesel("SUV", "GLC220d", "OM651", 170, "AWD", "Automatic"), petrol("SUV", "GLC43 AMG", "M276", 367, "AWD", "Automatic"),
  ]),
  family({ make: "Mercedes-Benz", model: "GLE", generation: "W166", facelift: null, yearFrom: 2015, yearTo: 2018 }, [
    diesel("SUV", "GLE350d", "OM642", 258, "AWD", "Automatic"), petrol("SUV", "GLE43 AMG", "M276", 367, "AWD", "Automatic"),
  ]),
  family({ make: "Porsche", model: "911", generation: "991", facelift: null, yearFrom: 2011, yearTo: 2019, pcd: "5x130", centerBore: "71.6" }, [
    petrol("Coupe", "3.4", "MA1.04", 350, "RWD", "Automatic"), petrol("Coupe", "3.8 Turbo", "MA1.70", 540, "AWD", "Automatic"),
  ]),
  family({ make: "Porsche", model: "911", generation: "992", facelift: null, yearFrom: 2019, yearTo: 2025, pcd: "5x130", centerBore: "71.6" }, [
    petrol("Coupe", "3.0 Turbo", "9A2", 385, "RWD", "Automatic"), petrol("Coupe", "3.8 Turbo S", "9A2", 650, "AWD", "Automatic"),
  ]),
  family({ make: "Porsche", model: "Cayenne", generation: "92A", facelift: null, yearFrom: 2010, yearTo: 2017, pcd: "5x130", centerBore: "71.6" }, [
    diesel("SUV", "3.0 TDI", "MCR.C", 245, "AWD", "Automatic"), petrol("SUV", "4.8 Turbo", "M48.52", 500, "AWD", "Automatic"),
  ]),
  family({ make: "Porsche", model: "Macan", generation: "95B", facelift: null, yearFrom: 2014, yearTo: 2021, pcd: "5x112", centerBore: "66.6" }, [
    petrol("SUV", "3.0 S", "MCG.E", 340, "AWD", "Automatic"), diesel("SUV", "3.0 S Diesel", "MCN.B", 258, "AWD", "Automatic"),
  ]),
  family({ make: "Porsche", model: "Panamera", generation: "971", facelift: null, yearFrom: 2016, yearTo: 2023, pcd: "5x112", centerBore: "66.6" }, [
    petrol("Hatchback", "2.9 S", "MCX.ZA", 440, "AWD", "Automatic"), diesel("Hatchback", "3.0 Diesel", "MCY.A", 286, "AWD", "Automatic"),
  ]),
  family({ make: "Volvo", model: "S60", generation: "P3", facelift: null, yearFrom: 2010, yearTo: 2018, pcd: "5x108", centerBore: "63.4" }, [
    petrol("Sedan", "T6", "B6304T4", 304, "AWD", "Automatic"), diesel("Sedan", "D5", "D5244T15", 215, "AWD", "Automatic"),
  ]),
  family({ make: "Volvo", model: "V60", generation: "P3", facelift: null, yearFrom: 2010, yearTo: 2018, pcd: "5x108", centerBore: "63.4" }, [
    petrol("Estate", "T6", "B6304T4", 304, "AWD", "Automatic"), diesel("Estate", "D5", "D5244T15", 215, "FWD", "Automatic"),
  ]),
  family({ make: "Volvo", model: "XC60", generation: "P3", facelift: null, yearFrom: 2008, yearTo: 2017, pcd: "5x108", centerBore: "63.4" }, [
    diesel("SUV", "D5", "D5244T11", 215, "AWD", "Automatic"), petrol("SUV", "T6", "B6304T4", 304, "AWD", "Automatic"),
  ]),
  family({ make: "Volvo", model: "XC90", generation: "SPA", facelift: null, yearFrom: 2015, yearTo: 2025, pcd: "5x108", centerBore: "63.4" }, [
    diesel("SUV", "D5", "D4204T11", 235, "AWD", "Automatic"), petrol("SUV", "T6", "B4204T9", 320, "AWD", "Automatic"),
  ]),
  family({ make: "Volvo", model: "XC40", generation: "CMA", facelift: null, yearFrom: 2017, yearTo: 2025, pcd: "5x108", centerBore: "63.4" }, [
    petrol("SUV", "T5", "B4204T18", 247, "AWD", "Automatic"), diesel("SUV", "D4", "D4204T12", 190, "AWD", "Automatic"),
  ]),
  family({ make: "Toyota", model: "Corolla", generation: "E210", facelift: null, yearFrom: 2018, yearTo: 2025, pcd: "5x114.3", centerBore: "60.1" }, [
    petrol("Hatchback", "2.0 Hybrid", "M20A", 184, "FWD", "Automatic"), petrol("Sedan", "1.8 Hybrid", "2ZR", 122, "FWD", "Automatic"),
  ]),
  family({ make: "Toyota", model: "Yaris", generation: "XP210", facelift: null, yearFrom: 2020, yearTo: 2025, pcd: "4x100", centerBore: "54.1" }, [
    petrol("Hatchback", "1.5 Hybrid", "M15A", 116, "FWD", "Automatic"), petrol("Hatchback", "1.6 GR", "G16E", 261, "AWD", "Manual"),
  ]),
  family({ make: "Toyota", model: "RAV4", generation: "XA50", facelift: null, yearFrom: 2018, yearTo: 2025, pcd: "5x114.3", centerBore: "60.1" }, [
    petrol("SUV", "2.5 Hybrid", "A25A", 222, "AWD", "Automatic"), petrol("SUV", "2.5", "A25A", 203, "FWD", "Automatic"),
  ]),
  family({ make: "Toyota", model: "Supra", generation: "A90", facelift: null, yearFrom: 2019, yearTo: 2025, pcd: "5x112", centerBore: "66.6" }, [
    petrol("Coupe", "3.0 B58", "B58B30", 340, "RWD", "Automatic"), petrol("Coupe", "2.0 B48", "B48B20", 258, "RWD", "Automatic"),
  ]),
  family({ make: "Toyota", model: "Land Cruiser", generation: "J200", facelift: null, yearFrom: 2007, yearTo: 2021, pcd: "5x150", centerBore: "110" }, [
    diesel("SUV", "4.5 V8", "1VD-FTV", 272, "AWD", "Automatic"), petrol("SUV", "4.6 V8", "1UR-FE", 318, "AWD", "Automatic"),
  ]),
  family({ make: "Toyota", model: "Avensis", generation: "T27", facelift: null, yearFrom: 2008, yearTo: 2018, pcd: "5x114.3", centerBore: "60.1" }, [
    diesel("Sedan", "2.0 D-4D", "2AD-FTV", 126, "FWD", "Manual"), petrol("Estate", "1.8", "2ZR-FAE", 147),
  ]),
  family({ make: "Honda", model: "Civic", generation: "FK", facelift: null, yearFrom: 2016, yearTo: 2021, pcd: "5x114.3", centerBore: "64.1" }, [
    petrol("Hatchback", "2.0 VTEC Turbo Type R", "K20C1", 320), petrol("Hatchback", "1.5 VTEC Turbo", "L15B7", 182),
  ]),
  family({ make: "Honda", model: "Civic", generation: "FL", facelift: null, yearFrom: 2022, yearTo: 2025, pcd: "5x114.3", centerBore: "64.1" }, [
    petrol("Hatchback", "2.0 Type R", "K20C1", 329), petrol("Hatchback", "2.0 Hybrid", "LFC", 184, "FWD", "Automatic"),
  ]),
  family({ make: "Honda", model: "Accord", generation: "CV", facelift: null, yearFrom: 2018, yearTo: 2023, pcd: "5x114.3", centerBore: "64.1" }, [
    petrol("Sedan", "2.0 Hybrid", "LFB", 212, "FWD", "Automatic"), petrol("Sedan", "1.5 Turbo", "L15BE", 192),
  ]),
  family({ make: "Honda", model: "CR-V", generation: "RW", facelift: null, yearFrom: 2017, yearTo: 2022, pcd: "5x114.3", centerBore: "64.1" }, [
    petrol("SUV", "1.5 Turbo", "L15BE", 193, "AWD", "Automatic"), petrol("SUV", "2.0 Hybrid", "LFB", 184, "AWD", "Automatic"),
  ]),
  family({ make: "Nissan", model: "Qashqai", generation: "J11", facelift: null, yearFrom: 2013, yearTo: 2021, pcd: "5x114.3", centerBore: "66.1" }, [
    diesel("SUV", "1.6 dCi", "R9M", 130), petrol("SUV", "1.6 DIG-T", "MR16DDT", 163),
  ]),
  family({ make: "Nissan", model: "Qashqai", generation: "J12", facelift: null, yearFrom: 2021, yearTo: 2025, pcd: "5x114.3", centerBore: "66.1" }, [
    petrol("SUV", "1.3 DIG-T", "HR13", 158), petrol("SUV", "1.5 e-Power", "KR15", 190, "FWD", "Automatic"),
  ]),
  family({ make: "Nissan", model: "Juke", generation: "F15", facelift: null, yearFrom: 2010, yearTo: 2019, pcd: "5x114.3", centerBore: "66.1" }, [
    petrol("SUV", "1.6 DIG-T", "MR16DDT", 190), diesel("SUV", "1.5 dCi", "K9K", 110),
  ]),
  family({ make: "Nissan", model: "370Z", generation: "Z34", facelift: null, yearFrom: 2009, yearTo: 2020, pcd: "5x114.3", centerBore: "66.1" }, [
    petrol("Coupe", "3.7 V6", "VQ37VHR", 328, "RWD", "Manual"),
  ]),
  family({ make: "Nissan", model: "X-Trail", generation: "T32", facelift: null, yearFrom: 2013, yearTo: 2021, pcd: "5x114.3", centerBore: "66.1" }, [
    diesel("SUV", "1.6 dCi", "R9M", 130, "AWD", "Manual"), petrol("SUV", "1.6 DIG-T", "MR16DDT", 163),
  ]),
  family({ make: "Lexus", model: "IS", generation: "XE30", facelift: null, yearFrom: 2013, yearTo: 2020, pcd: "5x114.3", centerBore: "60.1" }, [
    petrol("Sedan", "3.5 V6", "2GR-FSE", 306, "RWD", "Automatic"), diesel("Sedan", "2.2", "2AD-FTV", 177, "RWD", "Automatic"),
  ]),
  family({ make: "Lexus", model: "RX", generation: "AL20", facelift: null, yearFrom: 2015, yearTo: 2022, pcd: "5x114.3", centerBore: "60.1" }, [
    petrol("SUV", "3.5 Hybrid", "2GR-FXS", 313, "AWD", "Automatic"), petrol("SUV", "2.0 Turbo", "8AR-FTS", 238, "FWD", "Automatic"),
  ]),
  family({ make: "Lexus", model: "NX", generation: "AZ10", facelift: null, yearFrom: 2014, yearTo: 2021, pcd: "5x114.3", centerBore: "60.1" }, [
    petrol("SUV", "2.0 Turbo", "8AR-FTS", 238, "AWD", "Automatic"), petrol("SUV", "2.5 Hybrid", "A25A", 197, "AWD", "Automatic"),
  ]),
  family({ make: "Lexus", model: "GS", generation: "L10", facelift: null, yearFrom: 2012, yearTo: 2020, pcd: "5x114.3", centerBore: "60.1" }, [
    petrol("Sedan", "3.5 V6", "2GR-FSE", 316, "RWD", "Automatic"), petrol("Sedan", "2.5 Hybrid", "2AR-FSE", 223, "RWD", "Automatic"),
  ]),
  family({ make: "Ford", model: "Fiesta", generation: "Mk7", facelift: null, yearFrom: 2008, yearTo: 2017, pcd: "4x108", centerBore: "63.4" }, [
    petrol("Hatchback", "1.6 ST", "JTJA", 182), diesel("Hatchback", "1.5 TDCi", "XUJA", 75),
  ]),
  family({ make: "Ford", model: "Fiesta", generation: "Mk8", facelift: null, yearFrom: 2017, yearTo: 2023, pcd: "4x108", centerBore: "63.4" }, [
    petrol("Hatchback", "1.5 ST", "Y2JA", 200), diesel("Hatchback", "1.5 TDCi", "XUJC", 85),
  ]),
  family({ make: "Ford", model: "Focus", generation: "Mk3", facelift: null, yearFrom: 2011, yearTo: 2018, pcd: "5x108", centerBore: "63.4" }, [
    petrol("Hatchback", "2.0 ST", "R9DA", 250), diesel("Hatchback", "2.0 TDCi", "T8DA", 140),
  ]),
  family({ make: "Ford", model: "Focus", generation: "Mk4", facelift: null, yearFrom: 2018, yearTo: 2025, pcd: "5x108", centerBore: "63.4" }, [
    petrol("Hatchback", "2.3 ST", "YVDA", 280), diesel("Estate", "2.0 EcoBlue", "YLxx", 150),
  ]),
  family({ make: "Ford", model: "Mondeo", generation: "Mk5", facelift: null, yearFrom: 2014, yearTo: 2022, pcd: "5x108", centerBore: "63.4" }, [
    diesel("Sedan", "2.0 TDCi", "T8CA", 180, "FWD", "Automatic"), petrol("Estate", "2.0 EcoBoost", "R9CB", 240, "FWD", "Automatic"),
  ]),
  family({ make: "Ford", model: "Mustang", generation: "S550", facelift: null, yearFrom: 2015, yearTo: 2023, pcd: "5x114.3", centerBore: "70.5" }, [
    petrol("Coupe", "5.0 V8", "Coyote", 450, "RWD", "Manual"), petrol("Coupe", "2.3 EcoBoost", "Nano", 290, "RWD", "Automatic"),
  ]),
  family({ make: "Ford", model: "Kuga", generation: "Mk2", facelift: null, yearFrom: 2012, yearTo: 2019, pcd: "5x108", centerBore: "63.4" }, [
    diesel("SUV", "2.0 TDCi", "T8MA", 140, "AWD", "Manual"), petrol("SUV", "1.5 EcoBoost", "M8DA", 150),
  ]),
];

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

export function familyForVehicle(vehicle: Vehicle) {
  return vehicleFamilies.find(
    (item) => item.make === vehicle.make && item.model === vehicle.model && item.generation === vehicle.generation && item.yearFrom === vehicle.yearFrom,
  );
}

export function vehicleLabel(vehicle: Vehicle, detail = true) {
  const base = `${vehicle.make} ${vehicle.model} ${vehicle.generation}`;
  if (!detail) return base;
  return `${base} ${vehicle.engine} ${vehicle.drive === "AWD" ? (vehicle.make === "Audi" ? "Quattro" : "AWD") : vehicle.drive}`;
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
