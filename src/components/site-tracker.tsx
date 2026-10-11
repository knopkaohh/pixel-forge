"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function token(key: string, storage: Storage) {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const value = `${key[0]}-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
  storage.setItem(key, value);
  return value;
}

export function SiteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const visitorId = token("mj_vid", window.localStorage);
    const sessionId = token("mj_sid", window.sessionStorage);
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer,
        visitorId,
        sessionId,
      }),
      keepalive: true,
    }).catch(() => null);
  }, [pathname]);

  return null;
}
