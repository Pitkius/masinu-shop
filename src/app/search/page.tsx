import { Suspense } from "react";
import { SearchView } from "@/components/search/SearchViews";
import { Skeleton } from "@/components/ui/EmptyState";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8"><Skeleton className="h-40" /></div>}>
      <SearchView />
    </Suspense>
  );
}
