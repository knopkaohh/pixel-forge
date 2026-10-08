export const ORDER_STATUSES = [
  "Новый",
  "В обработке",
  "Отправлен",
  "Доставлен",
] as const;

export function normalizeOrderStatus(status: string) {
  if (status === "Доставлен" || status === "Закрыта") return "Доставлен";
  if (status === "Отправлен") return "Отправлен";
  if (status === "Новый" || status === "Новая") return "Новый";
  return "В обработке";
}

export type InboxKind = "order" | "contact" | "calculator";

export type InboxCustomer = {
  name: string;
  phone: string;
  email: string;
};

export type InboxItem = {
  id: string;
  kind: InboxKind;
  createdAt: string;
  updatedAt: string;
  status: string;
  unread: boolean;
  title: string;
  customer: InboxCustomer;
  comment: string;
  notes: string;
  total?: number;
  payload: Record<string, unknown>;
};

export type AnalyticsSession = {
  id: string;
  visitorId: string;
  startedAt: string;
  lastAt: string;
  referrer: string;
  pages: string[];
  hits?: string[];
  country?: string;
  city?: string;
};

export type AdminStore = {
  inbox: InboxItem[];
  payUrls: Record<string, string>;
  sessions: AnalyticsSession[];
  visitors: Record<string, string[]>;
  geoCache?: Record<string, { country: string; city: string }>;
};

export const ADMIN_DISPLAY_NAME = "Елена Варакина";

export function kindLabel(kind: InboxKind) {
  if (kind === "order") return "Заказ";
  if (kind === "calculator") return "Калькулятор";
  return "Сообщение";
}
