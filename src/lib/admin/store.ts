import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { AdminStore, AnalyticsSession, InboxItem } from "@/lib/admin/types";

const FILE = path.join(process.cwd(), "data", "admin-store.json");

const emptyStore = (): AdminStore => ({
  inbox: [],
  payUrls: {},
  sessions: [],
  visitors: {},
});

let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(work: () => Promise<T>) {
  const run = queue.then(work, work);
  queue = run.then(() => undefined, () => undefined);
  return run;
}

async function readStore(): Promise<AdminStore> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<AdminStore>;
    return {
      inbox: Array.isArray(parsed.inbox) ? parsed.inbox : [],
      payUrls: parsed.payUrls && typeof parsed.payUrls === "object" ? parsed.payUrls : {},
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      visitors: parsed.visitors && typeof parsed.visitors === "object" ? parsed.visitors : {},
    };
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: AdminStore) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(store, null, 2));
}

export function withStore<T>(work: (store: AdminStore) => Promise<T> | T) {
  return enqueue(async () => {
    const store = await readStore();
    const result = await work(store);
    await writeStore(store);
    return result;
  });
}

export function readOnlyStore() {
  return enqueue(() => readStore());
}

export function newInboxId(kind: InboxItem["kind"]) {
  const prefix = kind === "order" ? "ORD" : kind === "calculator" ? "CALC" : "MSG";
  return `${prefix}-${Date.now().toString().slice(-8)}`;
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function pruneAnalytics(store: AdminStore) {
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
  store.sessions = store.sessions.filter(session => new Date(session.lastAt).getTime() >= cutoff).slice(0, 800);
  for (const day of Object.keys(store.visitors)) {
    if (new Date(`${day}T00:00:00.000Z`).getTime() < cutoff) delete store.visitors[day];
  }
}

export function trackVisit(store: AdminStore, input: { visitorId: string; sessionId: string; path: string; referrer: string }) {
  const now = new Date().toISOString();
  const day = todayKey();
  const visitors = store.visitors[day] ?? [];
  if (!visitors.includes(input.visitorId)) visitors.push(input.visitorId);
  store.visitors[day] = visitors;

  let session: AnalyticsSession | undefined = store.sessions.find(item => item.id === input.sessionId);
  if (!session) {
    session = {
      id: input.sessionId,
      visitorId: input.visitorId,
      startedAt: now,
      lastAt: now,
      referrer: input.referrer || "",
      pages: [input.path],
    };
    store.sessions.unshift(session);
  } else {
    session.lastAt = now;
    session.pages.push(input.path);
    if (session.pages.length > 40) session.pages = session.pages.slice(-40);
  }
  pruneAnalytics(store);
}

export function analyticsSummary(store: AdminStore) {
  const today = todayKey();
  const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekDays = Object.entries(store.visitors).filter(([day]) => new Date(`${day}T00:00:00.000Z`).getTime() >= weekStart);
  const weekVisitors = new Set(weekDays.flatMap(([, ids]) => ids));
  const todaySessions = store.sessions.filter(session => session.startedAt.slice(0, 10) === today);
  const weekSessions = store.sessions.filter(session => new Date(session.startedAt).getTime() >= weekStart);
  const depth = (sessions: AnalyticsSession[]) => {
    if (!sessions.length) return 0;
    return Math.round((sessions.reduce((sum, session) => sum + new Set(session.pages).size, 0) / sessions.length) * 10) / 10;
  };
  const pageCounts = new Map<string, number>();
  for (const session of weekSessions) {
    for (const page of session.pages) pageCounts.set(page, (pageCounts.get(page) || 0) + 1);
  }
  const topPages = [...pageCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([path, views]) => ({ path, views }));
  const unreadOrders = store.inbox.filter(item => item.kind === "order" && item.unread).length;
  const todayOrders = store.inbox.filter(item => item.kind === "order" && item.createdAt.slice(0, 10) === today).length;
  const openOrders = store.inbox.filter(item => item.kind === "order" && !["Доставлен", "Отменён"].includes(item.status)).length;

  return {
    todayVisitors: store.visitors[today]?.length ?? 0,
    weekVisitors: weekVisitors.size,
    todayPageviews: todaySessions.reduce((sum, session) => sum + session.pages.length, 0),
    weekPageviews: weekSessions.reduce((sum, session) => sum + session.pages.length, 0),
    todayDepth: depth(todaySessions),
    weekDepth: depth(weekSessions),
    todaySessions: todaySessions.length,
    weekSessions: weekSessions.length,
    topPages,
    unreadOrders,
    todayOrders,
    openOrders,
    inboxTotal: store.inbox.length,
  };
}
