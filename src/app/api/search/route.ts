import { NextRequest, NextResponse } from "next/server";
import { searchCatalog } from "@/lib/search";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const result = searchCatalog(q);
  return NextResponse.json(result);
}
