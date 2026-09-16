import { Suspense } from "react";
import { TryOnView } from "@/components/tryon/TryOnView";
import { Skeleton } from "@/components/ui/EmptyState";

export default function TryOnPage() {
  return (
    <Suspense fallback={<div className="p-8"><Skeleton className="h-80" /></div>}>
      <TryOnView />
    </Suspense>
  );
}
