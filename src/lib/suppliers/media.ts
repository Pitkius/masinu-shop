const EU = "/media/suppliers/eu-parts";
const NORDIC = "/media/suppliers/nordic-drop";

const euParts: Record<string, string> = {
  grille: `${EU}/grille.png`,
  grilles: `${EU}/grille.png`,
  lip: `${EU}/lip.png`,
  lips: `${EU}/lip.png`,
  diffuser: `${EU}/diffuser.png`,
  diffusers: `${EU}/diffuser.png`,
  lights: `${EU}/headlight.png`,
  headlights: `${EU}/headlight.png`,
  lighting: `${EU}/headlight.png`,
  coilovers: `${EU}/coilover.jpg`,
  suspension: `${EU}/coilover.jpg`,
  brakes: `${EU}/brake.jpg`,
  discs: `${EU}/brake.jpg`,
  boosters: `${EU}/brake.jpg`,
  lines: `${EU}/brake.jpg`,
  exhaust: `${EU}/exhaust.jpg`,
  catback: `${EU}/exhaust.jpg`,
  downpipes: `${EU}/exhaust-tips.jpg`,
  hardware: `${EU}/exhaust.jpg`,
  mats: `${EU}/mats.jpg`,
  accessories: `${EU}/mats.jpg`,
  interior: `${EU}/mats.jpg`,
  wheels: `${EU}/wheel.jpg`,
  intake: `${EU}/turbo.jpg`,
  intakes: `${EU}/turbo.jpg`,
  turbo: `${EU}/turbo.jpg`,
  turbos: `${EU}/turbo.jpg`,
  cooling: `${EU}/turbo.jpg`,
  heat: `${EU}/turbo.jpg`,
  fuel: `${EU}/turbo.jpg`,
  engine: `${EU}/turbo.jpg`,
  performance: `${EU}/turbo.jpg`,
  electronics: `${EU}/ecu.jpg`,
  ecu: `${EU}/ecu.jpg`,
  detailing: `${EU}/detailing.jpg`,
  coating: `${EU}/detailing.jpg`,
  exterior: `${EU}/grille.png`,
};

const nordicDrop: Record<string, string> = {
  ...euParts,
  wheels: `${NORDIC}/wheel.jpg`,
  mats: `${NORDIC}/mats.jpg`,
  accessories: `${NORDIC}/mats.jpg`,
  interior: `${NORDIC}/mats.jpg`,
  detailing: `${NORDIC}/detailing.jpg`,
  coating: `${NORDIC}/detailing.jpg`,
};

export function supplierProductImages(supplierId: string | null | undefined, ...keys: Array<string | null | undefined>): string[] {
  const pack = supplierId === "nordic-drop" ? nordicDrop : euParts;
  const photos = keys
    .map((key) => (key ? pack[key] : undefined))
    .filter((src): src is string => Boolean(src));
  return photos.length > 0 ? [...new Set(photos)] : [euParts.headlights];
}
