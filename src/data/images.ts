import { categoryPhoto, supplierProductImages } from "@/lib/suppliers/media";

export const catalog = {
  grille: categoryPhoto("grilles"),
  lip: categoryPhoto("lips"),
  diffuser: categoryPhoto("diffusers"),
  headlight: categoryPhoto("headlights"),
  coilover: categoryPhoto("coilovers"),
  brake: categoryPhoto("discs"),
  exhaust: categoryPhoto("exhaust"),
  mats: categoryPhoto("mats"),
  wheel: categoryPhoto("wheels"),
  intake: categoryPhoto("intakes"),
  turbo: categoryPhoto("turbos"),
  detailing: categoryPhoto("detailing"),
  ecu: categoryPhoto("ecu"),
  steering: categoryPhoto("steering"),
} as const;

/** Lifestyle shots for homepage/builds only — never assign these to products. */
export const img = {
  hero: "/media/hero.jpg",
  audiNight: "/media/hero.jpg",
  bmw: "/media/bmw.jpg",
  mercedes: "/media/mercedes.jpg",
  vw: "/media/vw.jpg",
  garage: "/media/garage.jpg",
  build: "/media/build.jpg",
  car: catalog.headlight,
  wheels: catalog.wheel,
  exhaust: catalog.exhaust,
  engine: catalog.turbo,
  brakes: catalog.brake,
  lights: catalog.headlight,
  interior: catalog.steering,
  mats: catalog.mats,
  suspension: catalog.coilover,
  detailing: catalog.detailing,
  grille: catalog.grille,
  lip: catalog.lip,
  diffuser: catalog.diffuser,
  intake: catalog.intake,
  ecu: catalog.ecu,
} as const;

export function productPhotos(...keys: Array<string | null | undefined>): string[] {
  return supplierProductImages("eu-parts", ...keys);
}

export const categoryImage: Record<string, string> = {
  performance: catalog.turbo,
  exterior: catalog.grille,
  wheels: catalog.wheel,
  lighting: catalog.headlight,
  suspension: catalog.coilover,
  brakes: catalog.brake,
  exhaust: catalog.exhaust,
  engine: catalog.intake,
  interior: catalog.steering,
  electronics: catalog.ecu,
  accessories: catalog.mats,
  detailing: catalog.detailing,
};
