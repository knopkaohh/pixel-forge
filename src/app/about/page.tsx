import type { Metadata } from "next";
import { AboutPage } from "@/components/site";

export const metadata: Metadata = {
  title: "О нас — Мэри Джут",
  description: "Собственное производство интерьерных изделий из джута — фабрика с душой.",
};

export default function About() {
  return <AboutPage />;
}
