export type TryOnScene = "exterior" | "engine" | "interior";

export type TryOnPreviewKind = "body" | "stance" | "engine" | "interior" | "hidden";

export type TryOnUnchangedReason =
  | "under-hood"
  | "interior"
  | "need-exterior"
  | "need-engine"
  | "need-interior"
  | "not-visible";

export type TryOnDecision =
  | { action: "generate"; kind: Exclude<TryOnPreviewKind, "hidden"> }
  | { action: "unchanged"; reason: TryOnUnchangedReason };

export type TryOnProductHint = {
  title: string;
  brand: string;
  sku: string;
  category: string;
  subcategory: string | null;
};

export function tryOnPreviewKind(product: TryOnProductHint): TryOnPreviewKind {
  const category = product.category;
  const sub = (product.subcategory ?? "").toLowerCase();
  const hay = `${sub} ${product.title}`.toLowerCase();

  if (category === "suspension") {
    if (/coilover|spring|lowering|shock|damper|strut/.test(hay)) return "stance";
    return "hidden";
  }

  if (category === "wheels") return sub === "hardware" ? "hidden" : "body";
  if (category === "lighting") return sub === "work" ? "hidden" : "body";
  if (category === "exterior") return "body";
  if (category === "accessories" && /plate/.test(hay)) return "body";
  if (category === "exhaust") return sub === "downpipes" ? "hidden" : "body";
  if (category === "brakes") return sub === "discs" ? "body" : "hidden";
  if (category === "interior") return "interior";
  if (category === "electronics" && sub === "dashcam") return "interior";
  if (category === "engine" || category === "performance") {
    if (/front mount|fmic/.test(hay)) return "body";
    return "engine";
  }

  return "hidden";
}

export function tryOnDecision(kind: TryOnPreviewKind, scene: TryOnScene): TryOnDecision {
  if (kind === "hidden") return { action: "unchanged", reason: "not-visible" };

  if (kind === "body" || kind === "stance") {
    if (scene === "exterior") return { action: "generate", kind };
    return { action: "unchanged", reason: "need-exterior" };
  }

  if (kind === "engine") {
    if (scene === "engine") return { action: "generate", kind: "engine" };
    if (scene === "exterior") return { action: "unchanged", reason: "under-hood" };
    return { action: "unchanged", reason: "need-engine" };
  }

  if (scene === "interior") return { action: "generate", kind: "interior" };
  if (scene === "exterior") return { action: "unchanged", reason: "interior" };
  return { action: "unchanged", reason: "need-interior" };
}

function installTask(product: TryOnProductHint, kind: Exclude<TryOnPreviewKind, "hidden">) {
  const sub = (product.subcategory ?? "").toLowerCase();
  const hay = `${sub} ${product.title}`.toLowerCase();

  if (kind === "stance") {
    return "Lower this car's ride height to match the suspension. Reduce the gap between the wheel arches and the tires so the car sits closer to the ground. Keep the same wheels, body color, panels and background. Do not paste a coilover product photo onto the image.";
  }
  if (kind === "engine") {
    return "Install this engine-bay part onto the engine in the photo in its real mounting position, with correct scale, brackets, hoses and lighting. Keep the rest of the bay the same.";
  }
  if (kind === "interior") {
    if (/mat|kilim/.test(hay)) {
      return "Place these floor mats in the cabin, fitted onto the footwells as they would look after installation.";
    }
    if (/steering/.test(hay)) {
      return "Replace the steering wheel with this wheel, fitted on the column at the correct angle.";
    }
    if (/dash.?cam/.test(hay)) {
      return "Install this dash camera on the windshield as a real fitted accessory, small and correctly perspective-matched.";
    }
    return "Install this interior part in the cabin where it belongs in real life.";
  }

  if (/grille|grotel/.test(hay)) {
    return "Replace the factory front grille with this grille, fitted into the OEM opening in the bumper. It must look installed, with correct perspective, mesh depth, surrounding body color and shadows.";
  }
  if (/wheel|rim/.test(hay) && !/steering/.test(hay)) {
    return "Replace every visible road wheel with this wheel design, fitted on the hubs, with correct perspective, dish, and reflections. Keep the same tires unless the catalog photo is a complete wheel-and-tire package.";
  }
  if (/headlight|headlamp/.test(hay)) {
    return "Replace the headlights with these lamps, seated in the factory housings, lit consistently with the scene.";
  }
  if (/tail light|taillight/.test(hay)) {
    return "Replace the tail lights with these lamps, seated in the factory rear housings.";
  }
  if (/fog/.test(hay)) {
    return "Install these fog lights in the front bumper fog apertures.";
  }
  if (/lip|splitter/.test(hay)) {
    return "Install this front lip / splitter along the bottom of the front bumper, following the bumper edge, with realistic thickness and shadow on the ground.";
  }
  if (/skirt|sijon/.test(hay)) {
    return "Install these side skirts along the rocker panels between the wheels.";
  }
  if (/diffuser|valance/.test(hay)) {
    return "Install this rear diffuser / valance under the rear bumper.";
  }
  if (/spoiler|wing/.test(hay)) {
    return "Install this spoiler / wing on the trunk or roof edge where this car would run it.";
  }
  if (/bumper|bamper/.test(hay)) {
    return "Replace the relevant bumper with this bumper, body-colored and fully fitted to the car.";
  }
  if (/plate/.test(hay)) {
    return "Fit this license-plate frame on the car's plate, replacing the existing frame if there is one.";
  }
  if (/exhaust|tip|cat-back|catback/.test(hay)) {
    return "Show this exhaust as fitted: visible tailpipes / rear valance area matching the catalog part, installed on this car.";
  }
  if (/disc|rotor/.test(hay)) {
    return "Show these brake discs fitted behind the visible wheels if the spokes allow; otherwise keep the exterior otherwise unchanged.";
  }

  return `Install this ${product.brand} part on the car in the real location it belongs, fully fitted — not floating, not as a studio cutout.`;
}

export function tryOnPrompt(product: TryOnProductHint, kind: Exclude<TryOnPreviewKind, "hidden">, vehicleName?: string) {
  const car = vehicleName ? `The vehicle is a ${vehicleName}. ` : "";
  return [
    "Edit the customer's car photograph so the car looks like this modification is actually installed.",
    "The first image is the customer's photo. Keep the same car, camera angle, cropping, lighting, weather, background, paint color, windows, and license plate.",
    "If a second image is provided, it is only a manufacturer catalog reference for the exact SKU's shape and finish. Do not collage it. Do not overlay a PNG sticker or product cutout. Do not copy its studio background, props, watermarks, or logos onto the car photo.",
    installTask(product, kind),
    `${car}SKU: ${product.brand} ${product.title} (${product.sku}).`,
    "Output one photorealistic photograph of this same car after the modification.",
  ].join(" ");
}
