"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ShopProvider } from "@/components/shop-provider";
import { SitePreloader } from "@/components/site-preloader";
import { SiteTracker } from "@/components/site-tracker";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) document.body.classList.remove("is-loading");
  }, [isAdmin]);

  if (isAdmin) return <>{children}</>;
  return (
    <ShopProvider>
      <SitePreloader />
      <SiteTracker />
      {children}
    </ShopProvider>
  );
}
