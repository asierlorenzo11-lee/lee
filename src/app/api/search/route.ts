import { NextResponse } from "next/server";
import { searchGlobal } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const results = await searchGlobal(q);
  return NextResponse.json(results);
}
