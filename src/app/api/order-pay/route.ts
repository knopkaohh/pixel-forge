import { NextResponse } from "next/server";
import { readOnlyStore } from "@/lib/admin/store";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  const store = await readOnlyStore();
  const item = store.inbox.find(entry => entry.id === id);
  if (!item) return NextResponse.json({ ok: true, payUrl: "" });
  return NextResponse.json({ ok: true, payUrl: item.payUrl || "" });
}
