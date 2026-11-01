import type { Metadata } from "next";
import { CustomPage } from "@/components/site";

export const metadata: Metadata = {
  title: "Индивидуальное изготовление — Мэри Джут",
  description: "Ковёр по вашим меркам: пошив 5–10 дней, предоплата и фото перед отправкой.",
};

export default function Custom() {
  return <CustomPage />;
}
