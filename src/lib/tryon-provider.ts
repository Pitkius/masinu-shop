import { fetchCatalogImage } from "@/lib/catalog-image";
import { tryOnPrompt, type TryOnProductHint } from "@/lib/tryon";

export function tryOnConfigured() {
  return Boolean(process.env.TRYON_API_URL || process.env.OPENAI_API_KEY);
}

type ImageBlob = { bytes: Buffer; mime: string };

function parseDataUrl(value: string): ImageBlob {
  const match = /^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/i.exec(value);
  if (!match) throw new Error("Use a JPEG, PNG or WebP photo.");
  const mime = match[1].toLowerCase() === "image/jpg" ? "image/jpeg" : match[1].toLowerCase();
  const bytes = Buffer.from(match[2].replace(/\s/g, ""), "base64");
  if (!bytes.byteLength) throw new Error("Empty photo.");
  if (bytes.byteLength > 4.5 * 1024 * 1024) throw new Error("Photo is too large.");
  return { bytes, mime };
}

function fileFrom(image: ImageBlob, name: string) {
  return new File([new Uint8Array(image.bytes)], name, { type: image.mime });
}

async function viaCustomProvider(prompt: string, car: ImageBlob, part: ImageBlob | null) {
  const url = process.env.TRYON_API_URL;
  if (!url) return null;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.TRYON_API_KEY ? { Authorization: `Bearer ${process.env.TRYON_API_KEY}` } : {}),
    },
    body: JSON.stringify({
      prompt,
      car: { mime: car.mime, b64: car.bytes.toString("base64") },
      part: part ? { mime: part.mime, b64: part.bytes.toString("base64") } : null,
    }),
    signal: AbortSignal.timeout(55000),
  });

  const payload = (await response.json().catch(() => null)) as
    | { image?: string; b64?: string; mime?: string; error?: string }
    | null;
  if (!response.ok || !payload) {
    throw new Error(payload?.error || "Visualization provider failed.");
  }
  if (payload.image?.startsWith("data:image/")) return payload.image;
  if (payload.b64) return `data:${payload.mime ?? "image/png"};base64,${payload.b64}`;
  throw new Error("Visualization provider returned no image.");
}

type OpenAIEditResult =
  | { data?: { b64_json?: string; url?: string }[]; error?: { message?: string }; message?: string }
  | null;

async function postOpenAIEdit(key: string, form: FormData) {
  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
    signal: AbortSignal.timeout(55000),
  }).catch(() => null);

  if (!response) return { ok: false as const, payload: null, timeout: true };
  const payload = (await response.json().catch(() => null)) as OpenAIEditResult;
  return { ok: response.ok, payload, timeout: false };
}

function readOpenAIImage(payload: OpenAIEditResult) {
  return payload?.data?.[0]?.b64_json ? `data:image/png;base64,${payload.data[0].b64_json}` : null;
}

function buildEditForm(model: string, prompt: string, car: ImageBlob, part: ImageBlob | null, extras: boolean) {
  const form = new FormData();
  form.append("model", model);
  form.append("prompt", prompt);
  form.append("quality", extras ? "medium" : "low");
  form.append("size", extras ? "auto" : "1536x1024");
  if (extras) form.append("input_fidelity", "high");
  form.append("image", fileFrom(car, "car.jpg"));
  if (part) form.append("image", fileFrom(part, "part.jpg"));
  return form;
}

async function openaiEdit(prompt: string, car: ImageBlob, part: ImageBlob | null) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const models = [...new Set([process.env.TRYON_IMAGE_MODEL, "gpt-image-1", "gpt-image-1-mini"].filter(Boolean))] as string[];
  let lastError = "Image model is unavailable.";

  for (const model of models) {
    let extras = true;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const { ok, payload, timeout } = await postOpenAIEdit(key, buildEditForm(model, prompt, car, part, extras));
      if (timeout) throw new Error("Visualization timed out.");
      if (!ok) {
        lastError = payload?.error?.message || payload?.message || lastError;
        extras = false;
        continue;
      }
      const b64 = readOpenAIImage(payload);
      if (b64) return b64;
      const url = payload?.data?.[0]?.url;
      if (!url) break;
      const image = await fetch(url, { signal: AbortSignal.timeout(20000) }).catch(() => null);
      if (!image?.ok) break;
      const bytes = Buffer.from(await image.arrayBuffer());
      const mime = image.headers.get("content-type") || "image/png";
      return `data:${mime};base64,${bytes.toString("base64")}`;
    }
  }

  throw new Error(lastError);
}

export async function renderTryOn(input: {
  product: TryOnProductHint & { images: string[] };
  imageDataUrl: string;
  kind: "body" | "stance" | "engine" | "interior";
  vehicleLabel?: string;
}) {
  if (!tryOnConfigured()) {
    throw new Error("Visualization is not configured.");
  }

  const car = parseDataUrl(input.imageDataUrl);
  const partSrc = input.product.images[0];
  const part = partSrc ? await fetchCatalogImage(partSrc) : null;
  const prompt = tryOnPrompt(input.product, input.kind, input.vehicleLabel);

  const custom = await viaCustomProvider(prompt, car, part).catch((error: unknown) => {
    if (process.env.OPENAI_API_KEY) return null;
    throw error;
  });
  if (custom) return custom;

  const generated = await openaiEdit(prompt, car, part);
  if (!generated) throw new Error("Visualization is not configured.");
  return generated;
}
