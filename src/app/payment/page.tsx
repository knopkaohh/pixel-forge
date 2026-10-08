import type { Metadata } from "next";
import { PaymentPage } from "@/components/site";

export const metadata: Metadata = {
  title: "Оплата — Мэри Джут",
  description: "Оплата заказа через Ozon эквайринг: после оформления под каждой позицией открывается защищённая форма оплаты.",
};

export default function Payment() {
  return <PaymentPage />;
}
