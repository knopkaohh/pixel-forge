import type { Metadata } from "next";
import { PaymentPage } from "@/components/site";

export const metadata: Metadata = {
  title: "Оплата — Мэри Джут",
  description: "Корзина, доставка и оплата картой онлайн. Стоимость видна до оплаты.",
};

export default function Payment() {
  return <PaymentPage />;
}
