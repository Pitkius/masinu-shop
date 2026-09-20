/** APEX Care private-label line. Not in the shop until we photograph filled, labeled bottles. */

export type ApexCareCap = "trigger" | "spray" | "flip";

export type ApexCareSku = {
  sku: string;
  name: string;
  nameLt: string;
  sizeMl: number;
  use: string;
  useLt: string;
  cap: ApexCareCap;
  shopCents: number;
  labelFile: string;
};

export const APEX_CARE_LAUNCH: ApexCareSku[] = [
  {
    sku: "APX-WASH-500",
    name: "WASH",
    nameLt: "Šampūnas",
    sizeMl: 500,
    use: "pH-neutral shampoo",
    useLt: "pH-neutralus šampūnas",
    cap: "flip",
    shopCents: 1290,
    labelFile: "/brand/apex-care/label-wash.svg",
  },
  {
    sku: "APX-WHEEL-500",
    name: "WHEEL",
    nameLt: "Ratlankiai",
    sizeMl: 500,
    use: "iron remover",
    useLt: "geležies nuosėdų valiklis",
    cap: "trigger",
    shopCents: 1490,
    labelFile: "/brand/apex-care/label-wheel.svg",
  },
  {
    sku: "APX-GLASS-500",
    name: "GLASS",
    nameLt: "Stiklai",
    sizeMl: 500,
    use: "streak-free glass cleaner",
    useLt: "stiklų valiklis be dryžių",
    cap: "trigger",
    shopCents: 1190,
    labelFile: "/brand/apex-care/label-glass.svg",
  },
  {
    sku: "APX-QUICK-500",
    name: "QUICK",
    nameLt: "Greitas blizgesys",
    sizeMl: 500,
    use: "polymer quick detailer",
    useLt: "polimerinis greito blizgesio purškalas",
    cap: "spray",
    shopCents: 1590,
    labelFile: "/brand/apex-care/label-quick.svg",
  },
];

export const APEX_CARE_KIT = {
  sku: "APX-CARE-4PK",
  name: "APEX Care kit",
  nameLt: "APEX Care rinkinys",
  shopCents: 4990,
  contains: APEX_CARE_LAUNCH.map((row) => row.sku),
  why: "One 500 ml bottle cannot carry €4.90 LT shipping. The four-pack can.",
};

export const APEX_CARE_PHASE_2: ApexCareSku[] = [
  {
    sku: "APX-FOAM-1000",
    name: "FOAM",
    nameLt: "Putos",
    sizeMl: 1000,
    use: "pH-neutral snow foam",
    useLt: "pH-neutralios sniego putos",
    cap: "flip",
    shopCents: 1890,
    labelFile: "/brand/apex-care/label-wash.svg",
  },
  {
    sku: "APX-CABIN-500",
    name: "CABIN",
    nameLt: "Salonas",
    sizeMl: 500,
    use: "interior cleaner",
    useLt: "salono valiklis",
    cap: "trigger",
    shopCents: 1390,
    labelFile: "/brand/apex-care/label-glass.svg",
  },
];

export const APEX_CARE_SUPPLIERS = [
  {
    id: "boker",
    name: "UAB Boker",
    role: "First ask — Vilnius plant, auto chemicals, small batches, SDS, same-country freight",
    country: "LT",
    url: "https://boker.lt/en/private-label-chemijos-gamyba-uab-boker/",
    email: "orders@boker.lt",
    infoEmail: "info@boker.lt",
    phone: "+370 610 25858",
    address: "A. V. Graičiūno g. 20A, LT-02241 Vilnius",
    companyCode: "123681039",
    vat: "LT100004634210",
    moq: "Small batches (quote). No public 24-pc figure.",
    dropship: "Batch to us in LT. Ask if they will hold labeled stock and ship single cartons.",
  },
  {
    id: "ccpl",
    name: "Car Care Private Label (Parluxe)",
    role: "Lowest published MOQ in EU detailing — 24 pcs/SKU, own plant, SDS/UFI/CLP, ~3 weeks after label sign-off",
    country: "NL",
    url: "https://carcareprivatelabel.nl/",
    email: "info@carcareprivatelabel.nl",
    infoEmail: "info@carcareprivatelabel.nl",
    phone: "+31 223 235 033",
    address: "Koperslagersweg 15, 1786 RA Den Helder",
    companyCode: "92144527",
    vat: "NL865903761B01",
    moq: "24 pcs per product",
    dropship: "Fill + label + batch ship. Goods not collected in 30 days incur storage. Not advertised as B2C dropship.",
  },
  {
    id: "unitarpin",
    name: "Unitarpin",
    role: "Poland car-cosmetics plant, 25+ years, 500 ml–1 L PET/HDPE + trigger, short runs",
    country: "PL",
    url: "https://unitarpin.pl/producent-kosmetyki-samochodowej/",
    email: "sales@unitarpin.com",
    infoEmail: "sales@unitarpin.com",
    phone: "+48 14 632 46 50",
    address: "ul. Kwiatkowskiego 8, 33-101 Tarnów",
    companyCode: null,
    vat: null,
    moq: "Short series (quote)",
    dropship: "B2B fill + pack. No public webshop dropship.",
  },
  {
    id: "cc24",
    name: "CarCare24.eu",
    role: "Backup NL — 500 ml cylinders + 5 L cans, ceramic QD/shampoo formulas, ECHA help",
    country: "NL",
    url: "https://www.carcare24.eu/en/private-labelling-white-label",
    email: "info@carcare24.eu",
    infoEmail: "info@carcare24.eu",
    phone: "+31 546 456 716",
    address: "Klavermaten 26, 7472 DD Goor",
    companyCode: null,
    vat: null,
    moq: "Quote only",
    dropship: "Custom fill + label. Not advertised as webshop dropship.",
  },
  {
    id: "sireon",
    name: "Private Label Car Care / Sireon",
    role: "Larger runs from 120 pcs; they ship finished goods to an address we name",
    country: "NL",
    url: "https://www.privatelabelcarcare.nl/auto-reiniging/",
    email: "info@sireon.nl",
    infoEmail: "info@sireon.nl",
    phone: "+31 252 62 66 99",
    address: "Luzernestraat 142, 2153 GN Nieuw-Vennep",
    companyCode: null,
    vat: null,
    moq: "120 pcs",
    dropship: "Ship pallet to LT or a 3PL. Not per-order B2C.",
  },
] as const;

/** First-order ballpark only until a filler returns a signed quote. Not a price list. */
export const APEX_CARE_COST_HINT = {
  moqEach: 24,
  skusLaunch: 4,
  bottlesLaunch: 96,
  firstOrderEurEach: { low: 5.5, high: 9 },
  firstOrderTotalEur: { low: 550, high: 950 },
  freightNlToLtEur: { low: 45, high: 90 },
  freightLtLocalEur: { low: 0, high: 25 },
  kitShopEur: 49.9,
  kitCostEur: { low: 22, high: 36 },
  note: "CCPL prices are ex-VAT. Label print is a larger staffel stored for reorders. Reorders drop because labels are already paid. Boker freight is local.",
};

export const APEX_CARE_LABEL_ART = {
  wash: { sku: "APX-WASH-500", name: "WASH", use: "PH-NEUTRAL SHAMPOO", size: "500 ml" },
  wheel: { sku: "APX-WHEEL-500", name: "WHEEL", use: "IRON REMOVER", size: "500 ml" },
  glass: { sku: "APX-GLASS-500", name: "GLASS", use: "STREAK-FREE", size: "500 ml" },
  quick: { sku: "APX-QUICK-500", name: "QUICK", use: "POLYMER DETAIL SPRAY", size: "500 ml" },
} as const;

/**
 * Print file 80 × 140 mm. Keep CLP/UFI off this face — filler supplies the reverse.
 * Colors: #070708 black, #F4F4F5 type, #E10600 rule. Condensed tracking.
 */
export function apexCareFrontSvg(key: keyof typeof APEX_CARE_LABEL_ART) {
  const opts = APEX_CARE_LABEL_ART[key];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="80mm" height="140mm" viewBox="0 0 80 140">
  <rect width="80" height="140" fill="#070708"/>
  <rect x="3" y="3" width="74" height="134" fill="none" stroke="#3A3A40" stroke-width="0.35"/>
  <line x1="12" y1="14" x2="68" y2="14" stroke="#E10600" stroke-width="0.7"/>
  <text x="40" y="36" text-anchor="middle" fill="#F4F4F5" font-family="Barlow Condensed, Arial Narrow, Helvetica Neue, sans-serif" font-size="14" font-weight="700" letter-spacing="4">APEX</text>
  <line x1="12" y1="42" x2="68" y2="42" stroke="#E10600" stroke-width="0.7"/>
  <text x="40" y="52" text-anchor="middle" fill="#9A9AA3" font-family="Barlow Condensed, Arial Narrow, Helvetica Neue, sans-serif" font-size="4" font-weight="600" letter-spacing="3.2">CARE</text>
  <line x1="18" y1="62" x2="62" y2="62" stroke="#3A3A40" stroke-width="0.25"/>
  <text x="40" y="86" text-anchor="middle" fill="#F4F4F5" font-family="Barlow Condensed, Arial Narrow, Helvetica Neue, sans-serif" font-size="11" font-weight="600" letter-spacing="2.4">${opts.name}</text>
  <text x="40" y="98" text-anchor="middle" fill="#9A9AA3" font-family="Barlow Condensed, Arial Narrow, Helvetica Neue, sans-serif" font-size="4" letter-spacing="1.4">${opts.size}</text>
  <line x1="22" y1="106" x2="58" y2="106" stroke="#3A3A40" stroke-width="0.25"/>
  <text x="40" y="116" text-anchor="middle" fill="#C8C8CE" font-family="Barlow Condensed, Arial Narrow, Helvetica Neue, sans-serif" font-size="3.4" letter-spacing="0.8">${opts.use}</text>
  <text x="40" y="128" text-anchor="middle" fill="#6A6A72" font-family="Barlow Condensed, Arial Narrow, Helvetica Neue, sans-serif" font-size="2.6" letter-spacing="1.1">${opts.sku} · CLP / UFI ON REVERSE</text>
</svg>
`;
}

export const APEX_CARE_INQUIRY_BOKER = `To: orders@boker.lt
Cc: info@boker.lt
Subject: Private label užklausa — APEX Care 4×500 ml (Vilnius)

Sveiki,

esame APEX, automobilių dalių parduotuvė Lietuvoje (masinu-shop.vercel.app). Norime savo detailing linijos APEX Care — mūsų logotipas, mūsų etiketės, ne Chemical Guys perlipdymas.

Pirma partija (24 vnt. kiekvieno, 500 ml, jei įmanoma mažesnis MOQ — parašykite):
1. APX-WASH-500 — pH-neutralus šampūnas, flip dangtelis
2. APX-WHEEL-500 — ratlankių / geležies nuosėdų valiklis, trigger
3. APX-GLASS-500 — stiklų valiklis, trigger
4. APX-QUICK-500 — polimerinis greito blizgesio purškalas, smulkus purškimas

Prašome kainos:
- vieneto kaina pirmai partijai ir pakartotiniam užsakymui (be PVM)
- buteliuko + dangtelio SKU, kuriuos rekomenduojate
- etiketės dydis / šablonas (pridedame SVG)
- SDS, UFI, CLP lietuvių ir anglų kalbomis
- pavyzdžiai
- gamybos terminas
- ar galite laikyti paženklintą sandėlį ir siųsti pavienius kartonus LT klientams (tikras dropship), ar tik partiją mums į Vilnių / Panevėžį

Dizainas: juoda etiketė, baltas APEX žodis, 2 pt raudona linija (#E10600), produkto vardas WASH / WHEEL / GLASS / QUICK.

Ačiū
APEX
`;

export const APEX_CARE_INQUIRY_NL = `To: info@carcareprivatelabel.nl
Cc: info@carcare24.eu; sales@unitarpin.com
Subject: Private label quote — APEX Care 4×500 ml (Lithuania)

Hello,

We run APEX, an automotive parts shop in Lithuania (masinu-shop.vercel.app). We want a small APEX Care line under our own brand — our logo, our labels — not a relabel of Chemical Guys.

Launch (24 pcs each, 500 ml):
1. APX-WASH-500 — pH-neutral car shampoo, flip cap
2. APX-WHEEL-500 — wheel cleaner / iron remover, trigger
3. APX-GLASS-500 — glass cleaner, trigger
4. APX-QUICK-500 — polymer quick detail spray, fine mist

Please quote:
- unit price first order vs reorder (ex VAT)
- bottle + cap SKUs you recommend
- label print size/template (we attach SVG artwork)
- setup fees and label staffel
- SDS, UFI, CLP in English and Lithuanian
- samples
- lead time to Lithuania (Vilnius / Panevėžys)
- whether you can hold labeled stock and ship single cartons to LT customers (true dropship) or only pallet/batch to us

Artwork: black label, white condensed APEX wordmark, 2 pt red rule (#E10600), product name WASH / WHEEL / GLASS / QUICK.

Thank you
APEX
`;
