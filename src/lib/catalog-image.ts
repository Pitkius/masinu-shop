import { readFile } from "node:fs/promises";
import path from "node:path";

const MAX_BYTES = 8 * 1024 * 1024;
const PUBLIC_ROOT = path.resolve(process.cwd(), "public");

export async function fetchCatalogImage(src: string): Promise<{ bytes: Buffer; mime: string } | null> {
  if (src.startsWith("/")) {
    const file = path.resolve(PUBLIC_ROOT, src.replace(/^\/+/, ""));
    if (!file.startsWith(PUBLIC_ROOT + path.sep) && file !== PUBLIC_ROOT) return null;
    const bytes = await readFile(file).catch(() => null);
    if (!bytes || bytes.byteLength > MAX_BYTES) return null;
    const ext = path.extname(file).toLowerCase();
    const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
    return { bytes, mime };
  }

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const upstream = await fetch(src, {
    headers: { Accept: "image/*" },
    signal: AbortSignal.timeout(12000),
    redirect: "follow",
  }).catch(() => null);

  if (!upstream?.ok) return null;
  const mime = upstream.headers.get("content-type") ?? "image/jpeg";
  if (!mime.startsWith("image/")) return null;
  const bytes = Buffer.from(await upstream.arrayBuffer());
  if (bytes.byteLength > MAX_BYTES) return null;
  return { bytes, mime: mime.split(";")[0] };
}
