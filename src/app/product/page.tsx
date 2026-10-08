"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/lib/products";

export default function ProductIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/product/${products[0].slug}`);
  }, [router]);
  return null;
}
