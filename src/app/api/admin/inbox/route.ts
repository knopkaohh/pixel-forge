import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { readOnlyStore } from "@/lib/admin/store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const store = await readOnlyStore();
  const inbox = [...store.inbox].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ ok: true, inbox });
}
