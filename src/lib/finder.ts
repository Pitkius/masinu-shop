import { allVehicles } from "@/lib/catalog";
import { productsForVehicle, shopProducts } from "@/lib/shop-catalog";
import { fitmentForVehicle } from "@/lib/fitment";
import { searchCatalog } from "@/lib/search";
import { vehicles } from "@/data/vehicles";
import type { Product } from "@/lib/types";

export type FinderRequest = {
  query: string;
  vehicleId?: string | null;
  budgetCents?: number | null;
};

export type FinderResult = {
  parsed: {
    goal?: string;
    street?: boolean;
    budgetCents?: number | null;
    vehicleId?: string | null;
  };
  products: Product[];
  note: string;
};

const goalMap: { test: RegExp; tag: string }[] = [
  { test: /power|galia|hp|tune/i, tag: "more-power" },
  { test: /sound|exhaust|gars/i, tag: "better-sound" },
  { test: /look|grille|aggressive|išvaizd/i, tag: "aggressive-look" },
  { test: /handling|coilover|brake/i, tag: "better-handling" },
  { test: /light|led/i, tag: "better-lighting" },
  { test: /interior|steer|alcantara/i, tag: "interior-upgrade" },
  { test: /restor|oem|replace/i, tag: "restoration" },
];

function parseBudget(query: string) {
  const match = query.replace(/\s/g, "").match(/€?\s?(\d{3,5})/);
  if (!match) return null;
  const value = Number(match[1]);
  return value < 50 ? null : value * 100;
}

function inferVehicle(query: string) {
  const lower = query.toLowerCase();
  return (
    allVehicles().find((vehicle) => {
      return (
        lower.includes(vehicle.make.toLowerCase()) &&
        lower.includes(vehicle.model.toLowerCase()) &&
        (lower.includes(vehicle.generation.toLowerCase()) || lower.includes(vehicle.engine.toLowerCase()))
      );
    }) ?? null
  );
}

export function findParts(input: FinderRequest): FinderResult {
  const budget = input.budgetCents ?? parseBudget(input.query);
  const inferred = input.vehicleId ? allVehicles().find((v) => v.id === input.vehicleId) : inferVehicle(input.query);
  const goal = goalMap.find((item) => item.test.test(input.query))?.tag;
  const street = /street|gatv|road legal|daily/i.test(input.query);

  let pool = inferred ? productsForVehicle(inferred.id) : shopProducts();
  if (goal) pool = pool.filter((product) => product.goalTags.includes(goal));
  if (street) pool = pool.filter((product) => product.roadLegalStatus !== "TRACK_ONLY");
  if (budget) {
    const selected: Product[] = [];
    let spent = 0;
    for (const product of [...pool].sort((a, b) => a.price - b.price)) {
      if (spent + product.price <= budget) {
        selected.push(product);
        spent += product.price;
      }
    }
    pool = selected.length ? selected : pool.filter((p) => p.price <= budget);
  }

  if (!pool.length) {
    const fallback = searchCatalog(input.query).products;
    pool = inferred
      ? fallback.filter((product) => {
          const status = fitmentForVehicle(product.compatibility, inferred.id);
          return status.fitmentType !== "NOT_COMPATIBLE";
        })
      : fallback;
  }

  return {
    parsed: {
      goal,
      street,
      budgetCents: budget,
      vehicleId: inferred?.id ?? input.vehicleId ?? null,
    },
    products: pool.slice(0, 12),
    note: inferred
      ? `Matched against ${inferred.make} ${inferred.model} ${inferred.generation} in the catalog only.`
      : "No vehicle was resolved. Showing catalog matches for the query only.",
  };
}

export function generateBudgetBuild(options: {
  vehicleId: string;
  goal?: string;
  budgetCents: number;
}) {
  const vehicle = vehicles.find((item) => item.id === options.vehicleId);
  if (!vehicle) return { products: [] as Product[], total: 0 };
  const items: Product[] = [];
  let total = 0;
  const pool = productsForVehicle(options.vehicleId)
    .filter((product) => {
      if (options.goal && !product.goalTags.includes(options.goal)) return false;
      return product.stock > 0;
    })
    .sort((a, b) => a.price - b.price);

  for (const product of pool) {
    if (total + product.price <= options.budgetCents) {
      items.push(product);
      total += product.price;
    }
  }
  return { products: items, total, vehicle };
}
