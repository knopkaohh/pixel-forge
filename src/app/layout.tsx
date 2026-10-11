import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/app-shell";
import { SITE_HOST, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Мэри Джут — интерьерные изделия из джута",
  description: "Ковры, корзины, панно и декор ручной работы из натурального джута.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Мэри Джут",
    title: "Мэри Джут — интерьерные изделия из джута",
    description: "Ковры, корзины, панно и декор ручной работы из натурального джута.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  other: { "application-name": SITE_HOST },
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
