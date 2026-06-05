"use client";

import { trackFirstClick, trackPageView } from "@/lib/analytics/client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ProductAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = (event.target as HTMLElement | null)?.closest(
        "a, button, [role='button'], input[type='submit']"
      ) as HTMLElement | null;

      if (!target) return;
      trackFirstClick(target);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
