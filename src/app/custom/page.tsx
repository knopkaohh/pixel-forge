import type { Metadata } from "next";
import { CustomPage } from "@/components/site";

export const metadata: Metadata = {
  title: "Индивидуальное изготовление — Мэри Джут",
  description: "Джутовый ковёр по вашим размерам: 5–10 дней, оплата после согласования и фото перед отправкой.",
};

export default function Custom() {
  return <CustomPage />;
}
