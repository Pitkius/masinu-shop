import { Suspense } from "react";
import { TryOnView } from "@/components/tryon/TryOnView";
import { Skeleton } from "@/components/ui/EmptyState";

export default async function TryOnPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  return (
    <Suspense fallback={<div className="p-8"><Skeleton className="h-80" /></div>}>
      <TryOnView productSlug={product} />
    </Suspense>
  );
}
