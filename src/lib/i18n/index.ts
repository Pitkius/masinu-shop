"use client";

import { en, type Messages } from "./en";
import { lt } from "./lt";

export type Locale = "en" | "lt";
export const locales: Locale[] = ["en", "lt"];
export const messages: Record<Locale, Messages> = { en, lt };

export function getByPath(obj: unknown, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof value === "string" ? value : path;
}

export function translate(locale: Locale, key: string, vars?: Record<string, string>) {
  let text = getByPath(messages[locale], key) || getByPath(en, key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, v);
    }
  }
  return text;
}

export { en, lt };
