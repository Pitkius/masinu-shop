import { categories } from "@/data/categories";
import { shopProducts } from "@/lib/shop-catalog";
import { vehicles } from "@/data/vehicles";
import { publicBuilds } from "@/data/builds";

export default function sitemap() {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticPaths = ["", "/shop", "/goals", "/garage", "/search", "/stages", "/budget", "/finder", "/try-on", "/cart"];
  const cats = categories.map((c) => `/shop/${c.slug}`);
  const prod = shopProducts().map((p) => `/product/${p.slug}`);
  const cars = [...new Set(vehicles.map((v) => `/cars/${v.makeSlug}/${v.modelSlug}/${v.generationSlug}`))];
  const builds = publicBuilds.map((b) => `/builds/${b.slug}`);
  return [...staticPaths, ...cats, ...prod, ...cars, ...builds].map((path) => ({
    url: `${site}${path}`,
    lastModified: new Date(),
  }));
}
