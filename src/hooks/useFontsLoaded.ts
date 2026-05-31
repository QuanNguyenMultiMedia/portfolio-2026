"use client";

import { useEffect, useState, useCallback } from "react";

export function useFontsLoaded(font: string): boolean {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const checkFonts = useCallback(() => {
    if (typeof window === "undefined") return;
    const fonts = (document as any).fonts;
    if (!fonts) {
      setFontsLoaded(true);
      return;
    }

    let cancelled = false;
    let timeoutId: NodeJS.Timeout | null = null;

    const poll = () => {
      try {
        if (fonts.check(font)) {
          if (!cancelled) setFontsLoaded(true);
        } else {
          timeoutId = setTimeout(poll, 150);
        }
      } catch {
        if (!cancelled) setFontsLoaded(true);
      }
    };

    poll();
    fonts.ready
      .then(() => { if (!cancelled) setFontsLoaded(true); })
      .catch(() => { if (!cancelled) setFontsLoaded(true); });
    fonts.addEventListener("loadingdone", poll);

    return () => {
      cancelled = true;
      fonts.removeEventListener("loadingdone", poll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [font]);

  useEffect(() => {
    const cleanup = checkFonts();
    return cleanup;
  }, [checkFonts]);

  return fontsLoaded;
}
