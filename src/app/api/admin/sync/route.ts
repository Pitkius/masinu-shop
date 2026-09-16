import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listSupplierAdapters } from "@/lib/suppliers/adapter";
import { suggestCanonical } from "@/lib/suppliers/normalize";
import { allProducts } from "@/lib/catalog";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin";

export async function POST() {
  const jar = await cookies();
  if (!(await verifyAdminToken(jar.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adapters = listSupplierAdapters();
  const catalog = allProducts().map((p) => ({ id: p.id, title: p.title }));
  const results = [];
  for (const adapter of adapters) {
    const items = await adapter.getProducts();
    results.push({
      supplierId: adapter.id,
      count: items.length,
      suggestions: items.slice(0, 8).map((item) => ({
        supplierSku: item.supplierSku,
        supplierTitle: item.title,
        matches: suggestCanonical(item.title, catalog),
      })),
    });
  }
  return NextResponse.json({ syncedAt: new Date().toISOString(), results });
}
