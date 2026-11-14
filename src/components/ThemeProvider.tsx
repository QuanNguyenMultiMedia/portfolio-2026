"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { LazyMotion, MotionConfig } from "framer-motion";

const motionFeatures = () => import("@/lib/motionFeatures").then((r) => r.default);

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      {...props}
    >
      {/* reduced motion: every Framer entrance keeps its fade and drops its travel (AGENTS.md §6) */}
      <LazyMotion features={motionFeatures}><MotionConfig reducedMotion="user">{children}</MotionConfig></LazyMotion>
    </NextThemesProvider>
  );
}
