import type { ProductMedia } from "@/lib/types";

/** Featured SKUs that have a unique local hero. Never share these paths across products. */
const LOCAL_SKU_HEROES = new Set([
  "APX-C7-GR-RS6",
  "APX-C7-LIP",
  "APX-C7-DIF",
  "ATE-4G0615301",
  "APX-4G0615301-AM",
  "GDG-C7-LINE",
  "ATE-C7-F",
  "MLT-C7-30TDI-DP",
  "ELR-DP-GSK",
  "APX-CL-76",
  "APX-EX-HW",
  "APX-HEAT",
  "EVT-C7-TDI",
  "UNI-C7-TDI-S1",
  "WGN-C7-IC",
  "KW-C7-V2",
  "APX-W-20-5x112",
  "APX-C7-HL",
  "APX-SW-AL",
  "VRSF-E92-N54",
  "AFE-N54",
  "MHD-N54-S1",
  "VRSF-N54-IC",
  "PURE-N54-H22",
  "NOS-N54-FUEL",
  "CSF-N54",
  "APX-E92-19",
  "APX-W204-DIF",
  "APX-W204-GR",
  "MLT-MK7-GTI",
  "RL-MK7",
  "APX-5E-LIP",
  "APX-CER-30",
  "GLD-MATS",
]);

export function localSkuHero(sku: string, title: string): ProductMedia[] {
  if (!LOCAL_SKU_HEROES.has(sku)) return [];
  return [{ src: `/media/sku/${sku}/hero.png`, role: "hero", alt: title, sku }];
}
