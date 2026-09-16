import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin";
import { getCatalog } from "@/lib/catalog";
import { z } from "zod";
import { vehicles, matchesSelection } from "@/data/vehicles";

const schema = z.object({
  productId: z.string(),
  make: z.string(),
  model: z.string(),
  generation: z.string(),
  yearFrom: z.number().optional(),
  yearTo: z.number().optional(),
  engine: z.string().optional(),
  drive: z.string().optional(),
  fitmentType: z.enum(["EXACT", "COMPATIBLE", "MODIFICATION_REQUIRED"]),
});

export async function POST(request: NextRequest) {
  const jar = await cookies();
  if (!(await verifyAdminToken(jar.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const product = getCatalog().getProduct(parsed.data.productId);
  if (!product) return NextResponse.json({ error: "Unknown product" }, { status: 404 });
  const matched = vehicles.filter((vehicle) =>
    matchesSelection(vehicle, {
      make: parsed.data.make,
      model: parsed.data.model,
      generation: parsed.data.generation,
      engine: parsed.data.engine,
      drive: parsed.data.drive as never,
    }),
  ).filter((vehicle) => {
    if (parsed.data.yearFrom && vehicle.yearTo < parsed.data.yearFrom) return false;
    if (parsed.data.yearTo && vehicle.yearFrom > parsed.data.yearTo) return false;
    return true;
  });
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      saved: false,
      reason: "DATABASE_URL is not configured. Fitment payload was validated.",
      matchedVehicleIds: matched.map((v) => v.id),
    });
  }
  return NextResponse.json({ saved: false, reason: "Prisma persistence adapter is not wired yet.", matchedVehicleIds: matched.map((v) => v.id) });
}
