import type { Metadata } from "next";
import { ReturnsPage } from "@/components/content-pages";

export const metadata: Metadata = {
  title: "Возврат и обмен — Мэри Джут",
  description: "Сроки отказа от готового изделия, условия по состоянию и как вернуть деньги. Индивидуальный заказ без брака не возвращается.",
};

export default function Returns() {
  return <ReturnsPage />;
}
