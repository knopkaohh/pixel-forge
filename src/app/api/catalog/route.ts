import { NextResponse } from "next/server";
import { readOnlyStore } from "@/lib/admin/store";
import { emptyCatalog } from "@/lib/catalog-records";

export async function GET() {
  const store = await readOnlyStore();
  const catalog = store.catalog ?? emptyCatalog();
  return NextResponse.json({ ok: true, ...catalog });
}
