const COOKIE = "apex_admin";

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD) || process.env.NODE_ENV !== "production";
}

export function expectedAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV !== "production") return "apex-admin";
  return null;
}

function hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmacHex(key: string, message: string) {
  const encoded = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoded.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoded.encode(message));
  return hex(signature);
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

export async function signAdminToken() {
  const key = secret() || "dev-only-not-for-production";
  const stamp = Date.now().toString();
  const digest = await hmacHex(key, stamp);
  return `${stamp}.${digest}`;
}

export async function verifyAdminToken(token: string | undefined) {
  if (process.env.NODE_ENV === "production" && !process.env.ADMIN_PASSWORD && !process.env.ADMIN_SECRET) {
    return false;
  }
  if (!token) return false;
  const [stamp, digest] = token.split(".");
  if (!stamp || !digest) return false;
  const key = secret() || "dev-only-not-for-production";
  const expected = await hmacHex(key, stamp);
  return safeEqual(digest, expected);
}

export { COOKIE as ADMIN_COOKIE };

