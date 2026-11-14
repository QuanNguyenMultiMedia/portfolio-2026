"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { routeTopic } from "@/lib/navigation";
import { fx } from "@/lib/designSystem";

// The phone's strip is the desktop sidebar laid flat: the same fountain ink and the route set in italic on an ink block.
const Fountain = dynamic(() => import("./riso/Fountain"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 w-full h-full" />,
});
const BAR_INK = { speed: 1.6, phase: 2.4, zoom: 0.45, lean: 1.8, cursor: 1 };

export default function MobileTopBar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const segments = pathname.split("/").filter(Boolean);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const isIndividualItem = segments.length >= 2;
  const topic = routeTopic(pathname);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  if (!mounted) return null;

  return (
    <div
      className="vt-chrome-top fixed top-0 left-0 right-0 h-9 z-[60] flex items-center bg-background border-b border-primary/10 md:hidden"
    >
      {/* Back Button (left side, shown only inside individual items) */}
      <div className="w-9 h-full flex-shrink-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isIndividualItem && (
            <m.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: fx.easeSharp }}
              style={{ width: 36 }}
              className="h-full overflow-hidden border-r border-primary/10 flex items-center justify-center bg-background"
            >
              <Link
                href={`/${segments[0]}`}
                className="w-full h-full flex items-center justify-center text-foreground active:text-foreground transition-colors"
                aria-label="Go Back"
              >
                <span className="text-[14px] font-sans" aria-hidden>
                  ←
                </span>
              </Link>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {topic && (
        <div className="h-full flex-shrink-0 flex items-center px-3 bg-foreground text-background">
          <span className="text-[13px] font-display italic whitespace-nowrap">{topic}</span>
        </div>
      )}
      <div className="flex-grow h-full relative overflow-hidden">
        <Fountain params={BAR_INK} className="!absolute inset-0 w-full h-full" />
      </div>

      {/* Theme Toggle (right side) */}
      <div className="w-9 h-full flex-shrink-0 border-l border-primary/10 flex items-center justify-center bg-background">
        <button
          onClick={toggleTheme}
          className="w-full h-full flex items-center justify-center group"
          aria-label="Toggle Theme"
        >
          <m.div
            animate={{ rotate: isDark ? 360 : 0 }}
            transition={{ duration: 0.7, ease: fx.easeSharp }}
            className="w-3.5 h-3.5 text-foreground group-hover:text-foreground transition-colors"
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
          </m.div>
        </button>
      </div>
    </div>
  );
}
