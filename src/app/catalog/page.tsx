import { CatalogPage } from "@/components/site";

export default async function Catalog({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <CatalogPage initialCategory={category} />;
}
