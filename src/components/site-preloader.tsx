"use client";

import { useEffect, useState } from "react";

export function SitePreloader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.body.classList.add("is-loading");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leaveTimer = window.setTimeout(() => setLeaving(true), reducedMotion ? 250 : 1150);
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      document.body.classList.remove("is-loading");
    }, reducedMotion ? 400 : 1650);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
      document.body.classList.remove("is-loading");
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`site-preloader ${leaving ? "is-leaving" : ""}`} role="status" aria-live="polite" aria-label="Загрузка сайта">
      <div className="preloader-grain" />
      <div className="preloader-orbit"><i /><i /><i /></div>
      <div className="preloader-content">
        <svg className="preloader-leaf" viewBox="0 0 64 64" aria-hidden="true">
          <path className="leaf-fill" d="M54 9C30 9.8 13.4 20.4 11.8 41.8c11.8 2.6 23.8-.7 31-10.3C48.2 24 50 16.4 54 9Z" />
          <path d="M10 53C15.7 37.3 26.6 25.9 45 16.8M25.7 33c-.3-4.9.6-9.2 2.6-13.4M27.8 31.5c4.9.6 9.8-.2 14.6-2.3" />
        </svg>
        <div className="preloader-wordmark"><span>Мэри Джут</span><small>изделия из джута для домашнего уюта</small></div>
        <div className="preloader-progress"><i /></div>
        <p>Создаём тепло вручную</p>
      </div>
      <span className="preloader-number">01 / 03</span>
    </div>
  );
}
