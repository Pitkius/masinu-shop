import { notFound } from "next/navigation";
import { vehicles, vehicleLabel, compareAlpha } from "@/data/vehicles";
import { products } from "@/data/products";
import { ProductCard, productGridClass } from "@/components/product/ProductCard";
import type { Metadata } from "next";

export function generateStaticParams() {
  const set = new Map<string, { make: string; model: string; generation: string }>();
  for (const vehicle of vehicles) {
    set.set(`${vehicle.makeSlug}-${vehicle.modelSlug}-${vehicle.generationSlug}`, {
      make: vehicle.makeSlug,
      model: vehicle.modelSlug,
      generation: vehicle.generationSlug,
    });
  }
  return [...set.values()];
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; model: string; generation: string }> }): Promise<Metadata> {
  const { make, model, generation } = await params;
  const vehicle = vehicles.find((item) => item.makeSlug === make && item.modelSlug === model && item.generationSlug === generation);
  return {
    title: vehicle ? `${vehicle.make} ${vehicle.model} ${vehicle.generation} parts` : "Car",
    description: vehicle ? `Compatible parts for ${vehicleLabel(vehicle, false)}.` : undefined,
    alternates: { canonical: `/cars/${make}/${model}/${generation}` },
  };
}

export default async function GenerationPage({ params }: { params: Promise<{ make: string; model: string; generation: string }> }) {
  const { make, model, generation } = await params;
  const list = vehicles.filter((item) => item.makeSlug === make && item.modelSlug === model && item.generationSlug === generation);
  if (!list.length) notFound();
  const ids = new Set(list.map((item) => item.id));
  const matches = products.filter((product) =>
    product.compatibility.some((fit) => ids.has(fit.vehicleId) && (fit.fitmentType === "EXACT" || fit.fitmentType === "COMPATIBLE")),
  );
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <h1 className="text-4xl">{list[0].make} {list[0].model} {list[0].generation}</h1>
      <p className="mt-2 text-muted">{list[0].yearFrom}–{list[0].yearTo}</p>
      <ul className="mt-6 space-y-1 text-sm text-muted">
        {[...list].sort((a, b) => compareAlpha(a.body, b.body) || compareAlpha(a.engine, b.engine)).map((item) => (
          <li key={item.id}>{vehicleLabel(item)} · {item.engineCode}</li>
        ))}
      </ul>
      <div className={`mt-10 ${productGridClass}`}>
        {matches.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}
