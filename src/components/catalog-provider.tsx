"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { emptyCatalog, mergeCatalog, normalizeCatalog, type CatalogRecords } from "@/lib/catalog-records";

type LiveCatalog = ReturnType<typeof mergeCatalog> & { ready: boolean };

const CatalogContext = createContext<LiveCatalog | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<CatalogRecords>(emptyCatalog());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog")
      .then(response => response.json())
      .then(data => {
        if (cancelled || !data?.ok) return;
        setRecords(normalizeCatalog(data));
      })
      .catch(() => null)
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => { cancelled = true; };
  }, []);

  const value = useMemo<LiveCatalog>(() => ({ ...mergeCatalog(records), ready }), [records, ready]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useLiveCatalog() {
  const value = useContext(CatalogContext);
  return value ?? { ...mergeCatalog(emptyCatalog()), ready: true };
}
