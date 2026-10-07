import { notFound } from "next/navigation";
import { ProductPage } from "@/components/site";
import { getProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map(product => ({ slug: product.slug }));
}

export default async function Product({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getProduct(slug)) notFound();
  return <ProductPage slug={slug} />;
}
