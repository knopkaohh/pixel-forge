import type { Metadata } from "next";
import { PaymentPage } from "@/components/site";

export const metadata: Metadata = {
  title: "Оплата — Мэри Джут",
  description: "Один заказ, одна сумма, оплата картой. Адрес доставки указываете при оформлении.",
};

export default function Payment() {
  return <PaymentPage />;
}
