"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { routeTopic } from "@/lib/navigation";
import { fx } from "@/lib/designSystem";

// The bar prints the same fountain ink as the page wash: a closer crop, faster drift, an eddy under the cursor.
const Fountain = dynamic(() => import("./riso/Fountain"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 w-full h-full" />,
});
const BAR_INK = { speed: 1.6, phase: 2.4, zoom: 0.45, lean: 1.8, cursor: 1 };

export default function GlobalSideBar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const segments = pathname.split("/").filter(Boolean);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const isHome = pathname === "/";
  const isIndividualItem = segments.length >= 2;
  const topic = routeTopic(pathname);

  const ease = `cubic-bezier(${fx.easeSharp.join(",")})`;
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <div
      className={`vt-chrome-side fixed left-0 top-24 bottom-0 z-[60] flex-col w-6 md:w-8 pointer-events-none transition-opacity duration-300 hidden md:flex ${mounted ? "opacity-100" : "opacity-0"}`}
    >
      {!mounted ? null : (
        <>
          {/* 0. Right Border Stroke */}
          <motion.div
            initial={false}
            animate={{ opacity: isHome ? 0 : 1 }}
            transition={{
              duration: isHome ? 0.2 : 0.4,
              delay: isHome ? 0 : 0.6,
              ease: fx.ease,
            }}
            className="absolute top-0 right-0 bottom-0 w-[1px] bg-foreground/5 z-[70]"
          />

          {/* 0.5. Back Button (only shown inside individual items) */}
          <AnimatePresence>
            {isIndividualItem && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 48, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: fx.easeSharp }}
                className="relative w-full flex-shrink-0 pointer-events-auto overflow-hidden flex items-center justify-center"
              >
                <Link
                  href={`/${segments[0]}`}
                  className="w-full h-full flex items-center justify-center text-foreground hover:text-foreground transition-colors group"
                  aria-label="Go Back"
                >
                  <span className="text-[14px] font-sans group-hover:-translate-y-0.5 transition-transform">
                    ↑
                  </span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 1. Integrated Theme Toggle (TOP) */}
          <div className="relative h-12 w-full flex-shrink-0 pointer-events-auto">
            {/* One element: the button is a full-width pill clipped down to the bar.
                Hover / focus animates the clip open, so icon and label never move and
                the hit area follows exactly what is visible (clip-path clips hit-testing). */}
            <button
              type="button"
              onClick={toggleTheme}
              style={{ transitionTimingFunction: ease }}
              className="group absolute left-0 top-0 h-full w-44 flex items-center outline-none [clip-path:inset(0_calc(100%-2rem)_0_0)] hover:[clip-path:inset(0)] focus-visible:[clip-path:inset(0)] transition-[clip-path] duration-500 will-change-[clip-path]"
              aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            >
              <span className="w-6 md:w-8 h-full flex-shrink-0 flex items-center justify-center">
              <motion.span
                animate={{ rotate: isDark ? 360 : 0 }}
                transition={{ duration: 0.7, ease: fx.easeSharp }}
                className={`block w-3.5 h-3.5 md:w-4 md:h-4 transition-colors duration-300 ${isHome ? "text-primary" : "text-foreground"} group-hover:text-foreground group-focus-visible:text-foreground`}
              >
                {isDark ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </motion.span>
              </span>

              <span
                  aria-hidden="true"
                  style={{ transitionTimingFunction: ease }}
                  className="ml-2 flex flex-col items-start whitespace-nowrap opacity-0 -translate-x-1 transition-[opacity,transform] duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:duration-500 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 motion-reduce:translate-x-0"
                >
                  <span className="text-[12px] font-sans text-foreground">
                    Theme · {isDark ? "Dark" : "Light"}
                  </span>
                  <span
                    style={{ transitionTimingFunction: ease }}
                    className="mt-1 block h-px w-full bg-tech-blue scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100 group-hover:duration-700 group-hover:delay-150 group-focus-visible:scale-x-100"
                  />
                </span>
            </button>

            <motion.div
              animate={{ opacity: isHome ? 0 : 1 }}
              transition={{
                duration: isHome ? 0.2 : 0.4,
                delay: isHome ? 0 : 0.6,
              }}
              className="absolute left-0 right-0 bottom-0 h-[1px] bg-foreground/5"
            />
          </div>

          <div className="flex-grow w-full pointer-events-auto relative">
            <Fountain params={BAR_INK} className="!absolute inset-0 w-full h-full" />
          </div>

          {topic && (
            <div className="h-32 md:h-48 flex-shrink-0 flex items-center justify-center bg-foreground text-background relative z-10 pointer-events-auto">
              <span className="text-[11px] md:text-[13px] font-display italic -rotate-90 whitespace-nowrap origin-center">
                {topic}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
