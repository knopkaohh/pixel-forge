import type { Metadata } from "next";
import { WarrantyPage } from "@/components/content-pages";

export const metadata: Metadata = {
  title: "Гарантия качества — Мэри Джут",
  description: "Собственное производство отвечает за материал, пошив и доставку. 14 дней на производственный недостаток.",
};

export default function Warranty() {
  return <WarrantyPage />;
}
