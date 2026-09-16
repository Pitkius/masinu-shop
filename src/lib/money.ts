export function formatMoney(cents: number, currency = "EUR", locale = "en-IE") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function formatHours(minutes: number | null | undefined) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return hours % 1 === 0 ? `${hours} h` : `${hours.toFixed(1)} h`;
}
