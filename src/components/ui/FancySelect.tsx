"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type SelectOption = { value: string; label: string };

export function FancySelect({
  value,
  onChange,
  options,
  placeholder = "Select",
  searchPlaceholder = "Search",
  emptyLabel = "No matches",
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [rect, setRect] = useState<DOMRect | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchable = options.length > 8;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => option.label.toLowerCase().includes(q) || option.value.toLowerCase().includes(q));
  }, [options, query]);

  const selected = options.find((option) => option.value === value);

  const place = () => {
    const node = buttonRef.current;
    if (!node) return;
    setRect(node.getBoundingClientRect());
  };

  useEffect(() => {
    if (!open) return;
    place();
    const onDoc = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node) && !menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    const timer = window.setTimeout(() => searchRef.current?.focus(), 20);
    return () => {
      window.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      window.clearTimeout(timer);
    };
  }, [open]);

  const menuStyle = (() => {
    if (!rect) return undefined;
    const maxH = 280;
    const gap = 6;
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const openUp = spaceBelow < 160 && rect.top > spaceBelow;
    return {
      position: "fixed" as const,
      left: rect.left,
      width: rect.width,
      top: openUp ? undefined : rect.bottom + gap,
      bottom: openUp ? window.innerHeight - rect.top + gap : undefined,
      maxHeight: Math.min(maxH, openUp ? rect.top - 12 : spaceBelow),
      zIndex: 90,
    };
  })();

  return (
    <div ref={rootRef} className="relative mt-2">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          place();
          setOpen((prev) => !prev);
        }}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-2xl border bg-surface px-4 py-3 text-left text-sm transition",
          open ? "border-foreground" : "border-line hover:border-foreground/60",
          disabled && "cursor-not-allowed opacity-40",
        )}
      >
        <span className={selected ? "text-foreground" : "text-muted"}>{selected?.label ?? placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted transition", open && "rotate-180")} />
      </button>
      {open && menuStyle ? (
        <div
          ref={menuRef}
          style={menuStyle}
          className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_16px_50px_rgba(0,0,0,0.45)]"
        >
          {searchable ? (
            <div className="border-b border-line p-2">
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted focus:border-foreground"
              />
            </div>
          ) : null}
          <div className="min-h-0 flex-1 overflow-y-auto py-1">
            <button
              type="button"
              className={cn("flex w-full px-4 py-2.5 text-left text-sm", !value ? "bg-accent/15 text-foreground" : "text-muted hover:bg-white/5")}
              onClick={() => {
                onChange("");
                setOpen(false);
                setQuery("");
              }}
            >
              {placeholder}
            </button>
            {filtered.length ? (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "flex w-full px-4 py-2.5 text-left text-sm",
                    option.value === value ? "bg-accent text-white" : "text-foreground hover:bg-white/5",
                  )}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-muted">{emptyLabel}</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
