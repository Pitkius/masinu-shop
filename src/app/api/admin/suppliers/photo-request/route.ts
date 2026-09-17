import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin";
import { allProducts } from "@/lib/catalog";
import { filterPhotoRequestProducts, supplierPhotoRequestCsv } from "@/lib/suppliers/photo-request";

export async function GET(request: Request) {
  const jar = await cookies();
  if (!(await verifyAdminToken(jar.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const supplier = url.searchParams.get("supplier");
  const brand = url.searchParams.get("brand");
  const rows = filterPhotoRequestProducts(allProducts(), supplier, brand);
  const slug = [supplier, brand].filter(Boolean).join("-") || "all";
  const csv = supplierPhotoRequestCsv(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="apex-photo-request-${slug}.csv"`,
    },
  });
}
