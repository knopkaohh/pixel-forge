import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

const pages = [
  "",
  "/catalog",
  "/about",
  "/portfolio",
  "/delivery",
  "/payment",
  "/contacts",
  "/calculator",
  "/promotions",
  "/returns",
  "/warranty",
  "/care",
  "/faq",
  "/certificates",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...pages.map(path => ({
      url: `${SITE_URL}${path || "/"}`,
      lastModified: now,
      changeFrequency: path === "" || path === "/catalog" ? "weekly" as const : "monthly" as const,
      priority: path === "" ? 1 : path === "/catalog" ? 0.9 : 0.6,
    })),
    ...products.map(product => ({
      url: `${SITE_URL}/product/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
