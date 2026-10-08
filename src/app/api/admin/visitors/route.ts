import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { analyticsSummary, readOnlyStore } from "@/lib/admin/store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const store = await readOnlyStore();
  return NextResponse.json({
    ok: true,
    stats: analyticsSummary(store),
    sessions: store.sessions.slice(0, 40),
  });
}
