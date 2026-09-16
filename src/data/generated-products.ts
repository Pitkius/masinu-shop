import type { Product } from "@/lib/types";
import { supplierProductImages } from "@/lib/suppliers/media";
import { vehicleFamilies, type VehicleFamily } from "./vehicles";
import { resolveFitment, type FitmentRule } from "@/lib/fitment";

const euShip = { origin: "EU", timeFromDays: 3, timeToDays: 7, costCents: 900 };

function slugPart(value: string) {
  return value.toLowerCase().replaceAll("š", "s").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function kitProduct(
  family: VehicleFamily,
  kind: {
    key: string;
    title: string;
    category: string;
    subcategory: string;
    price: number;
    goal: string;
    specs: Record<string, string>;
    difficulty: Product["installationDifficulty"];
    minutes: number;
    description: string;
  },
): Product {
  const makeSlug = slugPart(family.make);
  const modelSlug = slugPart(family.model);
  const genSlug = slugPart(family.generation);
  const slug = `${makeSlug}-${modelSlug}-${genSlug}-${family.yearFrom}-${kind.key}`;
  const sku = `APX-${makeSlug.slice(0, 3)}-${genSlug}-${family.yearFrom}-${kind.key}`.toUpperCase().slice(0, 32);
  const rule: FitmentRule = {
    make: family.make,
    model: family.model,
    generation: family.generation,
    yearFrom: family.yearFrom,
    yearTo: family.yearTo,
    fitmentType: "EXACT",
  };
  return {
    id: `gen-${slug}`,
    title: `${family.make} ${family.model} ${family.generation} ${kind.title}`,
    slug,
    description: kind.description,
    brand: "APEX",
    category: kind.category,
    subcategory: kind.subcategory,
    price: kind.price,
    compareAtPrice: null,
    currency: "EUR",
    stock: 12,
    sku,
    mpn: sku,
    ean: null,
    oemNumbers: [],
    crossReferences: [],
    images: supplierProductImages("eu-parts", kind.key, kind.subcategory, slug),
    videos: [],
    supplierId: "eu-parts",
    supplierSku: sku,
    weightKg: 2,
    dimensions: { l: 40, w: 30, h: 15 },
    shipping: euShip,
    installationDifficulty: kind.difficulty,
    installationTimeMin: kind.minutes,
    roadLegalStatus: "ROAD_LEGAL",
    warranty: "24 months",
    tags: [family.make.toLowerCase(), family.model.toLowerCase(), family.generation.toLowerCase(), kind.key],
    goalTags: [kind.goal],
    specifications: kind.specs,
    included: [kind.title, "Hardware"],
    whatsIncluded: [kind.title, "Hardware"],
    installationNotes: `Vehicle-specific fitment for ${family.make} ${family.model} ${family.generation} (${family.yearFrom}–${family.yearTo}).`,
    seoTitle: `${family.make} ${family.model} ${family.generation} ${kind.title}`,
    seoDescription: `${kind.title} for ${family.make} ${family.model} ${family.generation}.`,
    relatedSlugs: [],
    setupSlugs: [],
    compatibility: resolveFitment([rule]),
    createdAt: "2026-09-01",
    updatedAt: "2026-09-16",
  };
}

function kitFor(family: VehicleFamily): Product[] {
  const car = `${family.make} ${family.model} ${family.generation}`;
  return [
    kitProduct(family, {
      key: "lights",
      title: "LED Headlight Set",
      category: "lighting",
      subcategory: "headlights",
      price: 64900,
      goal: "better-lighting",
      specs: { Color: "Black housing", "Road legal": "E-marked DRL" },
      difficulty: "PROFESSIONAL",
      minutes: 150,
      description: `LED headlight housings for ${car}.`,
    }),
    kitProduct(family, {
      key: "coilovers",
      title: "Coilovers",
      category: "suspension",
      subcategory: "coilovers",
      price: 89900,
      goal: "better-handling",
      specs: { Adjustment: "Height", PCD: family.pcd },
      difficulty: "PROFESSIONAL",
      minutes: 240,
      description: `Height-adjustable coilovers for ${car}. Alignment required after install.`,
    }),
    kitProduct(family, {
      key: "brakes",
      title: "Brake Disc Kit",
      category: "brakes",
      subcategory: "discs",
      price: 24900,
      goal: "better-handling",
      specs: { Position: "Front", Material: "Coated iron" },
      difficulty: "MODERATE",
      minutes: 90,
      description: `Coated front discs and pads for ${car}.`,
    }),
    kitProduct(family, {
      key: "exhaust",
      title: "Cat-back Exhaust",
      category: "exhaust",
      subcategory: "catback",
      price: 54900,
      goal: "better-sound",
      specs: { Material: "304 stainless", Diameter: "70 mm", Position: "Cat-back" },
      difficulty: "PROFESSIONAL",
      minutes: 150,
      description: `Stainless cat-back system for ${car}. Confirm local noise and emissions rules.`,
    }),
    kitProduct(family, {
      key: "mats",
      title: "All-weather Mats",
      category: "accessories",
      subcategory: "mats",
      price: 7900,
      goal: "interior-upgrade",
      specs: { Material: "Rubber" },
      difficulty: "EASY",
      minutes: 5,
      description: `Vehicle-specific rubber mats for ${car}.`,
    }),
    kitProduct(family, {
      key: "grille",
      title: "Front Grille",
      category: "exterior",
      subcategory: "grilles",
      price: 21900,
      goal: "aggressive-look",
      specs: { Material: "ABS", Color: "Gloss black", Position: "Front" },
      difficulty: "MODERATE",
      minutes: 80,
      description: `Replacement sport grille designed for ${car}.`,
    }),
    kitProduct(family, {
      key: "lip",
      title: "Front Lip",
      category: "exterior",
      subcategory: "lips",
      price: 15900,
      goal: "aggressive-look",
      specs: { Material: "Polyurethane", Color: "Primer black", Position: "Front" },
      difficulty: "MODERATE",
      minutes: 60,
      description: `Front splitter for ${car}.`,
    }),
    kitProduct(family, {
      key: "diffuser",
      title: "Rear Diffuser",
      category: "exterior",
      subcategory: "diffusers",
      price: 18900,
      goal: "aggressive-look",
      specs: { Material: "ABS", Color: "Gloss black", Position: "Rear" },
      difficulty: "MODERATE",
      minutes: 70,
      description: `Rear diffuser for ${car}.`,
    }),
  ];
}

export const generatedProducts: Product[] = vehicleFamilies.flatMap(kitFor);

export const wheelProducts: Product[] = [
  wheel("5x112", "66.6", ["Audi", "Volkswagen", "Škoda", "SEAT", "Mercedes-Benz", "Porsche"], 20, 89900),
  wheel("5x120", "72.6", ["BMW"], 19, 79900),
  wheel("5x114.3", "64.1", ["Toyota", "Honda", "Nissan", "Lexus", "Ford"], 18, 69900),
  wheel("5x108", "63.4", ["Volvo", "Ford"], 18, 64900),
  wheel("5x130", "71.6", ["Porsche"], 20, 129900),
];

function wheel(pcd: string, bore: string, makes: string[], diameter: number, price: number): Product {
  const slug = `apex-${diameter}-wheels-${pcd.replace("x", "-")}`;
  return {
    id: `p-wheel-${pcd}`,
    title: `APEX ${diameter}" Wheels ${pcd}`,
    slug,
    description: `${diameter}-inch wheels, ${pcd}. Confirm offset and center bore for your car.`,
    brand: "APEX",
    category: "wheels",
    subcategory: "wheels",
    price,
    compareAtPrice: null,
    currency: "EUR",
    stock: 8,
    sku: `APX-W-${diameter}-${pcd.replace("x", "")}`,
    mpn: `APX-W-${diameter}-${pcd}`,
    ean: null,
    oemNumbers: [],
    crossReferences: [],
    images: supplierProductImages("nordic-drop", "wheels", slug),
    videos: [],
    supplierId: "nordic-drop",
    supplierSku: `W-${pcd}`,
    weightKg: 11,
    dimensions: { l: 53, w: 53, h: 28 },
    shipping: { origin: "EU", timeFromDays: 6, timeToDays: 12, costCents: 2900 },
    installationDifficulty: "MODERATE",
    installationTimeMin: 60,
    roadLegalStatus: "ROAD_LEGAL",
    warranty: "24 months",
    tags: ["wheels", pcd, `${diameter}`],
    goalTags: ["aggressive-look"],
    specifications: { Diameter: `${diameter}"`, Width: "8.5j", ET: "35", PCD: pcd, "Center bore": bore, Color: "Satin black" },
    included: ["4 wheels"],
    whatsIncluded: ["4 wheels"],
    installationNotes: "Hub-centric rings included where needed. TPMS not included.",
    seoTitle: `APEX ${diameter} Inch Wheels ${pcd}`,
    seoDescription: `${diameter}-inch ${pcd} wheels.`,
    relatedSlugs: [],
    setupSlugs: [],
    compatibility: resolveFitment(makes.map((make) => ({ make, fitmentType: "COMPATIBLE" as const, notes: `Confirm ${pcd} and offset.` }))),
    createdAt: "2026-09-01",
    updatedAt: "2026-09-16",
  };
}

export const universalProducts: Product[] = [
  {
    id: "p-ceramic-all",
    title: "Ceramic Coating Kit",
    slug: "ceramic-coating-kit-universal",
    description: "Ceramic coating kit for any vehicle in the catalog.",
    brand: "APEX",
    category: "detailing",
    subcategory: "coating",
    price: 8900,
    compareAtPrice: null,
    currency: "EUR",
    stock: 40,
    sku: "APX-CER-UNI",
    mpn: "APX-CER-UNI",
    ean: null,
    oemNumbers: [],
    crossReferences: [],
    images: supplierProductImages("nordic-drop", "detailing", "ceramic-coating-kit-universal"),
    videos: [],
    supplierId: "nordic-drop",
    supplierSku: "CER-UNI",
    weightKg: 0.6,
    dimensions: { l: 20, w: 10, h: 10 },
    shipping: { origin: "EU", timeFromDays: 1, timeToDays: 3, costCents: 1200 },
    installationDifficulty: "MODERATE",
    installationTimeMin: 240,
    roadLegalStatus: "ROAD_LEGAL",
    warranty: "12 months",
    tags: ["ceramic", "detailing"],
    goalTags: ["restoration"],
    specifications: { Durability: "Up to 24 months with care" },
    included: ["Coating", "Applicators", "Wipe pack"],
    whatsIncluded: ["Coating", "Applicators", "Wipe pack"],
    installationNotes: "Paint must be decontaminated first.",
    seoTitle: "Ceramic Coating Kit",
    seoDescription: "Ceramic coating kit for any vehicle.",
    relatedSlugs: [],
    setupSlugs: [],
    compatibility: resolveFitment(
      [...new Set(vehicleFamilies.map((item) => item.make))].map((make) => ({ make, fitmentType: "COMPATIBLE" as const })),
    ),
    createdAt: "2026-09-01",
    updatedAt: "2026-09-16",
  },
];
