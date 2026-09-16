import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { categories } from "@/data/categories";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/EmptyState";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const found = categories.find((item) => item.slug === category);
  if (!found) return {};
  return { title: found.name, description: found.description, alternates: { canonical: `/shop/${found.slug}` } };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!categories.some((item) => item.slug === category)) notFound();
  return (
    <Suspense fallback={<div className="p-8"><Skeleton className="h-96" /></div>}>
      <CatalogView category={category} />
    </Suspense>
  );
}
