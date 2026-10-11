import { NextResponse } from "next/server";
import { readOnlyStore } from "@/lib/admin/store";
import { ozonPayUrls } from "@/lib/payments";

export async function GET() {
  const store = await readOnlyStore();
  return NextResponse.json({ ...ozonPayUrls, ...store.payUrls });
}
