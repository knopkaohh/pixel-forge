import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { withStore } from "@/lib/admin/store";
import { ORDER_STATUSES } from "@/lib/admin/types";

type Patch = {
  status?: string;
  notes?: string;
  comment?: string;
  unread?: boolean;
  customer?: { name?: string; phone?: string; email?: string };
};

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json().catch(() => null) as Patch | null;
  if (!body) return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });

  const item = await withStore(store => {
    const current = store.inbox.find(entry => entry.id === id);
    if (!current) return null;
    if (typeof body.status === "string" && (ORDER_STATUSES as readonly string[]).includes(body.status)) current.status = body.status;
    if (typeof body.notes === "string") current.notes = body.notes;
    if (typeof body.comment === "string") current.comment = body.comment;
    if (typeof body.unread === "boolean") current.unread = body.unread;
    if (body.customer) {
      if (typeof body.customer.name === "string") current.customer.name = body.customer.name;
      if (typeof body.customer.phone === "string") current.customer.phone = body.customer.phone;
      if (typeof body.customer.email === "string") current.customer.email = body.customer.email;
    }
    current.updatedAt = new Date().toISOString();
    return current;
  });

  if (!item) return NextResponse.json({ ok: false, error: "Заявка не найдена" }, { status: 404 });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await context.params;
  const removed = await withStore(store => {
    const exists = store.inbox.some(entry => entry.id === id);
    store.inbox = store.inbox.filter(entry => entry.id !== id);
    return exists;
  });
  if (!removed) return NextResponse.json({ ok: false, error: "Заявка не найдена" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
