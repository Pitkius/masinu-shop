export function classifyCatalogTitle(title: string, productType = ""): { category: string; subcategory: string } {
  const t = `${title} ${productType}`.toLowerCase();

  if (/r[eė]mel|ramka.?nomern|license plate|number plate|nummernschild|kenteken|plate holder|plate frame|twin-fix/.test(t) && !/intercooler|bar\s*&\s*plate/.test(t)) {
    return { category: "accessories", subcategory: "plates" };
  }

  if (/cargo mat|trunk mat|boot mat|bagažin/.test(t)) return { category: "interior", subcategory: "cargo" };
  if (/floor mat|rubber mat|kilim[eė]l|doggy mat|kidmat/.test(t)) return { category: "interior", subcategory: "mats" };
  if (/steering wheel/.test(t)) return { category: "interior", subcategory: "steering" };
  if (/shift knob|pedal|seat cover|dash trim|interior trim/.test(t)) return { category: "interior", subcategory: "trim" };

  if (/tail light|taillight|rear lamp/.test(t)) return { category: "lighting", subcategory: "tails" };
  if (/fog (light|lamp)/.test(t)) return { category: "lighting", subcategory: "fog" };
  if (/headlight|headlamp|nova-series|prismatic/.test(t)) return { category: "lighting", subcategory: "headlights" };
  if (/work light|inspection light/.test(t)) return { category: "lighting", subcategory: "work" };

  if (/center cap|centravimo|hub ring|gaubtel/.test(t)) return { category: "wheels", subcategory: "hardware" };
  if (/\b(wheel|rim)\b/.test(t) && !/steering wheel/.test(t)) return { category: "wheels", subcategory: "wheels" };

  if (/side skirt|sijon/.test(t)) return { category: "exterior", subcategory: "skirts" };
  if (/splitter/.test(t)) return { category: "exterior", subcategory: "splitters" };
  if (/front lip|lip spoiler|air dam|\blip\b/.test(t)) return { category: "exterior", subcategory: "lips" };
  if (/diffuser/.test(t)) return { category: "exterior", subcategory: "diffusers" };
  if (/valance/.test(t)) return { category: "exterior", subcategory: "valances" };
  if (/grille|grotel/.test(t)) return { category: "exterior", subcategory: "grilles" };
  if (/\b(spoiler|wing)\b/.test(t)) return { category: "exterior", subcategory: "spoilers" };
  if (/canard/.test(t)) return { category: "exterior", subcategory: "canards" };
  if (/bumper|bamper/.test(t)) return { category: "exterior", subcategory: "bumpers" };
  if (/\bmirror/.test(t) && !/camera|dash/.test(t)) return { category: "exterior", subcategory: "mirrors" };
  if (/body kit/.test(t)) return { category: "exterior", subcategory: "kits" };
  if (/exactoe|aero/.test(t)) return { category: "exterior", subcategory: "aero" };

  if (/coilover/.test(t)) return { category: "suspension", subcategory: "coilovers" };
  if (/control arm/.test(t)) return { category: "suspension", subcategory: "arms" };
  if (/lowering spring|spring kit/.test(t) && !/coilover/.test(t)) return { category: "suspension", subcategory: "springs" };
  if (/shock|damper|\bstrut\b/.test(t)) return { category: "suspension", subcategory: "shocks" };
  if (/sway bar|anti-roll/.test(t)) return { category: "suspension", subcategory: "sway" };
  if (/camber kit|leveling (lift )?kit/.test(t)) return { category: "suspension", subcategory: "chassis" };

  if (/downpipe|de-cat|decat/.test(t)) return { category: "exhaust", subcategory: "downpipes" };
  if (/cat-back|gpf-back|opf-back|cat back|gpf back|opf back|front pipe back|front-pipe|axle.?back|turbo.?back/.test(t)) {
    return { category: "exhaust", subcategory: /turbo.?back/.test(t) ? "systems" : "catback" };
  }
  if (/catalyst bypass|sports cat|turbo elbow|active valve/.test(t)) return { category: "exhaust", subcategory: "systems" };
  if (/\b(tips?|trims?)\b/.test(t) && /exhaust|milltek|jet|gt\s*\d+|oval|cerakote|valved/.test(t)) {
    return { category: "exhaust", subcategory: "tips" };
  }
  if (/exhaust|silencer|muffler/.test(t)) return { category: "exhaust", subcategory: "systems" };

  if (/dash ?cam/.test(t)) return { category: "electronics", subcategory: "dashcam" };
  if (/\b(tune|flash|ecu license)\b/.test(t) && !/license plate/.test(t)) return { category: "electronics", subcategory: "ecu" };
  if (/\becu\b/.test(t) && !/remap|requires|license plate/.test(t)) return { category: "electronics", subcategory: "ecu" };
  if (/battery tester|battery charger|obd|hardwire/.test(t)) return { category: "electronics", subcategory: "electrical" };

  if (/coating|ceramic/.test(t) && /wax|polish(?!ed)|coat|seal|detail/.test(t)) return { category: "detailing", subcategory: "coating" };
  if (/air freshener|odor|scent/.test(t)) return { category: "detailing", subcategory: "scent" };
  if (/interior (deep )?clean|clean interior|interior kit/.test(t)) return { category: "detailing", subcategory: "interior-care" };
  if (/wax|polish(?!ed)|shampoo|compound|towel|soap|dressing|car clean|metal polish/.test(t)) {
    return { category: "detailing", subcategory: "care" };
  }

  if (/intercooler|radiator|cooler/.test(t)) return { category: "engine", subcategory: "cooling" };
  if (/intake|airbox/.test(t)) return { category: "engine", subcategory: "intakes" };
  if (/\bfuel\b|injector|fuel rail/.test(t)) return { category: "engine", subcategory: "fuel" };

  if (/\bturbo\b/.test(t) && !/biturbo|bi turbo|turbo.?back|turbo elbow/.test(t)) {
    return { category: "performance", subcategory: "turbos" };
  }

  if (/brake pad|\bpad\b/.test(t) && /brake|stop/.test(t)) return { category: "brakes", subcategory: "pads" };
  if (/brake (line|hose)/.test(t)) return { category: "brakes", subcategory: "lines" };
  if (/booster/.test(t)) return { category: "brakes", subcategory: "boosters" };
  if (/brake|disc|rotor/.test(t)) return { category: "brakes", subcategory: "discs" };

  return { category: "performance", subcategory: "hardware" };
}

export const partTypeOrder: Record<string, string[]> = {
  interior: ["mats", "cargo", "steering", "trim", "hardware"],
  exterior: ["lips", "splitters", "skirts", "diffusers", "valances", "spoilers", "grilles", "bumpers", "mirrors", "canards", "kits", "aero"],
  lighting: ["headlights", "tails", "fog", "work"],
  wheels: ["wheels", "hardware"],
  suspension: ["coilovers", "springs", "shocks", "arms", "sway", "chassis"],
  brakes: ["discs", "pads", "lines", "boosters"],
  exhaust: ["downpipes", "catback", "systems", "tips"],
  engine: ["intakes", "cooling", "fuel", "hardware"],
  performance: ["turbos", "ecu", "hardware"],
  electronics: ["dashcam", "ecu", "electrical"],
  accessories: ["plates", "hardware"],
  detailing: ["care", "coating", "interior-care", "scent"],
};

export function sortPartTypes(category: string | undefined, slugs: string[]) {
  const order = category ? partTypeOrder[category] ?? [] : [];
  return [...new Set(slugs.filter(Boolean))].sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

export function catalogGoal(category: string) {
  switch (category) {
    case "exhaust":
      return "better-sound";
    case "exterior":
    case "wheels":
      return "aggressive-look";
    case "lighting":
      return "better-lighting";
    case "interior":
    case "accessories":
      return "interior-upgrade";
    case "suspension":
    case "brakes":
      return "better-handling";
    case "detailing":
      return "restoration";
    default:
      return "more-power";
  }
}

export function resolveManufacturerCategory(row: {
  supplierId: string;
  title: string;
  category: string;
  subcategory: string;
}) {
  const kind = classifyCatalogTitle(row.title);
  const title = row.title.toLowerCase();
  if (row.supplierId === "milltek") {
    if (/metal polish|cleaning metal/.test(title)) return { category: "detailing", subcategory: "care", kind };
    if (/active suspension/.test(title)) return { category: "suspension", subcategory: "chassis", kind };
    return {
      category: "exhaust",
      subcategory: kind.category === "exhaust" ? kind.subcategory : "systems",
      kind,
    };
  }
  if (row.category === "performance" && kind.category !== "performance") {
    return { category: kind.category, subcategory: kind.subcategory, kind };
  }
  if (kind.category === row.category) {
    return { category: row.category, subcategory: kind.subcategory, kind };
  }
  return { category: row.category, subcategory: row.subcategory, kind };
}
