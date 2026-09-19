import type { Metadata } from "next";
import { ShopProvider } from "@/components/shop-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Мэри Джут — интерьерные изделия из джута",
  description: "Ковры, корзины, панно и декор ручной работы из натурального джута.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body><ShopProvider>{children}</ShopProvider></body>
    </html>
  );
}
