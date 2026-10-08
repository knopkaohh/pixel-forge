"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ADMIN_DISPLAY_NAME, LEAD_STATUSES, ORDER_STATUSES, kindLabel, type InboxItem } from "@/lib/admin/types";

type View = "overview" | "orders" | "leads" | "catalog" | "visitors";
type Stats = {
  todayVisitors: number;
  weekVisitors: number;
  todayPageviews: number;
  weekPageviews: number;
  todayDepth: number;
  weekDepth: number;
  todaySessions: number;
  weekSessions: number;
  topPages: { path: string; views: number }[];
  unreadOrders: number;
  todayOrders: number;
  openOrders: number;
  inboxTotal: number;
};
type CatalogRow = { id: string; name: string; category: string; price: number; comingSoon: boolean; payUrl: string };
type SessionRow = { id: string; visitorId: string; startedAt: string; lastAt: string; referrer: string; pages: string[] };

const views: [View, string][] = [
  ["overview", "Обзор"],
  ["orders", "Заказы"],
  ["leads", "Заявки"],
  ["catalog", "Каталог"],
  ["visitors", "Посетители"],
];

function money(value?: number) {
  return typeof value === "number" ? `${value.toLocaleString("ru-RU")} ₽` : "—";
}

function when(value: string) {
  return new Date(value).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function statusClass(status: string) {
  if (["Новый", "Новая"].includes(status)) return "hot";
  if (["Ожидает оплату", "В обработке", "В работе"].includes(status)) return "warn";
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
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [filter, setFilter] = useState("all");

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
    if (view === "visitors") api("/api/admin/visitors").then(data => { setStats(data.stats); setSessions(data.sessions); }).catch(() => null);
  }, [authed, view]);

  const orders = useMemo(() => inbox.filter(item => item.kind === "order"), [inbox]);
  const leads = useMemo(() => inbox.filter(item => item.kind !== "order"), [inbox]);
  const unread = stats?.unreadOrders ?? orders.filter(item => item.unread).length;
  const visible = (view === "orders" ? orders : leads).filter(item => filter === "all" || (filter === "unread" ? item.unread : item.status === filter));

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
              <article><small>Посетители сегодня</small><strong>{stats?.todayVisitors ?? 0}</strong><p>{stats?.todaySessions ?? 0} сессий</p></article>
              <article><small>Глубина просмотра</small><strong>{stats?.todayDepth ?? 0}</strong><p>страниц за сессию · за неделю {stats?.weekDepth ?? 0}</p></article>
              <article><small>Заказы сегодня</small><strong>{stats?.todayOrders ?? 0}</strong><p>открытых: {stats?.openOrders ?? 0}</p></article>
              <article><small>За 7 дней</small><strong>{stats?.weekVisitors ?? 0}</strong><p>{stats?.weekPageviews ?? 0} просмотров</p></article>
            </div>
            <div className="admin-panel">
              <h3 style={{ font: "22px Playfair Display, serif", margin: "0 0 12px" }}>Последние обращения</h3>
              <InboxTable items={recent} onOpen={item => { setView(item.kind === "order" ? "orders" : "leads"); openItem(item); }} />
            </div>
          </>
        )}

        {(view === "orders" || view === "leads") && (
          <>
            <header>
              <div>
                <h1>{view === "orders" ? "Заказы" : "Заявки"}</h1>
                <p>{view === "orders" ? "Статусы, правка данных и удаление. Новые заказы подсвечены сиреной." : "Сообщения с контактов и заявки с калькулятора."}</p>
              </div>
            </header>
            <div className="admin-toolbar">
              <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Все</button>
              <button className={filter === "unread" ? "active" : ""} onClick={() => setFilter("unread")}>Новые</button>
              {(view === "orders" ? ORDER_STATUSES : LEAD_STATUSES).map(status => (
                <button key={status} className={filter === status ? "active" : ""} onClick={() => setFilter(status)}>{status}</button>
              ))}
            </div>
            <div className="admin-panel">
              <InboxTable items={visible} onOpen={openItem} />
              {selected && (view === "orders" ? selected.kind === "order" : selected.kind !== "order") && (
                <ItemEditor item={selected} onChange={setSelected} onSave={saveItem} onDelete={removeItem} />
              )}
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
                <p>Сколько людей заходило, сколько страниц смотрели и какие разделы открывали чаще.</p>
              </div>
            </header>
            <div className="admin-cards">
              <article><small>Сегодня</small><strong>{stats?.todayVisitors ?? 0}</strong><p>{stats?.todayPageviews ?? 0} просмотров</p></article>
              <article><small>Глубина сегодня</small><strong>{stats?.todayDepth ?? 0}</strong><p>уникальных страниц в сессии</p></article>
              <article><small>Неделя</small><strong>{stats?.weekVisitors ?? 0}</strong><p>{stats?.weekSessions ?? 0} сессий</p></article>
              <article><small>Глубина за неделю</small><strong>{stats?.weekDepth ?? 0}</strong><p>{stats?.weekPageviews ?? 0} просмотров</p></article>
            </div>
            <div className="admin-drawer">
              <section>
                <h3>Популярные страницы</h3>
                <ul className="admin-list">
                  {(stats?.topPages || []).map(page => <li key={page.path}>{page.path} — {page.views}</li>)}
                  {!stats?.topPages?.length && <p className="admin-empty">Пока мало данных — походите по сайту, цифры появятся.</p>}
                </ul>
              </section>
              <section>
                <h3>Последние сессии</h3>
                <ul className="admin-list">
                  {sessions.map(session => (
                    <li key={session.id}>{when(session.startedAt)} · {session.pages.length} стр. · {session.pages[session.pages.length - 1]}</li>
                  ))}
                </ul>
              </section>
            </div>
          </>
        )}
      </main>
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
  const statuses = item.kind === "order" ? ORDER_STATUSES : LEAD_STATUSES;
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
        <label>Телефон<input value={item.customer.phone} onChange={event => onChange({ ...item, customer: { ...item.customer, phone: event.target.value } })} /></label>
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
