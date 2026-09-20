import { NextResponse } from "next/server";
import { tryOnConfigured } from "@/lib/tryon";

export async function GET() {
  return NextResponse.json({ configured: tryOnConfigured() });
}
