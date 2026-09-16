const EU = "/media/suppliers/eu-parts";

function src(...files: string[]) {
  return files.map((file) => `${EU}/${file}`);
}

function hashSeed(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (Math.imul(hash, 33) + value.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

const pools: Record<string, string[]> = {
  headlights: src("headlight.png", "headlight-03.jpg", "headlight-02.jpg", "headlight-04.jpg", "headlight-06.jpg"),
  coilovers: src("coilover-02.jpg", "coilover.jpg"),
  discs: src("brake-06.jpg", "brake.jpg", "brake-04.jpg", "brake-05.jpg"),
  boosters: src("booster-03.jpg", "booster-02.jpg"),
  lines: src("brake-05.jpg", "brake-04.jpg", "booster-02.jpg"),
  exhaust: src("exhaust-02.jpg", "exhaust-03.jpg", "exhaust-06.jpg"),
  hardware: src("booster-01.jpg", "booster-02.jpg"),
  mats: src("mats.jpg"),
  wheels: src("wheel.jpg", "wheel-3.jpg", "wheel-07.jpg", "wheel-04.jpg", "wheel-08.jpg"),
  grilles: src("grille-07.jpg", "grille-02.jpg", "grille-03.jpg", "grille-08.jpg", "grille-09.jpg", "coilover-04.jpg"),
  lips: src("lip-front-01.jpg", "lip-front-03.jpg", "lip-front-05.jpg"),
  diffusers: src("diffuser-01.jpg", "exhaust-02.jpg"),
  downpipes: src("downpipe-01.jpg", "exhaust-06.jpg", "exhaust-03.jpg"),
  turbos: src("turbo.jpg", "turbo-04.jpg", "turbo-03.jpg"),
  intakes: src("cooler-03.png", "downpipe-01.jpg"),
  cooling: src("cooler-03.png", "turbo-03.jpg"),
  fuel: src("booster-02.jpg", "turbo-04.jpg"),
  heat: src("turbo-03.jpg", "downpipe-01.jpg"),
  ecu: src("ecu-05.jpg"),
  steering: src("steering-03.jpg", "steering-01.jpg"),
  detailing: src("detailing.jpg"),
};

const aliases: Record<string, string> = {
  lights: "headlights",
  lighting: "headlights",
  headlights: "headlights",
  coilovers: "coilovers",
  suspension: "coilovers",
  brakes: "discs",
  discs: "discs",
  boosters: "boosters",
  lines: "lines",
  exhaust: "exhaust",
  catback: "exhaust",
  downpipes: "downpipes",
  hardware: "hardware",
  mats: "mats",
  accessories: "mats",
  interior: "steering",
  steering: "steering",
  wheels: "wheels",
  grille: "grilles",
  grilles: "grilles",
  exterior: "grilles",
  lip: "lips",
  lips: "lips",
  diffuser: "diffusers",
  diffusers: "diffusers",
  intake: "intakes",
  intakes: "intakes",
  turbo: "turbos",
  turbos: "turbos",
  performance: "turbos",
  engine: "cooling",
  cooling: "cooling",
  fuel: "fuel",
  heat: "heat",
  electronics: "ecu",
  ecu: "ecu",
  detailing: "detailing",
  coating: "detailing",
};

export function supplierProductImages(supplierId: string | null | undefined, ...keys: Array<string | null | undefined>): string[] {
  const kind = keys.map((key) => (key ? aliases[key] : undefined)).find((key) => key && pools[key]);
  const pool = (kind ? pools[kind] : undefined) ?? pools.headlights;
  const seed = [supplierId ?? "eu-parts", ...keys.filter(Boolean)].join("|");
  const offset = supplierId === "nordic-drop" ? 1 : 0;
  const index = (hashSeed(seed) + offset) % pool.length;
  const photos = [pool[index], pool[(index + 1) % pool.length]];
  return [...new Set(photos)];
}

export function categoryPhoto(category: string) {
  return supplierProductImages("eu-parts", category)[0];
}
