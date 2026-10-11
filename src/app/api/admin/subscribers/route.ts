import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { readOnlyStore, withStore } from "@/lib/admin/store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const store = await readOnlyStore();
  return NextResponse.json({ ok: true, subscribers: store.subscribers });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await request.json().catch(() => null) as { allRead?: boolean; id?: string; unread?: boolean } | null;
  await withStore(store => {
    if (body?.allRead) {
      for (const item of store.subscribers) item.unread = false;
      return;
    }
    const current = store.subscribers.find(item => item.id === body?.id);
    if (current && typeof body?.unread === "boolean") current.unread = body.unread;
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "Не указана запись" }, { status: 400 });
  await withStore(store => {
    store.subscribers = store.subscribers.filter(item => item.id !== id);
  });
  return NextResponse.json({ ok: true });
}
