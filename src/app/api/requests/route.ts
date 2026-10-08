import { NextRequest, NextResponse } from "next/server";
import { inboxFromPayload } from "@/lib/admin/inbox";
import { withStore } from "@/lib/admin/store";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    if (!payload || typeof payload !== "object" || !payload.type) {
      return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
    }

    const item = inboxFromPayload(payload);
    if (item) {
      await withStore(store => {
        store.inbox.unshift(item);
      });
    }

    const webhook = process.env.REQUEST_WEBHOOK_URL;
    if (webhook) {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "mary-jute-site", createdAt: new Date().toISOString(), ...payload }),
      });
      if (!response.ok) {
        return NextResponse.json({ ok: false, error: "Webhook rejected request" }, { status: 502 });
      }
    }

    return NextResponse.json({ ok: true, forwarded: Boolean(webhook), id: item?.id });
  } catch {
    return NextResponse.json({ ok: false, error: "Не удалось обработать запрос" }, { status: 400 });
  }
}
