import type { MetadataRoute } from "next";
import { categorySlugs, products } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const pages = [
  "",
  "/catalog",
  "/about",
  "/portfolio",
  "/delivery",
  "/payment",
  "/contacts",
  "/calculator",
  "/custom",
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
    ...Object.values(categorySlugs).map(slug => ({
      url: `${SITE_URL}/catalog/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map(product => ({
      url: `${SITE_URL}/product/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
