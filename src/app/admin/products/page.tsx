import Link from "next/link";
import { products } from "@/data/products";
import { formatMoney } from "@/lib/money";

export default function AdminProducts() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl">Products</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="py-3">Title</th>
              <th>SKU / MPN</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-line">
                <td className="py-3">
                  <Link href={`/admin/products/${product.id}`} className="hover:text-accent">{product.title}</Link>
                  <p className="text-xs text-muted">{product.brand}</p>
                </td>
                <td>{product.sku}<br /><span className="text-muted">{product.mpn}</span></td>
                <td>{formatMoney(product.price)}</td>
                <td>{product.stock}</td>
                <td>{product.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
