export type PageItem = number | "gap";

/** At most `max` numbered pages, with gaps for the rest. */
export function visiblePageNumbers(current: number, total: number, max = 10): PageItem[] {
  if (total < 1) return [];
  const page = Math.min(Math.max(1, current), total);
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total]);
  const windowSize = max - 2;
  let start = Math.max(2, page - Math.floor((windowSize - 1) / 2));
  let end = start + windowSize - 1;
  if (end > total - 1) {
    end = total - 1;
    start = Math.max(2, end - windowSize + 1);
  }
  for (let i = start; i <= end; i++) pages.add(i);

  const sorted = [...pages].sort((a, b) => a - b);
  const items: PageItem[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) items.push("gap");
    items.push(sorted[i]);
  }
  return items;
}
