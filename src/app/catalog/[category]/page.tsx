import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/site";
import { categoryFromSlug, categorySlugs } from "@/lib/products";

export function generateStaticParams() {
  return Object.values(categorySlugs).map(category => ({ category }));
}

export default async function CatalogCategory({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const name = categoryFromSlug(category);
  if (!name) notFound();
  return <CatalogPage initialCategory={name} />;
}
