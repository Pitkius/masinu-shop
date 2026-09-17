import { suppliers } from "@/data/suppliers";
import { products } from "@/data/products";
import { buildPhotoLetters } from "@/lib/suppliers/photo-request";
import { SupplierPhotoDesk } from "@/components/admin/SupplierPhotoDesk";

export default function SuppliersAdminPage() {
  const letters = buildPhotoLetters(products, suppliers);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl">Suppliers</h1>
      <div className="mt-8">
        <SupplierPhotoDesk letters={letters} />
      </div>
      <table className="mt-10 w-full text-left text-sm">
        <thead>
          <tr className="text-muted">
            <th className="py-3 pr-4">Name</th>
            <th className="py-3 pr-4">API</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Email</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-t border-line">
              <td className="py-3 pr-4">{supplier.name}</td>
              <td className="py-3 pr-4">{supplier.apiType}</td>
              <td className="py-3 pr-4">{supplier.status}</td>
              <td className="py-3 pr-4">{supplier.contactEmail ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
