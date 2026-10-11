import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { analyticsRange, readOnlyStore, shiftDay, todayKey } from "@/lib/admin/store";

function day(value: string | null, fallback: string) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : fallback;
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const url = new URL(request.url);
  const today = todayKey();
  const preset = url.searchParams.get("preset") || "week";
  let from = day(url.searchParams.get("from"), shiftDay(today, -6));
  let to = day(url.searchParams.get("to"), today);
  if (preset === "today") { from = today; to = today; }
  if (preset === "yesterday") { from = shiftDay(today, -1); to = from; }
  if (preset === "week") { from = shiftDay(today, -6); to = today; }
  if (preset === "month") { from = shiftDay(today, -29); to = today; }
  if (preset === "quarter") { from = shiftDay(today, -89); to = today; }
  if (preset === "year") { from = shiftDay(today, -364); to = today; }
  if (from > to) [from, to] = [to, from];
  const store = await readOnlyStore();
  return NextResponse.json({ ok: true, preset, ...analyticsRange(store, from, to) });
}
