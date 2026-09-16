import type { Category, Goal } from "@/lib/types";
import { img } from "./images";

export const categories: Category[] = [
  { slug: "performance", name: "Performance", description: "Tunes, intakes, turbos and power hardware.", image: img.engine, filterKeys: ["brand", "engine", "power", "roadLegal", "install"] },
  { slug: "exterior", name: "Exterior", description: "Grilles, lips, diffusers and body styling.", image: img.grille, filterKeys: ["brand", "material", "color", "body", "year"] },
  { slug: "wheels", name: "Wheels", description: "Wheels and fitment hardware.", image: img.wheels, filterKeys: ["brand", "size", "color", "drive"] },
  { slug: "lighting", name: "Lighting", description: "Headlights, tails and interior lighting.", image: img.lights, filterKeys: ["brand", "color", "roadLegal"] },
  { slug: "suspension", name: "Suspension", description: "Coilovers, arms and chassis parts.", image: img.suspension, filterKeys: ["brand", "drive", "install"] },
  { slug: "brakes", name: "Brakes", description: "Discs, pads, lines and boosters.", image: img.brakes, filterKeys: ["brand", "size", "install"] },
  { slug: "exhaust", name: "Exhaust", description: "Downpipes, cat-back systems and tips.", image: img.exhaust, filterKeys: ["brand", "material", "engine", "roadLegal"] },
  { slug: "engine", name: "Engine", description: "Cooling, fuel and engine bay hardware.", image: img.engine, filterKeys: ["brand", "engine", "power", "install"] },
  { slug: "interior", name: "Interior", description: "Steering, trim and cabin upgrades.", image: img.interior, filterKeys: ["brand", "material", "color"] },
  { slug: "electronics", name: "Electronics", description: "ECU, sensors and lighting controllers.", image: img.engine, filterKeys: ["brand", "roadLegal", "install"] },
  { slug: "accessories", name: "Accessories", description: "Practical add-ons for daily driving.", image: img.interior, filterKeys: ["brand"] },
  { slug: "detailing", name: "Detailing", description: "Care products for paint, wheels and interior.", image: img.detailing, filterKeys: ["brand"] },
];

export const goals: Goal[] = [
  { slug: "more-power", name: "MORE POWER", description: "Street-capable power upgrades.", tag: "more-power" },
  { slug: "better-sound", name: "BETTER SOUND", description: "Exhaust note and intake sound.", tag: "better-sound" },
  { slug: "aggressive-look", name: "AGGRESSIVE LOOK", description: "Exterior presence and stance.", tag: "aggressive-look" },
  { slug: "better-handling", name: "BETTER HANDLING", description: "Chassis and brake confidence.", tag: "better-handling" },
  { slug: "better-lighting", name: "BETTER LIGHTING", description: "Visibility and modern light signatures.", tag: "better-lighting" },
  { slug: "interior-upgrade", name: "INTERIOR UPGRADE", description: "Cabin materials and controls.", tag: "interior-upgrade" },
  { slug: "restoration", name: "RESTORATION", description: "OEM-quality replacement parts.", tag: "restoration" },
];

export const categoryFilterFields: Record<string, { key: string; label: string; spec?: string }[]> = {
  wheels: [
    { key: "diameter", label: "Diameter", spec: "Diameter" },
    { key: "width", label: "Width", spec: "Width" },
    { key: "et", label: "ET", spec: "ET" },
    { key: "pcd", label: "PCD", spec: "PCD" },
    { key: "centerBore", label: "Center bore", spec: "Center bore" },
  ],
  performance: [
    { key: "turboType", label: "Turbo type", spec: "Turbo type" },
    { key: "powerRange", label: "Power range", spec: "Power range" },
    { key: "engineCode", label: "Engine code", spec: "Engine code" },
    { key: "ar", label: "A/R", spec: "A/R" },
    { key: "flange", label: "Flange", spec: "Flange" },
  ],
  exhaust: [
    { key: "diameter", label: "Diameter", spec: "Diameter" },
    { key: "material", label: "Material", spec: "Material" },
    { key: "position", label: "Exhaust position", spec: "Position" },
    { key: "engineCode", label: "Engine", spec: "Engine code" },
    { key: "roadLegal", label: "Road legal", spec: "Road legal" },
  ],
};
