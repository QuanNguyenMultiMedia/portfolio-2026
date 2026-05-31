"use client";

import { useState, useEffect } from "react";

export type ScreenSize = "mobile" | "laptop" | "3xl" | "4xl";

export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>("laptop");

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) setScreenSize("mobile");
      else if (w >= 2560) setScreenSize("4xl");
      else if (w >= 1920) setScreenSize("3xl");
      else setScreenSize("laptop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
}
