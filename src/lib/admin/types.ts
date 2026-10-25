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
  payUrl?: string;
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

export type Subscriber = {
  id: string;
  email: string;
  note: string;
  createdAt: string;
  unread: boolean;
};

export type CatalogSpecs = {
  material: string;
  diameter: string;
  thickness: string;
  color: string;
  production: string;
  care: string;
};

export type CatalogPatch = {
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  specs: CatalogSpecs;
  sizeLabel: string;
  comingSoon: boolean;
  featured: boolean;
  onOrder: boolean;
};

export type CreatedProductRecord = CatalogPatch & {
  id: string;
  slug: string;
};

export type ExtraCategory = {
  name: string;
  slug: string;
};

export type CatalogRecords = {
  edits: Record<string, CatalogPatch>;
  created: CreatedProductRecord[];
  categories: ExtraCategory[];
  deleted: string[];
};

export type AdminStore = {
  inbox: InboxItem[];
  payUrls: Record<string, string>;
  sessions: AnalyticsSession[];
  visitors: Record<string, string[]>;
  geoCache?: Record<string, { country: string; city: string }>;
  subscribers: Subscriber[];
  catalog: CatalogRecords;
};

export const ADMIN_DISPLAY_NAME = "Елена Варакина";

export function kindLabel(kind: InboxKind) {
  if (kind === "order") return "Заказ";
  if (kind === "calculator") return "Калькулятор";
  return "Сообщение";
}
