"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export type LetterCard = {
  id: string;
  kind: "supplier" | "brand";
  name: string;
  to: string | null;
  contactUrl: string | null;
  skuCount: number;
  subject: string;
  body: string;
  csvQuery: string;
};

export function SupplierPhotoDesk({ letters }: { letters: LetterCard[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(key: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-8">
      <div className="border border-line p-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Outbox</p>
        <h2 className="mt-2 text-2xl">{letters.length} letters written</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Each letter has its own SKU CSV. When a reply comes back:{" "}
          <code className="font-mono text-xs">npx tsx scripts/import-supplier-photos.ts reply.csv</code>
        </p>
      </div>
      {letters.map((letter) => (
        <article key={letter.id} className="border border-line p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{letter.kind}</p>
              <h3 className="mt-1 text-xl">{letter.name}</h3>
              <p className="mt-1 text-sm text-muted">
                {letter.to ?? "No inbox on file"} · {letter.skuCount} SKUs
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              {letter.to ? (
                <a className="underline" href={`mailto:${letter.to}?subject=${encodeURIComponent(letter.subject)}`}>
                  Open mail
                </a>
              ) : letter.contactUrl ? (
                <a className="underline" href={letter.contactUrl} target="_blank" rel="noreferrer">
                  Contact form
                </a>
              ) : null}
              <a className="underline" href={`/api/admin/suppliers/photo-request?${letter.csvQuery}`}>
                CSV
              </a>
            </div>
          </div>
          <pre className="mt-4 overflow-x-auto border border-line bg-surface p-3 text-sm">{letter.subject}</pre>
          <textarea readOnly value={letter.body} className="mt-3 h-72 w-full border border-line bg-surface p-3 text-sm" />
          <div className="mt-3">
            <Button variant="secondary" onClick={() => copy(letter.id, `To: ${letter.to ?? ""}\nSubject: ${letter.subject}\n\n${letter.body}`)}>
              {copied === letter.id ? "Copied" : "Copy letter"}
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
