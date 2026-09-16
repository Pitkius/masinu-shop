import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { formatMoney } from "@/lib/money";

export default async function AdminProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);
  if (!product) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl">{product.title}</h1>
      <p className="mt-3 text-sm text-muted">Read-only until DATABASE_URL is connected. Payload shape is ready for persistence.</p>
      <dl className="mt-8 space-y-3 text-sm">
        {[
          ["Slug", product.slug],
          ["SKU", product.sku],
          ["MPN", product.mpn],
          ["OEM", product.oemNumbers.join(", ") || "—"],
          ["Price", formatMoney(product.price)],
          ["Stock", String(product.stock)],
          ["Supplier", `${product.supplierId ?? "—"} / ${product.supplierSku ?? "—"}`],
          ["Category", product.category],
          ["SEO title", product.seoTitle],
        ].map(([k, v]) => (
          <div key={k} className="grid grid-cols-3 gap-4 border-b border-line py-3">
            <dt className="text-muted">{k}</dt>
            <dd className="col-span-2">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
