import type { Metadata } from "next";
import { LegalPage } from "@/components/content-pages";

export const metadata: Metadata = {
  title: "Пользовательское соглашение — Мэри Джут",
  description: "Пользовательское соглашение сайта mary-jute.ru. Администратор — ИП Варакина Елена Александровна.",
};

export default function Terms() {
  return <LegalPage type="terms" />;
}
