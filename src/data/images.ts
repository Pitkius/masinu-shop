import { supplierProductImages } from "@/lib/suppliers/media";

const EU = "/media/suppliers/eu-parts";

export const catalog = {
  grille: `${EU}/grille.png`,
  lip: `${EU}/lip.png`,
  diffuser: `${EU}/diffuser.png`,
  headlight: `${EU}/headlight.png`,
  coilover: `${EU}/coilover.jpg`,
  brake: `${EU}/brake.jpg`,
  exhaust: `${EU}/exhaust.jpg`,
  mats: `${EU}/mats.jpg`,
  wheel: `${EU}/wheel.jpg`,
  intake: `${EU}/turbo.jpg`,
  turbo: `${EU}/turbo.jpg`,
  detailing: `${EU}/detailing.jpg`,
  ecu: `${EU}/ecu.jpg`,
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
  interior: catalog.mats,
  suspension: catalog.coilover,
  detailing: catalog.detailing,
  grille: catalog.grille,
  lip: catalog.lip,
  diffuser: catalog.diffuser,
  intake: catalog.turbo,
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
  engine: catalog.turbo,
  interior: catalog.mats,
  electronics: catalog.ecu,
  accessories: catalog.mats,
  detailing: catalog.detailing,
};
