import type { PublicBuild } from "@/lib/types";
import { vehicles } from "./vehicles";

const audi = vehicles.find((v) => v.make === "Audi" && v.generation === "C7" && v.engine === "3.0 TDI" && v.yearFrom === 2015 && v.body === "Sedan");
const bmw = vehicles.find((v) => v.engineCode === "N54B30" && v.yearFrom === 2010);
const mercedes = vehicles.find((v) => v.generation === "W204" && v.body === "Sedan" && v.yearFrom === 2011);

export const publicBuilds: PublicBuild[] = [
  {
    slug: "pijus-audi-a6-c7",
    owner: "Pijus",
    title: "Pijus's Audi A6 C7",
    vehicleId: audi?.id ?? vehicles[0].id,
    productSlugs: [
      "audi-a6-c7-rs6-style-front-grille",
      "apex-20-wheels",
      "audi-a6-c7-front-lip",
      "audi-a6-c7-coilovers",
      "audi-a6-c7-3-0-tdi-downpipe",
    ],
    story: "Street-focused C7: RS6 face, 20s, coilovers and a 3.0 TDI downpipe package.",
  },
  {
    slug: "jonas-e92-n54",
    owner: "Jonas",
    title: "Jonas's BMW E92",
    vehicleId: bmw?.id ?? vehicles[0].id,
    productSlugs: ["bmw-e92-n54-downpipe", "n54-intake", "n54-intercooler", "n54-stage1-tune"],
    story: "Stage 2 oriented N54 coupe with street manners as the brief.",
  },
  {
    slug: "aiste-w204",
    owner: "Aistė",
    title: "Aistė's Mercedes W204",
    vehicleId: mercedes?.id ?? vehicles[0].id,
    productSlugs: ["mercedes-w204-grille", "mercedes-w204-diffuser"],
    story: "Clean AMG-style exterior without touching the powertrain.",
  },
];
