import type { Metadata } from "next";
import { LegalPage } from "@/components/content-pages";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Мэри Джут",
  description: "Политика ИП Варакиной Елены Александровны в отношении обработки персональных данных на сайте mary-jute.ru.",
};

export default function Privacy() {
  return <LegalPage type="privacy" />;
}
