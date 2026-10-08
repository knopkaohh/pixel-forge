import { newInboxId } from "@/lib/admin/store";
import type { InboxItem } from "@/lib/admin/types";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export function inboxFromPayload(payload: { type?: unknown } & Record<string, unknown>): InboxItem | null {
  const type = text(payload.type);
  const now = new Date().toISOString();

  if (type === "order") {
    const order = asRecord(payload.order);
    const customer = asRecord(order.customer);
    const id = text(order.id) || newInboxId("order");
    return {
      id,
      kind: "order",
      createdAt: text(order.createdAt) || now,
      updatedAt: now,
      status: "Новый",
      unread: true,
      title: `Заказ ${id}`,
      customer: {
        name: text(customer.name),
        phone: text(customer.phone),
        email: text(customer.email),
      },
      comment: text(customer.comment),
      notes: "",
      total: typeof order.total === "number" ? order.total : undefined,
      payload: order,
    };
  }

  if (type === "contact") {
    const data = asRecord(payload.data);
    return {
      id: newInboxId("contact"),
      kind: "contact",
      createdAt: now,
      updatedAt: now,
      status: "Новая",
      unread: true,
      title: "Сообщение с формы контактов",
      customer: {
        name: text(data.name),
        phone: text(data.phone),
        email: text(data.email),
      },
      comment: text(data.message),
      notes: "",
      payload: data,
    };
  }

  if (type === "calculator") {
    const contact = asRecord(payload.contact);
    const calculation = asRecord(payload.calculation);
    return {
      id: newInboxId("calculator"),
      kind: "calculator",
      createdAt: now,
      updatedAt: now,
      status: "Новая",
      unread: true,
      title: "Заявка с калькулятора",
      customer: {
        name: text(contact.name),
        phone: text(contact.phone),
        email: text(contact.email),
      },
      comment: "",
      notes: "",
      total: typeof calculation.total === "number" ? calculation.total : undefined,
      payload: { contact, calculation },
    };
  }

  return null;
}

