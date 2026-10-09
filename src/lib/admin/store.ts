import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { normalizeOrderStatus, type AdminStore, type AnalyticsSession, type InboxItem, type Subscriber } from "@/lib/admin/types";

const FILE = path.join(process.cwd(), "data", "admin-store.json");

const emptyStore = (): AdminStore => ({
  inbox: [],
  payUrls: {},
  sessions: [],
  visitors: {},
  geoCache: {},
  subscribers: [],
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
      inbox: Array.isArray(parsed.inbox)
        ? parsed.inbox.map(item => ({ ...item, status: normalizeOrderStatus(item.status) }))
        : [],
      payUrls: parsed.payUrls && typeof parsed.payUrls === "object" ? parsed.payUrls : {},
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      visitors: parsed.visitors && typeof parsed.visitors === "object" ? parsed.visitors : {},
      geoCache: parsed.geoCache && typeof parsed.geoCache === "object" ? parsed.geoCache : {},
      subscribers: Array.isArray(parsed.subscribers) ? parsed.subscribers as Subscriber[] : [],
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
  const cutoff = Date.now() - 400 * 24 * 60 * 60 * 1000;
  store.sessions = store.sessions.filter(session => new Date(session.lastAt).getTime() >= cutoff).slice(0, 2000);
  for (const day of Object.keys(store.visitors)) {
    if (new Date(`${day}T00:00:00.000Z`).getTime() < cutoff) delete store.visitors[day];
  }
}

export function shiftDay(day: string, amount: number) {
  const date = new Date(`${day}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string) {
  const days: string[] = [];
  let cursor = from;
  while (cursor <= to) {
    days.push(cursor);
    cursor = shiftDay(cursor, 1);
    if (days.length > 400) break;
  }
  return days;
}

export function firstSeenMap(visitors: Record<string, string[]>) {
  const map = new Map<string, string>();
  for (const day of Object.keys(visitors).sort()) {
    for (const id of visitors[day] || []) {
      if (!map.has(id)) map.set(id, day);
    }
  }
  return map;
}

export function trackVisit(store: AdminStore, input: {
  visitorId: string;
  sessionId: string;
  path: string;
  referrer: string;
  country?: string;
  city?: string;
  ip?: string;
}) {
  const now = new Date().toISOString();
  const day = todayKey();
  const visitors = store.visitors[day] ?? [];
  if (!visitors.includes(input.visitorId)) visitors.push(input.visitorId);
  store.visitors[day] = visitors;
  if (!store.geoCache) store.geoCache = {};
  if (input.ip && input.country) store.geoCache[input.ip] = { country: input.country, city: input.city || "" };

  let session: AnalyticsSession | undefined = store.sessions.find(item => item.id === input.sessionId);
  if (!session) {
    session = {
      id: input.sessionId,
      visitorId: input.visitorId,
      startedAt: now,
      lastAt: now,
      referrer: input.referrer || "",
      pages: [input.path],
      hits: [now],
      country: input.country,
      city: input.city,
    };
    store.sessions.unshift(session);
  } else {
    session.lastAt = now;
    session.pages.push(input.path);
    session.hits = [...(session.hits || []), now].slice(-80);
    if (input.country && !session.country) session.country = input.country;
    if (input.city && !session.city) session.city = input.city;
    if (session.pages.length > 40) session.pages = session.pages.slice(-40);
  }
  pruneAnalytics(store);
}

export function analyticsRange(store: AdminStore, from: string, to: string) {
  const days = daysBetween(from, to);
  const firstSeen = firstSeenMap(store.visitors);
  const visitorIds = new Set(days.flatMap(day => store.visitors[day] || []));
  const newVisitorIds = [...visitorIds].filter(id => {
    const seen = firstSeen.get(id);
    return seen ? seen >= from && seen <= to : false;
  });
  const chart = days.map(date => ({ date, visitors: (store.visitors[date] || []).length }));
  const geoMap = new Map<string, { country: string; city: string; visitors: Set<string> }>();
  for (const session of store.sessions) {
    const day = session.startedAt.slice(0, 10);
    if (day < from || day > to || !session.country) continue;
    const country = session.country;
    const city = session.city || "";
    const key = `${country}|${city}`;
    const current = geoMap.get(key) || { country, city, visitors: new Set<string>() };
    current.visitors.add(session.visitorId);
    geoMap.set(key, current);
  }
  const geo = [...geoMap.values()]
    .map(item => ({ country: item.country, city: item.city, label: item.city ? `${item.country}, ${item.city}` : item.country, count: item.visitors.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const inRangeSessions = store.sessions.filter(session => {
    const day = session.startedAt.slice(0, 10);
    return day >= from && day <= to;
  });
  const hourly = from === to
    ? Array.from({ length: 24 }, (_, hour) => {
      const ids = new Set<string>();
      for (const session of inRangeSessions) {
        const stamps = session.hits?.length ? session.hits : [session.startedAt];
        if (stamps.some(stamp => {
          const local = new Date(stamp).toLocaleString("sv-SE", { timeZone: "Europe/Moscow" });
          return local.slice(0, 10) === from && Number(local.slice(11, 13)) === hour;
        })) ids.add(session.visitorId);
      }
      return { date: `${String(hour).padStart(2, "0")}:00`, visitors: ids.size };
    })
    : chart;

  return {
    from,
    to,
    visitors: visitorIds.size,
    newVisitors: newVisitorIds.length,
    chart: from === to ? hourly : chart,
    geo,
    sessions: inRangeSessions.slice(0, 40),
  };
}

export function analyticsSummary(store: AdminStore) {
  const today = todayKey();
  const weekFrom = shiftDay(today, -6);
  const week = analyticsRange(store, weekFrom, today);
  const todayRange = analyticsRange(store, today, today);
  const unreadOrders = store.inbox.filter(item => item.unread).length;
  const todayOrders = store.inbox.filter(item => item.createdAt.slice(0, 10) === today).length;
  const openOrders = store.inbox.filter(item => item.status !== "Доставлен").length;

  return {
    todayVisitors: todayRange.visitors,
    todayNewVisitors: todayRange.newVisitors,
    weekVisitors: week.visitors,
    weekNewVisitors: week.newVisitors,
    todayGeo: todayRange.geo,
    unreadOrders,
    unreadSubscribers: store.subscribers.filter(item => item.unread).length,
    todayOrders,
    openOrders,
    inboxTotal: store.inbox.length,
  };
}
