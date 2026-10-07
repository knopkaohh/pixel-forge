import { redirect } from "next/navigation";
import { products } from "@/lib/products";

export default function ProductIndex() {
  redirect(`/product/${products[0].slug}`);
}
