export function classifyCatalogTitle(title: string, productType = ""): { category: string; subcategory: string } {
  const t = `${title} ${productType}`.toLowerCase();
  if (/r[eė]mel|ramka.?nomern|license plate|number plate|nummernschild|kenteken|plate holder|plate frame|twin-fix/.test(t) && !/intercooler|bar\s*&\s*plate/.test(t)) {
    return { category: "accessories", subcategory: "plates" };
  }
  if (/floor mat|cargo mat|trunk mat|rubber mat|kilim[eė]l|doggy mat|kidmat/.test(t)) {
    return { category: "interior", subcategory: "mats" };
  }
  if (/headlight|tail light|taillight|fog light|led light|prismatic|nova-series|work light|inspection light/.test(t)) {
    return { category: "lighting", subcategory: /tail/.test(t) ? "tails" : "headlights" };
  }
  if (/\b(wheel|rim)\b/.test(t) && !/steering wheel/.test(t)) return { category: "wheels", subcategory: "wheels" };
  if (/center cap|centravimo|hub ring|gaubtel/.test(t)) return { category: "wheels", subcategory: "hardware" };
  if (/spoiler|diffuser|splitter|side skirt|body kit|front lip|air dam|valance|bumper|grille|exactoe/.test(t)) {
    return { category: "exterior", subcategory: /lip|air dam|splitter/.test(t) ? "lips" : /diffuser|valance/.test(t) ? "diffusers" : /grille/.test(t) ? "grilles" : "aero" };
  }
  if (/coilover|lowering spring|shock|damper|camber kit|leveling (lift )?kit|control arm/.test(t)) {
    return { category: "suspension", subcategory: /coilover/.test(t) ? "coilovers" : "chassis" };
  }
  if (/dash ?cam|battery tester|battery charger|obd|hardwire/.test(t)) {
    return { category: "electronics", subcategory: /dash/.test(t) ? "dashcam" : "electrical" };
  }
  if (/wax|polish|shampoo|coating|compound|detail|towel|air freshener|interior (deep )?clean|odor/.test(t)) {
    return { category: "detailing", subcategory: /coating|ceramic/.test(t) ? "coating" : "care" };
  }
  if (/downpipe|de-cat|decat/.test(t)) return { category: "exhaust", subcategory: "downpipes" };
  if (/cat-back|gpf-back|opf-back|cat back/.test(t)) return { category: "exhaust", subcategory: "catback" };
  if (/exhaust|silencer/.test(t)) return { category: "exhaust", subcategory: "systems" };
  if (/intercooler|radiator|cooler/.test(t)) return { category: "engine", subcategory: "cooling" };
  if (/intake|airbox/.test(t)) return { category: "engine", subcategory: "intakes" };
  if (/turbo/.test(t)) return { category: "performance", subcategory: "turbos" };
  if (/brake|disc|pad/.test(t)) return { category: "brakes", subcategory: "discs" };
  if (/\b(tune|flash|ecu license)\b/.test(t) && !/license plate/.test(t)) return { category: "electronics", subcategory: "ecu" };
  return { category: "performance", subcategory: "hardware" };
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

export const universalCatalogCategories = new Set(["accessories", "detailing", "electronics"]);
