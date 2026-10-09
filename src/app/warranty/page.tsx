import type { Metadata } from "next";
import { WarrantyPage } from "@/components/content-pages";

export const metadata: Metadata = {
  title: "Гарантия качества — Мэри Джут",
  description: "Собственное производство отвечает за материал, плетение и доставку. 30 дней на производственный недостаток.",
};

export default function Warranty() {
  return <WarrantyPage />;
}
