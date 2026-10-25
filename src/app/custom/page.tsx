import type { Metadata } from "next";
import { CustomPage } from "@/components/site";

export const metadata: Metadata = {
  title: "Индивидуальное изготовление — Мэри Джут",
  description: "Ковёр по вашим меркам: от 5 000 ₽, плетение 10–14 дней, предоплата и фото перед отправкой.",
};

export default function Custom() {
  return <CustomPage />;
}
