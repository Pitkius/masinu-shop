import Link from "next/link";
import { notFound } from "next/navigation";
import { vehicles } from "@/data/vehicles";
import type { Metadata } from "next";

export function generateStaticParams() {
  const makes = [...new Set(vehicles.map((v) => v.makeSlug))];
  return makes.map((make) => ({ make }));
}

export async function generateMetadata({ params }: { params: Promise<{ make: string }> }): Promise<Metadata> {
  const { make } = await params;
  const vehicle = vehicles.find((item) => item.makeSlug === make);
  return { title: vehicle?.make, description: `Parts for ${vehicle?.make}` };
}

export default async function MakePage({ params }: { params: Promise<{ make: string }> }) {
  const { make } = await params;
  const list = vehicles.filter((item) => item.makeSlug === make);
  if (!list.length) notFound();
  const models = [...new Set(list.map((item) => item.modelSlug))];
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl">{list[0].make}</h1>
      <ul className="mt-8 space-y-3">
        {models.map((model) => {
          const sample = list.find((item) => item.modelSlug === model)!;
          return (
            <li key={model}>
              <Link href={`/cars/${make}/${model}`}>
                {sample.make} {sample.model}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
