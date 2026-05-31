"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import WaveGradientBar from "./WaveGradientBar";

export default function MobileTopBar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const segments = pathname.split("/").filter(Boolean);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const isIndividualItem = segments.length >= 2;

  let colors = ["#005f73", "#0a9396", "#94d2bd"];

  if (pathname === "/") {
    colors = ["#1e3a8a", "#1e40af", "#3b82f6"];
  } else if (segments[0] === "works") {
    colors = ["#ca6702", "#ee9b00", "#e9d8a6"];
  } else if (segments[0] === "takes") {
    colors = ["#4c1d95", "#6d28d9", "#8b5cf6"];
  } else if (segments[0] === "freebies") {
    colors = ["#005f73", "#0a9396", "#94d2bd"];
  } else if (segments[0] === "play") {
    colors = ["#ca6702", "#bb3e03", "#ae2012"];
  } else if (segments[0] === "contacts") {
    colors = ["#333333", "#444444", "#555555"];
  }

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  if (!mounted) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-9 z-[60] flex items-center bg-background border-b border-primary/10 md:hidden"
    >
      {/* Back Button (left side, shown only inside individual items) */}
      <div className="w-9 h-full flex-shrink-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isIndividualItem && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 36, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="w-full h-full overflow-hidden border-r border-primary/10 flex items-center justify-center bg-background"
            >
              <Link
                href={`/${segments[0]}`}
                className="w-full h-full flex items-center justify-center text-foreground/45 active:text-foreground transition-colors"
                aria-label="Go Back"
              >
                <span className="text-[14px] font-sans -rotate-90">
                  →
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Horizontal Gradient Bar (middle fill) */}
      <div className="flex-grow h-full relative overflow-hidden">
        <WaveGradientBar
          colors={colors}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Theme Toggle (right side) */}
      <div className="w-9 h-full flex-shrink-0 border-l border-primary/10 flex items-center justify-center bg-background">
        <button
          onClick={toggleTheme}
          className="w-full h-full flex items-center justify-center group focus:outline-none"
          aria-label="Toggle Theme"
        >
          <motion.div
            animate={{ rotate: isDark ? 360 : 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="w-3.5 h-3.5 text-foreground/45 group-hover:text-foreground transition-colors"
          >
            {isDark ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )}
          </motion.div>
        </button>
      </div>
    </div>
  );
}
