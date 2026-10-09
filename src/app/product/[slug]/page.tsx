import { notFound } from "next/navigation";
import { ProductPage } from "@/components/site";
import { comingSoonItems, getProduct, products, resolveProductSlug } from "@/lib/products";

export function generateStaticParams() {
  return [
    ...[...products, ...comingSoonItems].map(product => ({ slug: product.slug })),
    { slug: "kover-dzhutovyy" },
    { slug: "kovrik-dzhutovyy" },
    { slug: "salfetki-servirovochnye" },
    { slug: "podstavka-pod-goryachee" },
  ];
}

export default async function Product({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resolved = resolveProductSlug(slug);
  if (!getProduct(resolved)) notFound();
  return <ProductPage slug={resolved} />;
}
