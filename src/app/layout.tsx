import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Мэри Джут — интерьерные изделия из джута",
  description: "Ковры, корзины, панно и декор ручной работы из натурального джута.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body className="is-loading">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
