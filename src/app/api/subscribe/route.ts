import { NextResponse } from "next/server";
import { withStore } from "@/lib/admin/store";

function emailOf(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function noteOf(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 500) : "";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: unknown; note?: unknown } | null;
  const email = emailOf(body?.email);
  const note = noteOf(body?.note);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Укажите корректный e-mail" }, { status: 400 });
  }

  const result = await withStore(store => {
    const existing = store.subscribers.find(item => item.email === email);
    if (existing) {
      if (note && !existing.note) existing.note = note;
      return { already: true, id: existing.id };
    }
    const item = {
      id: `SUB-${Date.now().toString().slice(-8)}`,
      email,
      note,
      createdAt: new Date().toISOString(),
      unread: true,
    };
    store.subscribers.unshift(item);
    return { already: false, id: item.id };
  });

  return NextResponse.json({ ok: true, ...result });
}
