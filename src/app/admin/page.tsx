import Link from "next/link";
import { products } from "@/data/products";
import { vehicles } from "@/data/vehicles";
import { categories } from "@/data/categories";
import { suppliers } from "@/data/suppliers";
import { reviews } from "@/data/reviews";
import { publicBuilds } from "@/data/builds";

const links = [
  ["Products", "/admin/products"],
  ["Orders", "/admin/orders"],
  ["Customers", "/admin/customers"],
  ["Vehicles", "/admin/vehicles"],
  ["Categories", "/admin/categories"],
  ["Suppliers", "/admin/suppliers"],
  ["Supplier products", "/admin/suppliers/products"],
  ["Fitment", "/admin/fitment"],
  ["Brands", "/admin/brands"],
  ["Builds", "/admin/builds"],
  ["Reviews", "/admin/reviews"],
  ["Coupons", "/admin/coupons"],
];

export default function AdminHome() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl">Dashboard</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Catalog is served from curated inventory. Connect DATABASE_URL to persist admin edits.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ["Products", products.length],
          ["Vehicles", vehicles.length],
          ["Categories", categories.length],
          ["Suppliers", suppliers.length],
          ["Reviews", reviews.length],
          ["Public builds", publicBuilds.length],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-3xl border border-line p-5">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 text-3xl">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-2 md:grid-cols-3">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="rounded-2xl border border-line px-4 py-3 hover:border-accent">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
