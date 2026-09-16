import { vehicles } from "@/data/vehicles";
import { vehicleLabel } from "@/data/vehicles";
import { categories } from "@/data/categories";
import { suppliers } from "@/data/suppliers";
import { products } from "@/data/products";
import { reviews } from "@/data/reviews";
import { publicBuilds } from "@/data/builds";
import { brands } from "@/lib/catalog";

function Table({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl">{title}</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-line">
                {row.map((cell) => <td key={cell} className="py-3 pr-4">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function VehiclesAdmin() {
  return <Table title="Vehicles" rows={vehicles.map((v) => [vehicleLabel(v), v.engineCode, `${v.yearFrom}-${v.yearTo}`])} />;
}
export function CategoriesAdmin() {
  return <Table title="Categories" rows={categories.map((c) => [c.name, c.slug, c.filterKeys.join(", ")])} />;
}
export function SuppliersAdmin() {
  return <Table title="Suppliers" rows={suppliers.map((s) => [s.name, s.apiType, s.status, s.credentialsReference ?? "—"])} />;
}
export function SupplierProductsAdmin() {
  return <Table title="Supplier products" rows={products.filter((p) => p.supplierSku).map((p) => [p.supplierId ?? "", p.supplierSku ?? "", p.title, String(p.stock)])} />;
}
export function BrandsAdmin() {
  return <Table title="Brands" rows={brands().map((b) => [b])} />;
}
export function BuildsAdmin() {
  return <Table title="Builds" rows={publicBuilds.map((b) => [b.title, b.owner, String(b.productSlugs.length)])} />;
}
export function ReviewsAdmin() {
  return <Table title="Reviews" rows={reviews.map((r) => [r.productSlug, r.author, String(r.stars), r.title])} />;
}
export function EmptyAdmin({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl">{title}</h1>
      <p className="mt-4 text-muted">{text}</p>
    </div>
  );
}
