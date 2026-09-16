export type Fuel = "PETROL" | "DIESEL" | "HYBRID" | "ELECTRIC";
export type Drive = "FWD" | "RWD" | "AWD";
export type FitmentType =
  | "EXACT"
  | "COMPATIBLE"
  | "MODIFICATION_REQUIRED"
  | "NOT_COMPATIBLE";
export type RoadLegalStatus = "ROAD_LEGAL" | "TRACK_ONLY" | "UNKNOWN";
export type InstallationDifficulty = "EASY" | "MODERATE" | "PROFESSIONAL";

export type Vehicle = {
  id: string;
  make: string;
  makeSlug: string;
  model: string;
  modelSlug: string;
  generation: string;
  generationSlug: string;
  facelift: string | null;
  yearFrom: number;
  yearTo: number;
  body: string;
  engine: string;
  engineCode: string;
  fuel: Fuel;
  power: number;
  drive: Drive;
  transmission: string;
};

export type VehicleSelection = {
  make?: string;
  model?: string;
  generation?: string;
  year?: number;
  body?: string;
  engine?: string;
  fuel?: Fuel;
  drive?: Drive;
  transmission?: string;
};

export type ProductFitment = {
  vehicleId: string;
  fitmentType: Exclude<FitmentType, "NOT_COMPATIBLE">;
  notes?: string;
};

export type ProductShipping = {
  origin: string;
  timeFromDays: number;
  timeToDays: number;
  costCents: number;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  brand: string;
  category: string;
  subcategory: string | null;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  stock: number;
  sku: string;
  mpn: string | null;
  ean: string | null;
  oemNumbers: string[];
  crossReferences: string[];
  images: string[];
  videos: string[];
  supplierId: string | null;
  supplierSku: string | null;
  weightKg: number | null;
  dimensions: { l: number; w: number; h: number } | null;
  shipping: ProductShipping;
  installationDifficulty: InstallationDifficulty | null;
  installationTimeMin: number | null;
  roadLegalStatus: RoadLegalStatus;
  warranty: string | null;
  tags: string[];
  goalTags: string[];
  specifications: Record<string, string>;
  included: string[];
  installationNotes: string | null;
  whatsIncluded: string[];
  seoTitle: string;
  seoDescription: string;
  relatedSlugs: string[];
  setupSlugs: string[];
  compatibility: ProductFitment[];
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
  filterKeys: string[];
};

export type Review = {
  id: string;
  productSlug: string;
  author: string;
  stars: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  vehicleId: string | null;
  createdAt: string;
};

export type SavedVehicle = {
  id: string;
  vehicleId: string;
  nickname?: string;
  createdAt: string;
};

export type BuildItemStatus = "installed" | "wishlist";

export type BuildItem = {
  productId: string;
  category: string;
  status: BuildItemStatus;
};

export type CarBuild = {
  id: string;
  title: string;
  vehicleId: string;
  visibility: "private" | "public";
  goal?: string;
  items: BuildItem[];
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type SearchHitKind = "product" | "vehicle" | "category" | "part";

export type SearchHit = {
  kind: SearchHitKind;
  id: string;
  title: string;
  href: string;
  subtitle?: string;
  score: number;
};

export type Goal = {
  slug: string;
  name: string;
  description: string;
  tag: string;
};

export type PerformanceStage = {
  id: string;
  engineCode: string;
  platformLabel: string;
  stage: number;
  title: string;
  summary: string;
  productSkus: string[];
  estimatedPowerFrom: number | null;
  estimatedPowerTo: number | null;
  estimatedTorqueFrom: number | null;
  estimatedTorqueTo: number | null;
  notes: string;
};

export type PublicBuild = {
  slug: string;
  owner: string;
  title: string;
  vehicleId: string;
  productSlugs: string[];
  photo: string;
  story: string;
};
