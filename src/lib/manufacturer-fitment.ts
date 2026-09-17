export type ParsedManufacturerFitment = {
  make?: string;
  model?: string;
  generation?: string;
  yearFrom?: number;
  yearTo?: number;
};

const SKU_MAKE: Array<{ prefix: string; make: string }> = [
  { prefix: "SSXAU", make: "Audi" },
  { prefix: "SSXVW", make: "Volkswagen" },
  { prefix: "SSXSE", make: "SEAT" },
  { prefix: "SSXSK", make: "Škoda" },
  { prefix: "SSXCU", make: "Cupra" },
  { prefix: "SSXBM", make: "BMW" },
  { prefix: "SSXMB", make: "Mercedes-Benz" },
  { prefix: "SSXFD", make: "Ford" },
  { prefix: "SSXFO", make: "Ford" },
  { prefix: "SSXPO", make: "Porsche" },
  { prefix: "SSXMN", make: "MINI" },
  { prefix: "SSXTO", make: "Toyota" },
  { prefix: "SSXHO", make: "Honda" },
  { prefix: "SSXHY", make: "Hyundai" },
  { prefix: "SSXKI", make: "Kia" },
  { prefix: "SSXVO", make: "Volvo" },
  { prefix: "SSXNI", make: "Nissan" },
  { prefix: "SSXMA", make: "Mazda" },
  { prefix: "SSXSU", make: "Subaru" },
  { prefix: "SSXPE", make: "Peugeot" },
  { prefix: "SSXRN", make: "Renault" },
  { prefix: "SSXRE", make: "Renault" },
  { prefix: "SSXCI", make: "Citroën" },
  { prefix: "SSXJA", make: "Jaguar" },
  { prefix: "SSXLR", make: "Land Rover" },
  { prefix: "SSXLX", make: "Lexus" },
  { prefix: "SSXAR", make: "Alfa Romeo" },
  { prefix: "SSXFI", make: "Fiat" },
  { prefix: "SSXJP", make: "Jeep" },
  { prefix: "SSXJE", make: "Jeep" },
  { prefix: "SSXOP", make: "Opel" },
];

const MODELS: Array<{ re: RegExp; make: string; model: string; generation?: string }> = [
  { re: /\brs[-\s]?6\b/, make: "Audi", model: "RS6" },
  { re: /\brs[-\s]?7\b/, make: "Audi", model: "RS7" },
  { re: /\brs[-\s]?5\b/, make: "Audi", model: "RS5" },
  { re: /\brs[-\s]?4\b/, make: "Audi", model: "RS4" },
  { re: /\brs[-\s]?3\b/, make: "Audi", model: "RS3" },
  { re: /\ba[-\s]?8\b/, make: "Audi", model: "A8" },
  { re: /\ba[-\s]?7\b/, make: "Audi", model: "A7" },
  { re: /\ba[-\s]?6\b/, make: "Audi", model: "A6" },
  { re: /\ba[-\s]?5\b/, make: "Audi", model: "A5" },
  { re: /\ba[-\s]?4\b/, make: "Audi", model: "A4" },
  { re: /\ba[-\s]?3\b/, make: "Audi", model: "A3" },
  { re: /\ba[-\s]?1\b/, make: "Audi", model: "A1" },
  { re: /\bq[-\s]?7\b/, make: "Audi", model: "Q7" },
  { re: /\bq[-\s]?5\b/, make: "Audi", model: "Q5" },
  { re: /\bq[-\s]?3\b/, make: "Audi", model: "Q3" },
  { re: /\btt\b/, make: "Audi", model: "TT" },
  { re: /\bgolf\b/, make: "Volkswagen", model: "Golf" },
  { re: /\bpassat\b/, make: "Volkswagen", model: "Passat" },
  { re: /\bpolo\b/, make: "Volkswagen", model: "Polo" },
  { re: /\bjetta\b/, make: "Volkswagen", model: "Jetta" },
  { re: /\bscirocco\b/, make: "Volkswagen", model: "Scirocco" },
  { re: /\btiguan\b/, make: "Volkswagen", model: "Tiguan" },
  { re: /\btouareg\b/, make: "Volkswagen", model: "Touareg" },
  { re: /\bart[eé]on\b/, make: "Volkswagen", model: "Arteon" },
  { re: /\btouran\b/, make: "Volkswagen", model: "Touran" },
  { re: /\bbeetle\b/, make: "Volkswagen", model: "Beetle" },
  { re: /\bt[-\s]?roc\b/, make: "Volkswagen", model: "T-Roc" },
  { re: /\boctavia\b/, make: "Škoda", model: "Octavia" },
  { re: /\bsuperb\b/, make: "Škoda", model: "Superb" },
  { re: /\bfabia\b/, make: "Škoda", model: "Fabia" },
  { re: /\bleon\b/, make: "SEAT", model: "Leon" },
  { re: /\bibiza\b/, make: "SEAT", model: "Ibiza" },
  { re: /\b5[-\s]?series\b/, make: "BMW", model: "5 Series" },
  { re: /\b4[-\s]?series\b/, make: "BMW", model: "4 Series" },
  { re: /\b3[-\s]?series\b/, make: "BMW", model: "3 Series" },
  { re: /\b1[-\s]?series\b/, make: "BMW", model: "1 Series" },
  { re: /\b2[-\s]?series\b/, make: "BMW", model: "2 Series" },
  { re: /\b320[di]\b|\b325[di]\b|\b330[di]\b|\b335i\b/, make: "BMW", model: "3 Series" },
  { re: /\be46\b/, make: "BMW", model: "3 Series", generation: "E46" },
  { re: /\be90\b|\be91\b/, make: "BMW", model: "3 Series", generation: "E90" },
  { re: /\be92\b|\be93\b/, make: "BMW", model: "3 Series", generation: "E92" },
  { re: /\bf30\b|\bf31\b/, make: "BMW", model: "3 Series", generation: "F30" },
  { re: /\bg20\b|\bg21\b/, make: "BMW", model: "3 Series", generation: "G20" },
  { re: /\be87\b/, make: "BMW", model: "1 Series", generation: "E87" },
  { re: /\be82\b/, make: "BMW", model: "1 Series", generation: "E82" },
  { re: /\bf20\b/, make: "BMW", model: "1 Series", generation: "F20" },
  { re: /\be60\b|\be61\b/, make: "BMW", model: "5 Series", generation: "E60" },
  { re: /\bf10\b|\bf11\b/, make: "BMW", model: "5 Series", generation: "F10" },
  { re: /\bx5\b/, make: "BMW", model: "X5" },
  { re: /\bx3\b/, make: "BMW", model: "X3" },
  { re: /\bx1\b/, make: "BMW", model: "X1" },
  { re: /\bm3\b/, make: "BMW", model: "M3" },
  { re: /\bz4\b/, make: "BMW", model: "Z4" },
  { re: /\bc[-\s]?class\b/, make: "Mercedes-Benz", model: "C-Class" },
  { re: /\be[-\s]?class\b/, make: "Mercedes-Benz", model: "E-Class" },
  { re: /\ba[-\s]?class\b/, make: "Mercedes-Benz", model: "A-Class" },
  { re: /\bw204\b/, make: "Mercedes-Benz", model: "C-Class", generation: "W204" },
  { re: /\bw205\b/, make: "Mercedes-Benz", model: "C-Class", generation: "W205" },
  { re: /\bw212\b/, make: "Mercedes-Benz", model: "E-Class", generation: "W212" },
  { re: /\bfocus\b/, make: "Ford", model: "Focus" },
  { re: /\bfiesta\b/, make: "Ford", model: "Fiesta" },
  { re: /\bmondeo\b/, make: "Ford", model: "Mondeo" },
  { re: /\bmustang\b/, make: "Ford", model: "Mustang" },
  { re: /\bkuga\b/, make: "Ford", model: "Kuga" },
  { re: /\bcivic\b/, make: "Honda", model: "Civic" },
  { re: /\bsupra\b/, make: "Toyota", model: "Supra" },
  { re: /\byaris\b/, make: "Toyota", model: "Yaris" },
  { re: /\b911\b/, make: "Porsche", model: "911" },
  { re: /\bcayenne\b/, make: "Porsche", model: "Cayenne" },
];

const CHASSIS: Array<{ re: RegExp; make: string; model: string; generation: string }> = [
  { re: /\b4f\b/, make: "Audi", model: "A6", generation: "C6" },
  { re: /\b4g\b/, make: "Audi", model: "A6", generation: "C7" },
  { re: /\b4k\b/, make: "Audi", model: "A6", generation: "C8" },
  { re: /\b8p\b/, make: "Audi", model: "A3", generation: "8P" },
  { re: /\b8v\b/, make: "Audi", model: "A3", generation: "8V" },
  { re: /\b8y\b/, make: "Audi", model: "A3", generation: "8Y" },
  { re: /\b8l\b/, make: "Audi", model: "A3", generation: "8L" },
];

const MAKE_NAMES: Array<{ match: RegExp; make: string }> = [
  { match: /\baudi\b/, make: "Audi" },
  { match: /\bvolkswagen\b|\bvw\b/, make: "Volkswagen" },
  { match: /\bseat\b/, make: "SEAT" },
  { match: /\bskoda\b|\bškoda\b/, make: "Škoda" },
  { match: /\bcupra\b/, make: "Cupra" },
  { match: /\bbmw\b/, make: "BMW" },
  { match: /\bmercedes/, make: "Mercedes-Benz" },
  { match: /\bford\b/, make: "Ford" },
  { match: /\bporsche\b/, make: "Porsche" },
  { match: /\bmini\b/, make: "MINI" },
  { match: /\btoyota\b/, make: "Toyota" },
  { match: /\bhonda\b/, make: "Honda" },
  { match: /\bhundai\b/, make: "Hyundai" },
  { match: /\bkia\b/, make: "Kia" },
  { match: /\bvolvo\b/, make: "Volvo" },
  { match: /\bnissan\b/, make: "Nissan" },
  { match: /\bmazda\b/, make: "Mazda" },
  { match: /\bsubaru\b/, make: "Subaru" },
  { match: /\bpeugeot\b/, make: "Peugeot" },
  { match: /\brenaul/, make: "Renault" },
  { match: /\bjaguar\b/, make: "Jaguar" },
  { match: /\blexus\b/, make: "Lexus" },
];

function haystack(parts: Array<string | undefined>) {
  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[/_]+/g, "-")
    .replace(/\s+/g, " ");
}

function makeFromSku(sku?: string) {
  if (!sku) return undefined;
  const upper = sku.toUpperCase();
  return SKU_MAKE.find((item) => upper.startsWith(item.prefix))?.make;
}

function normalizeGeneration(raw: string, model?: string) {
  const compact = raw.replace(/\s+/g, "").replace(/\.5$/i, "").replace(/\.2$/i, "");
  if (/^mk\d/i.test(compact)) return `Mk${compact.replace(/^mk/i, "")}`;
  if (/^c[5-8]$/i.test(compact)) return compact.toUpperCase();
  if (/^b[5-9]$/i.test(compact)) return compact.toUpperCase();
  if (/^e9[0-3]$/i.test(compact)) return /^e9[01]$/i.test(compact) ? "E90" : "E92";
  if (/^f3[01]$/i.test(compact)) return "F30";
  if (/^8[lpvy]$/i.test(compact)) return compact.toUpperCase();
  if (model === "Golf" && /^\d$/.test(compact)) return `Mk${compact}`;
  return compact.replace(/^mk/i, "Mk");
}

function generationFromText(text: string, model?: string, make?: string) {
  const mk = text.match(/\bmk\s*([4-8])(?:\.5)?\b/i);
  if (mk) return normalizeGeneration(`Mk${mk[1]}`, model);
  const c = text.match(/\bc\s*([5-8])(?:\.5)?\b/i);
  if (c && (model === "A6" || model === "A7" || model === "RS6" || model === "RS7" || (!model && make === "Audi"))) {
    return `C${c[1]}`;
  }
  const b = text.match(/\bb\s*([5-9])(?:\.5)?\b/i);
  if (b && (model === "A4" || model === "A5" || model === "RS4" || model === "RS5" || (!model && make === "Audi"))) {
    return `B${b[1]}`;
  }
  const eight = text.match(/\b(8[lpvy])\b/i);
  if (eight && (model === "A3" || model === "S3" || model === "RS3" || (!model && make === "Audi"))) {
    return eight[1].toUpperCase();
  }
  const bmw = text.match(/\b([efg]\d{2})\b/i);
  if (bmw) return bmw[1].toUpperCase();
  const mercedes = text.match(/\b(w20[2-6]|w21[0-3])\b/i);
  if (mercedes) return mercedes[1].toUpperCase();
  return undefined;
}

function yearsFromText(text: string) {
  const years = [...text.matchAll(/\b((?:19|20)\d{2})\b/g)].map((match) => Number(match[1])).filter((year) => year >= 1990 && year <= 2028);
  if (!years.length) return {};
  return { yearFrom: Math.min(...years), yearTo: Math.max(...years) };
}

export function parseManufacturerFitment(input: {
  sku?: string;
  title?: string;
  sourceUrl?: string;
  description?: string;
  make?: string;
  model?: string;
  generation?: string;
  yearFrom?: number;
  yearTo?: number;
}): ParsedManufacturerFitment {
  const text = haystack([input.sku, input.title, input.sourceUrl, input.description, input.make, input.model, input.generation]);
  const skuMake = makeFromSku(input.sku);
  let make = input.make || skuMake;
  let model = input.model;
  let generation = input.generation ? normalizeGeneration(String(input.generation), model) : undefined;

  for (const item of MODELS) {
    if (!item.re.test(text)) continue;
    if (skuMake && item.make !== skuMake) continue;
    make = make ?? item.make;
    if (!model) model = item.model;
    if (!generation && item.generation) generation = item.generation;
    break;
  }

  if (!model || !generation) {
    for (const item of CHASSIS) {
      if (!item.re.test(text)) continue;
      if (skuMake && item.make !== skuMake) continue;
      make = make ?? item.make;
      model = model ?? item.model;
      generation = generation ?? item.generation;
      break;
    }
  }

  if (!make) make = MAKE_NAMES.find((item) => item.match.test(text))?.make;
  if (!generation) generation = generationFromText(text, model, make);

  if (!model && make === "Volkswagen" && /\bgti\b/.test(text)) model = "Golf";
  if (!model && make === "Volkswagen" && generation?.startsWith("Mk")) model = "Golf";
  if (!model && make === "Audi" && generation === "C6" && /\b5[.\s-]*0\b/.test(text) && /\b(v10|biturbo)\b/.test(text)) {
    model = "RS6";
  }
  if (!model && make === "Audi" && generation && /^C[5-8]$/.test(generation) && !/\brs[67]\b|\ba7\b|\bv10\b|\bbiturbo\b/.test(text)) {
    model = "A6";
  }
  if (!model && make === "Audi" && generation && /^B[5-9]$/.test(generation) && !/\brs[45]\b|\ba5\b/.test(text)) {
    model = "A4";
  }
  if (!model && make === "Audi" && generation && /^8[LPVY]$/.test(generation) && !/\brs3\b/.test(text)) {
    model = "A3";
  }
  if (!model && make === "BMW" && generation && /^(E9[0-3]|F30|G20)$/.test(generation)) {
    model = "3 Series";
  }

  const years = yearsFromText(text);
  return {
    make,
    model,
    generation,
    yearFrom: input.yearFrom ?? years.yearFrom,
    yearTo: input.yearTo ?? years.yearTo,
  };
}
