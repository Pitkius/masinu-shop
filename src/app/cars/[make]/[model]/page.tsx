import Link from "next/link";
import { notFound } from "next/navigation";
import { vehicles } from "@/data/vehicles";
import type { Metadata } from "next";

export function generateStaticParams() {
  const pairs = new Map<string, { make: string; model: string }>();
  for (const vehicle of vehicles) pairs.set(`${vehicle.makeSlug}-${vehicle.modelSlug}`, { make: vehicle.makeSlug, model: vehicle.modelSlug });
  return [...pairs.values()];
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; model: string }> }): Promise<Metadata> {
  const { make, model } = await params;
  const vehicle = vehicles.find((item) => item.makeSlug === make && item.modelSlug === model);
  return { title: vehicle ? `${vehicle.make} ${vehicle.model}` : "Car" };
}

export default async function ModelPage({ params }: { params: Promise<{ make: string; model: string }> }) {
  const { make, model } = await params;
  const list = vehicles.filter((item) => item.makeSlug === make && item.modelSlug === model);
  if (!list.length) notFound();
  const generations = [...new Set(list.map((item) => item.generationSlug))];
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl">{list[0].make} {list[0].model}</h1>
      <ul className="mt-8 space-y-3">
        {generations.map((generation) => (
          <li key={generation}>
            <Link href={`/cars/${make}/${model}/${generation}`}>{list.find((item) => item.generationSlug === generation)?.generation}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
