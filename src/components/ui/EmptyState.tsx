import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  text,
  actions,
  className,
}: {
  title: string;
  text?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-3xl border border-line bg-surface px-6 py-14 text-center", className)}>
      <h2 className="text-lg font-medium tracking-wide">{title}</h2>
      {text ? <p className="mx-auto mt-2 max-w-md text-sm text-muted">{text}</p> : null}
      {actions ? <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div> : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-line/70", className)} />;
}
