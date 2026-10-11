import type { Metadata } from "next";
import { PortfolioPage } from "@/components/site";

export const metadata: Metadata = {
  title: "Портфолио — Мэри Джут",
  description: "Коллаж работ собственного производства: ковры, салфетки, подставки и корзины из джута.",
};

export default function Portfolio() {
  return <PortfolioPage />;
}
