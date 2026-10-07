import { Suspense } from "react";
import { CatalogPage } from "@/components/site";

export default function Catalog() {
  return (
    <Suspense>
      <CatalogPage />
    </Suspense>
  );
}
