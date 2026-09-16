import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase transition disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" && "bg-accent text-black hover:bg-accent-2",
        variant === "secondary" && "border border-line bg-transparent text-foreground hover:border-foreground/40",
        variant === "ghost" && "text-foreground/70 hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
