import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { Skeleton } from "@/components/ui/EmptyState";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-8"><Skeleton className="h-96" /></div>}>
      <CatalogView />
    </Suspense>
  );
}
