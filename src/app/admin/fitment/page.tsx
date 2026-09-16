"use client";

import { FormEvent, useState } from "react";
import { products } from "@/data/products";
import { Button } from "@/components/ui/Button";

export default function AdminFitment() {
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/fitment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: form.get("productId"),
        make: form.get("make"),
        model: form.get("model"),
        generation: form.get("generation"),
        yearFrom: Number(form.get("yearFrom") || 0) || undefined,
        yearTo: Number(form.get("yearTo") || 0) || undefined,
        engine: form.get("engine") || undefined,
        fitmentType: form.get("fitmentType"),
      }),
    });
    const data = await response.json();
    setMessage(JSON.stringify(data, null, 2));
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl">Fitment</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <select name="productId" className="w-full rounded-2xl border border-line bg-surface px-3 py-3">
          {products.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        <input name="make" placeholder="Audi" className="w-full rounded-2xl border border-line bg-surface px-3 py-3" required />
        <input name="model" placeholder="A6" className="w-full rounded-2xl border border-line bg-surface px-3 py-3" required />
        <input name="generation" placeholder="C7" className="w-full rounded-2xl border border-line bg-surface px-3 py-3" required />
        <div className="grid grid-cols-2 gap-3">
          <input name="yearFrom" placeholder="2011" className="rounded-2xl border border-line bg-surface px-3 py-3" />
          <input name="yearTo" placeholder="2014" className="rounded-2xl border border-line bg-surface px-3 py-3" />
        </div>
        <input name="engine" placeholder="3.0 TDI" className="w-full rounded-2xl border border-line bg-surface px-3 py-3" />
        <select name="fitmentType" className="w-full rounded-2xl border border-line bg-surface px-3 py-3">
          <option>EXACT</option>
          <option>COMPATIBLE</option>
          <option>MODIFICATION_REQUIRED</option>
        </select>
        <Button>Add compatible vehicle</Button>
      </form>
      {message ? <pre className="mt-6 overflow-auto rounded-2xl border border-line p-4 text-xs">{message}</pre> : null}
    </div>
  );
}
