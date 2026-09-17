import { notFound } from "next/navigation";
import { vehicles, compareAlpha, vehicleLabel } from "@/data/vehicles";
import { productsForGeneration } from "@/lib/shop-catalog";
import { ProductCard, productGridClass } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
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
  const matches = productsForGeneration(make, model, generation);
  const engines = [...new Set(list.map((item) => item.engine))].sort(compareAlpha);
  const bodies = [...new Set(list.map((item) => item.body))].sort(compareAlpha);
  const yearFrom = Math.min(...list.map((item) => item.yearFrom));
  const yearTo = Math.max(...list.map((item) => item.yearTo));
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <h1 className="text-4xl">{list[0].make} {list[0].model} {list[0].generation}</h1>
      <p className="mt-2 text-muted">{yearFrom}–{yearTo} · {bodies.join(" / ")}</p>
      <p className="mt-2 text-sm text-muted">{engines.join(" · ")}</p>
      <p className="mt-4 text-sm">{matches.length ? `${matches.length} parts for this car` : null}</p>
      {matches.length ? (
        <div className={`mt-10 ${productGridClass}`}>
          {matches.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <EmptyState
          className="mt-10"
          title="No supplier photos for this car yet"
          text="We only list parts with a unique manufacturer photo for that SKU. We will not fill the grid with empty APEX placeholders or another model's picture."
        />
      )}
    </div>
  );
}
