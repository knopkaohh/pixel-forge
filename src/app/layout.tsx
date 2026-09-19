import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Мэри Джут — интерьерные изделия из джута",
  description: "Ковры, корзины, панно и декор ручной работы из натурального джута.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
