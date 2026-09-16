import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publicBuilds } from "@/data/builds";
import { products } from "@/data/products";
import { vehicles, vehicleLabel } from "@/data/vehicles";
import { formatMoney } from "@/lib/money";
import { ProductCard } from "@/components/product/ProductCard";
import type { Metadata } from "next";

export function generateStaticParams() {
  return publicBuilds.map((build) => ({ slug: build.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const build = publicBuilds.find((item) => item.slug === slug);
  return { title: build?.title, description: build?.story };
}

export default async function PublicBuildPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const build = publicBuilds.find((item) => item.slug === slug);
  if (!build) notFound();
  const vehicle = vehicles.find((item) => item.id === build.vehicleId);
  const items = build.productSlugs.map((item) => products.find((p) => p.slug === item)).filter(Boolean);
  const total = items.reduce((sum, p) => sum + (p?.price ?? 0), 0);
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <div className="relative aspect-[16/8] overflow-hidden rounded-3xl">
        <Image src={build.photo} alt={build.title} fill className="object-cover" />
      </div>
      <h1 className="mt-8 text-4xl">{build.title}</h1>
      {vehicle ? <p className="mt-2 text-muted">{vehicleLabel(vehicle)} · {vehicle.engineCode}</p> : null}
      <p className="mt-4 max-w-2xl text-muted">{build.story}</p>
      <p className="mt-4 text-sm">Build total {formatMoney(total)}</p>
      <h2 className="mt-10 text-[11px] uppercase tracking-[0.18em] text-muted">Installed</h2>
      <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-3">
        {items.map((product) => product && <ProductCard key={product.id} product={product} />)}
      </div>
      <Link href="/" className="mt-10 inline-flex rounded-full bg-accent px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black">
        BUILD YOUR OWN
      </Link>
    </div>
  );
}
