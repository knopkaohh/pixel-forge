import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { analyticsSummary, readOnlyStore } from "@/lib/admin/store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const store = await readOnlyStore();
  const recent = [...store.inbox].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);
  return NextResponse.json({
    ok: true,
    user: session.name,
    stats: analyticsSummary(store),
    recent,
  });
}
