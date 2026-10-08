import { NextResponse } from "next/server";
import { trackVisit, withStore } from "@/lib/admin/store";

function id(value: unknown, fallback: string) {
  return typeof value === "string" && value.length >= 8 && value.length <= 80 ? value : fallback;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const path = typeof body?.path === "string" ? body.path.slice(0, 180) : "";
  if (!path || path.startsWith("/admin") || path.startsWith("/api")) {
    return NextResponse.json({ ok: true, skipped: true });
  }
  const visitorId = id(body?.visitorId, `v-${Date.now().toString(36)}`);
  const sessionId = id(body?.sessionId, `s-${Date.now().toString(36)}`);
  const referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 300) : "";
  await withStore(store => trackVisit(store, { visitorId, sessionId, path, referrer }));
  return NextResponse.json({ ok: true, visitorId, sessionId });
}
