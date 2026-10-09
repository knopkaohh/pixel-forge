"use client";

import { useCallback, useEffect, useState } from "react";
import { ADMIN_DISPLAY_NAME, ORDER_STATUSES, kindLabel, type InboxItem } from "@/lib/admin/types";
import { PhoneInput } from "@/components/phone-input";

type View = "overview" | "orders" | "catalog" | "visitors" | "mailings";
type Stats = {
  todayVisitors: number;
  todayNewVisitors: number;
  weekVisitors: number;
  weekNewVisitors: number;
  todayGeo: { label: string; count: number }[];
  unreadOrders: number;
  unreadSubscribers: number;
  todayOrders: number;
  openOrders: number;
  inboxTotal: number;
};
type Subscriber = { id: string; email: string; note: string; createdAt: string; unread: boolean };
type CatalogRow = { id: string; name: string; category: string; price: number; comingSoon: boolean; payUrl: string };
type VisitorReport = {
  from: string;
  to: string;
  visitors: number;
  newVisitors: number;
  chart: { date: string; visitors: number }[];
  geo: { label: string; country: string; city: string; count: number }[];
};
type Period = "today" | "yesterday" | "week" | "month" | "quarter" | "year" | "custom";

const views: [View, string][] = [
  ["overview", "Обзор"],
  ["orders", "Заказы"],
  ["catalog", "Каталог"],
  ["visitors", "Посетители"],
  ["mailings", "Рассылки"],
];

const periods: [Period, string][] = [
  ["today", "Сегодня"],
  ["yesterday", "Вчера"],
  ["week", "Неделя"],
  ["month", "Месяц"],
  ["quarter", "Квартал"],
  ["year", "Год"],
  ["custom", "Свой период"],
];

function money(value?: number) {
  return typeof value === "number" ? `${value.toLocaleString("ru-RU")} ₽` : "—";
}

function when(value: string) {
  return new Date(value).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function statusClass(status: string) {
  if (status === "Новый") return "hot";
  if (status === "В обработке") return "warn";
  return "";
}

async function api(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Ошибка запроса");
  return data;
}

export function AdminApp() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(ADMIN_DISPLAY_NAME);
  const [authed, setAuthed] = useState(false);
  const [login, setLogin] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState<View>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<InboxItem[]>([]);
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [selected, setSelected] = useState<InboxItem | null>(null);
  const [catalog, setCatalog] = useState<CatalogRow[]>([]);
  const [filter, setFilter] = useState("all");
  const [period, setPeriod] = useState<Period>("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [report, setReport] = useState<VisitorReport | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const refreshOverview = useCallback(async () => {
    const data = await api("/api/admin/overview");
    setUser(data.user || ADMIN_DISPLAY_NAME);
    setStats(data.stats);
    setRecent(data.recent);
  }, []);

  const refreshInbox = useCallback(async () => {
    const data = await api("/api/admin/inbox");
    setInbox(data.inbox);
    setSelected(current => current ? data.inbox.find((item: InboxItem) => item.id === current.id) || current : current);
  }, []);

  useEffect(() => {
    api("/api/admin/session").then(data => {
      setAuthed(true);
      setUser(data.name || ADMIN_DISPLAY_NAME);
    }).catch(() => setAuthed(false)).finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!authed) return;
    refreshOverview().catch(() => null);
    refreshInbox().catch(() => null);
    const timer = window.setInterval(() => {
      refreshOverview().catch(() => null);
      refreshInbox().catch(() => null);
    }, 15000);
    return () => window.clearInterval(timer);
  }, [authed, refreshInbox, refreshOverview]);

  useEffect(() => {
    if (!authed) return;
    if (view === "catalog") api("/api/admin/catalog").then(data => setCatalog(data.items)).catch(() => null);
    if (view === "mailings") {
      api("/api/admin/subscribers").then(async data => {
        setSubscribers(data.subscribers || []);
        if ((data.subscribers || []).some((item: Subscriber) => item.unread)) {
          await api("/api/admin/subscribers", { method: "PATCH", body: JSON.stringify({ allRead: true }) });
          setSubscribers((data.subscribers || []).map((item: Subscriber) => ({ ...item, unread: false })));
          refreshOverview().catch(() => null);
        }
      }).catch(() => null);
    }
  }, [authed, view, refreshOverview]);

  useEffect(() => {
    if (!authed || view !== "visitors") return;
    const params = new URLSearchParams({ preset: period });
    if (period === "custom" && customFrom && customTo) {
      params.set("from", customFrom);
      params.set("to", customTo);
    }
    if (period === "custom" && (!customFrom || !customTo)) return;
    api(`/api/admin/visitors?${params}`).then(data => setReport(data)).catch(() => null);
  }, [authed, view, period, customFrom, customTo]);

  const unread = stats?.unreadOrders ?? inbox.filter(item => item.unread).length;
  const visible = inbox.filter(item => filter === "all" || item.status === filter);

  async function submitLogin(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const data = await api("/api/admin/login", { method: "POST", body: JSON.stringify({ login, password }) });
      setUser(data.name || ADMIN_DISPLAY_NAME);
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось войти");
    }
  }

  async function openItem(item: InboxItem) {
    setSelected(item);
    if (item.unread) {
      await api(`/api/admin/inbox/${item.id}`, { method: "PATCH", body: JSON.stringify({ unread: false }) });
      await Promise.all([refreshInbox(), refreshOverview()]);
    }
  }

  async function saveItem(patch: Record<string, unknown>) {
    if (!selected) return;
    await api(`/api/admin/inbox/${selected.id}`, { method: "PATCH", body: JSON.stringify(patch) });
    await Promise.all([refreshInbox(), refreshOverview()]);
  }

  async function removeItem(id: string) {
    if (!confirm("Удалить заявку безвозвратно?")) return;
    await api(`/api/admin/inbox/${id}`, { method: "DELETE" });
    setSelected(null);
    await Promise.all([refreshInbox(), refreshOverview()]);
  }

  async function savePayUrl(id: string, payUrl: string) {
    await api("/api/admin/catalog", { method: "PATCH", body: JSON.stringify({ id, payUrl }) });
    setCatalog(current => current.map(item => item.id === id ? { ...item, payUrl } : item));
  }

  if (!ready) return <div className="admin-login"><p style={{ color: "#f5f0e6" }}>Открываем кабинет…</p></div>;

  if (!authed) {
    return (
      <div className="admin-login">
        <form onSubmit={submitLogin}>
          <div className="brand">Мэри Джут</div>
          <p>Кабинет владельца. После входа вы работаете как {ADMIN_DISPLAY_NAME}.</p>
          {error && <p className="error">{error}</p>}
          <label>Логин<input value={login} onChange={event => setLogin(event.target.value)} autoComplete="username" /></label>
          <label>Пароль<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" /></label>
          <button type="submit">Войти</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-app">
      <aside className="admin-side">
        <div className="admin-user">
          <small>Пользователь</small>
          <b>{user}</b>
          <span>Владелец сайта Мэри Джут</span>
        </div>
        <nav>
          {views.map(([id, label]) => (
            <button key={id} className={view === id ? "active" : ""} onClick={() => { setView(id); setSelected(null); setFilter("all"); }}>
              <span>{label}</span>
              {id === "orders" && unread > 0 && <i className="admin-siren">{unread}</i>}
              {id === "mailings" && (stats?.unreadSubscribers ?? 0) > 0 && <i className="admin-siren">{stats?.unreadSubscribers}</i>}
            </button>
          ))}
        </nav>
        <button className="logout" onClick={async () => { await api("/api/admin/logout", { method: "POST" }); setAuthed(false); }}>Выйти</button>
      </aside>
      <main className="admin-main">
        {view === "overview" && (
          <>
            <header>
              <div>
                <h1>Обзор</h1>
                <p>Здравствуйте, {user}. Здесь новые заказы, заявки и посещаемость сайта.</p>
              </div>
            </header>
            {unread > 0 && (
              <div className="admin-alert">
                <div>
                  <b>Сирена: {unread} {unread === 1 ? "новый заказ" : "новых заказа"}</b>
                  <span>Откройте раздел «Заказы», поставьте статус и отметьте, что взяли в работу.</span>
                </div>
                <i>!</i>
              </div>
            )}
            <div className="admin-cards">
              <article><small>Посетители сегодня</small><strong>{stats?.todayVisitors ?? 0}</strong><p>новых: {stats?.todayNewVisitors ?? 0}</p></article>
              <article><small>Новые за неделю</small><strong>{stats?.weekNewVisitors ?? 0}</strong><p>всего за неделю: {stats?.weekVisitors ?? 0}</p></article>
              <article><small>Заказы сегодня</small><strong>{stats?.todayOrders ?? 0}</strong><p>открытых: {stats?.openOrders ?? 0}</p></article>
              <article><small>География сегодня</small><strong>{stats?.todayGeo?.length ?? 0}</strong><p>{stats?.todayGeo?.[0]?.label || "Пока нет данных"}</p></article>
            </div>
            <div className="admin-panel">
              <h3 style={{ font: "22px Playfair Display, serif", margin: "0 0 12px" }}>Последние обращения</h3>
              <InboxTable items={recent} onOpen={item => { setView("orders"); openItem(item); }} />
            </div>
          </>
        )}

        {view === "orders" && (
          <>
            <header>
              <div>
                <h1>Заказы</h1>
                <p>Статус можно поставить: новый, в обработке, отправлен, доставлен.</p>
              </div>
            </header>
            <div className="admin-toolbar">
              <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Все</button>
              {ORDER_STATUSES.map(status => (
                <button key={status} className={filter === status ? "active" : ""} onClick={() => setFilter(status)}>{status}</button>
              ))}
            </div>
            <div className="admin-panel">
              <InboxTable items={visible} onOpen={openItem} />
              {selected && <ItemEditor item={selected} onChange={setSelected} onSave={saveItem} onDelete={removeItem} />}
            </div>
          </>
        )}

        {view === "catalog" && (
          <>
            <header>
              <div>
                <h1>Каталог и Ozon</h1>
                <p>Сюда вставляйте ссылки эквайринга. После сохранения они появятся под позициями на оплате заказа.</p>
              </div>
            </header>
            <div className="admin-panel">
              <table className="admin-table">
                <thead><tr><th>Товар</th><th>Цена</th><th>Ссылка Ozon</th></tr></thead>
                <tbody>
                  {catalog.map(item => (
                    <tr key={item.id}>
                      <td><b>{item.name}</b><div style={{ color: "#7d7469", fontSize: 11 }}>{item.category}{item.comingSoon ? " · скоро" : ""}</div></td>
                      <td>{item.price ? money(item.price) : "—"}</td>
                      <td>
                        <input
                          defaultValue={item.payUrl}
                          placeholder="https://…"
                          onBlur={event => {
                            if (event.target.value.trim() !== item.payUrl) savePayUrl(item.id, event.target.value.trim());
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {view === "visitors" && (
          <>
            <header>
              <div>
                <h1>Посетители</h1>
                <p>Количество людей, новые визиты и откуда заходили. График можно смотреть за любой период.</p>
              </div>
            </header>
            <div className="admin-toolbar">
              {periods.map(([id, label]) => (
                <button key={id} className={period === id ? "active" : ""} onClick={() => {
                  setPeriod(id);
                  if (id === "custom" && !customFrom && !customTo) {
                    const to = new Date().toLocaleDateString("sv-SE");
                    const from = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString("sv-SE");
                    setCustomFrom(from);
                    setCustomTo(to);
                  }
                }}>{label}</button>
              ))}
              {period === "custom" && (
                <span className="admin-dates">
                  <input type="date" value={customFrom} onChange={event => setCustomFrom(event.target.value)} />
                  <input type="date" value={customTo} onChange={event => setCustomTo(event.target.value)} />
                </span>
              )}
            </div>
            <div className="admin-cards three">
              <article><small>Посетители</small><strong>{report?.visitors ?? 0}</strong><p>{report?.from} — {report?.to}</p></article>
              <article><small>Новые посетители</small><strong>{report?.newVisitors ?? 0}</strong><p>впервые за выбранный период</p></article>
              <article><small>География</small><strong>{report?.geo?.length ?? 0}</strong><p>{report?.geo?.[0]?.label || "Пока нет точек"}</p></article>
            </div>
            <VisitorChart points={report?.chart || []} />
            <div className="admin-panel">
              <h3 style={{ font: "22px Playfair Display, serif", margin: "0 0 12px" }}>Откуда заходили</h3>
              {report?.geo?.length ? (
                <ul className="admin-geo">
                  {report.geo.map(place => <li key={place.label}><span>{place.label}</span><b>{place.count}</b></li>)}
                </ul>
              ) : <p className="admin-empty">География появится после визитов с сайта. Локальные заходы считаются отдельно.</p>}
            </div>
          </>
        )}

        {view === "mailings" && (
          <>
            <header>
              <div>
                <h1>Рассылки</h1>
                <p>E-mail и пожелания с формы подписки в подвале сайта.</p>
              </div>
            </header>
            <div className="admin-panel">
              {subscribers.length === 0 ? (
                <p className="admin-empty">Пока никто не подписался.</p>
              ) : (
                <table className="admin-table">
                  <thead><tr><th>Когда</th><th>E-mail</th><th>Пожелание</th><th></th></tr></thead>
                  <tbody>
                    {subscribers.map(item => (
                      <tr key={item.id} className={item.unread ? "unread" : ""}>
                        <td>{when(item.createdAt)}</td>
                        <td><b>{item.email}</b></td>
                        <td>{item.note || "—"}</td>
                        <td>
                          <div className="admin-actions">
                            <button
                              className="danger"
                              onClick={async () => {
                                if (!confirm("Удалить адрес из рассылки?")) return;
                                await api(`/api/admin/subscribers?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
                                setSubscribers(current => current.filter(entry => entry.id !== item.id));
                              }}
                            >Удалить</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function chartLabel(date: string, index: number, total: number) {
  const hourly = /^\d{2}:\d{2}$/.test(date);
  if (hourly) return index % 4 === 0 ? date : "";
  const day = date.length > 5 ? date.slice(5) : date;
  if (total <= 14) return day;
  return index === 0 || index === total - 1 || index % Math.ceil(total / 6) === 0 ? day : "";
}

function VisitorChart({ points }: { points: { date: string; visitors: number }[] }) {
  const max = Math.max(1, ...points.map(point => point.visitors));
  return (
    <div className="admin-chart">
      <h3>Посетители по периоду</h3>
      {points.length === 0 || points.every(point => point.visitors === 0) ? (
        <div className="admin-chart-empty">За этот период визитов ещё нет</div>
      ) : (
        <div className="admin-chart-plot">
          {points.map((point, index) => {
            const height = point.visitors === 0 ? 0 : Math.max(6, Math.round((point.visitors / max) * 100));
            return (
              <div className="admin-chart-col" key={`${point.date}-${index}`} title={`${point.date}: ${point.visitors}`}>
                <i style={{ height: `${height}%` }} />
                <span>{chartLabel(point.date, index, points.length)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InboxTable({ items, onOpen }: { items: InboxItem[]; onOpen: (item: InboxItem) => void }) {
  if (!items.length) return <p className="admin-empty">Пока пусто.</p>;
  return (
    <table className="admin-table">
      <thead><tr><th>Когда</th><th>Тип</th><th>Кто</th><th>Статус</th><th>Сумма</th></tr></thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id} className={item.unread ? "unread" : ""} onClick={() => onOpen(item)}>
            <td>{when(item.createdAt)}</td>
            <td>{kindLabel(item.kind)}<div style={{ color: "#7d7469", fontSize: 11 }}>{item.title}</div></td>
            <td><b>{item.customer.name || "Без имени"}</b><div>{item.customer.phone}</div></td>
            <td><span className={`admin-status ${statusClass(item.status)}`}>{item.status}</span></td>
            <td>{money(item.total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ItemEditor({ item, onChange, onSave, onDelete }: {
  item: InboxItem;
  onChange: (item: InboxItem) => void;
  onSave: (patch: Record<string, unknown>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const statuses = ORDER_STATUSES;
  const items = Array.isArray(item.payload.items) ? item.payload.items as { name?: string; quantity?: number; price?: number }[] : [];
  const calculation = item.payload.calculation && typeof item.payload.calculation === "object" ? item.payload.calculation as Record<string, unknown> : null;
  return (
    <div className="admin-drawer">
      <section>
        <h3>{item.title}</h3>
        <label>Статус
          <select value={item.status} onChange={event => onChange({ ...item, status: event.target.value })}>
            {statuses.map(status => <option key={status}>{status}</option>)}
          </select>
        </label>
        <label>Имя<input value={item.customer.name} onChange={event => onChange({ ...item, customer: { ...item.customer, name: event.target.value } })} /></label>
        <label>Телефон<PhoneInput value={item.customer.phone} onValueChange={phone => onChange({ ...item, customer: { ...item.customer, phone } })} /></label>
        <label>E-mail<input value={item.customer.email} onChange={event => onChange({ ...item, customer: { ...item.customer, email: event.target.value } })} /></label>
        <label>Комментарий клиента<textarea value={item.comment} onChange={event => onChange({ ...item, comment: event.target.value })} /></label>
        <label>Заметка для себя<textarea value={item.notes} onChange={event => onChange({ ...item, notes: event.target.value })} /></label>
        <div className="admin-actions">
          <button onClick={() => onSave({ status: item.status, notes: item.notes, comment: item.comment, unread: false, customer: item.customer })}>Сохранить</button>
          <button className="ghost" onClick={() => onSave({ unread: true })}>Вернуть в новые</button>
          <button className="danger" onClick={() => onDelete(item.id)}>Удалить</button>
        </div>
      </section>
      <section>
        <h3>Подробности</h3>
        {item.kind === "order" && (
          <ul className="admin-list">
            {items.map((row, index) => <li key={index}>{row.name} × {row.quantity} — {money(row.price)}</li>)}
            <li>Доставка: {String((item.payload.customer as { delivery?: string } | undefined)?.delivery || "—")}</li>
            <li>Пункт: {String((item.payload.customer as { pickupPoint?: string } | undefined)?.pickupPoint || "—")}</li>
            <li>Итого: {money(item.total)}</li>
          </ul>
        )}
        {item.kind === "calculator" && calculation && (
          <ul className="admin-list">
            {Object.entries(calculation).map(([key, value]) => <li key={key}>{key}: {String(value)}</li>)}
          </ul>
        )}
        {item.kind === "contact" && <p>{item.comment || "Без текста"}</p>}
      </section>
    </div>
  );
}
