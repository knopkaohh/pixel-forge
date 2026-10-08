import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { readOnlyStore, withStore } from "@/lib/admin/store";
import { ozonPayUrls } from "@/lib/payments";
import { comingSoonItems, products } from "@/lib/products";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const store = await readOnlyStore();
  const items = [...products, ...comingSoonItems].map(product => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    comingSoon: Boolean(product.comingSoon),
    payUrl: store.payUrls[product.id] || ozonPayUrls[product.id] || "",
  }));
  return NextResponse.json({ ok: true, items });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const payUrl = typeof body?.payUrl === "string" ? body.payUrl.trim() : "";
  if (!id) return NextResponse.json({ ok: false, error: "Нет товара" }, { status: 400 });
  await withStore(store => {
    if (payUrl) store.payUrls[id] = payUrl;
    else delete store.payUrls[id];
  });
  return NextResponse.json({ ok: true, id, payUrl });
}
