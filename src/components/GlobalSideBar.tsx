"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WaveGradientBar from "./WaveGradientBar";
import { projects } from "@/data/projects";
import { takes } from "@/data/takes";

export default function GlobalSideBar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const segments = pathname.split("/").filter(Boolean);

  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";
  const isHome = pathname === "/";

  let colors = ["#005f73", "#0a9396", "#94d2bd"];
  let topic = "EXPLORE";

  if (pathname === "/") {
    colors = ["#1e3a8a", "#1e40af", "#3b82f6"];
    topic = "HOME";
  } else if (segments[0] === "works") {
    if (segments[1]) {
      const project = projects.find((p) => p.slug === segments[1]);
      if (project) {
        colors = project.colors;
        topic = project.category.toUpperCase();
      }
    } else {
      colors = ["#ca6702", "#ee9b00", "#e9d8a6"];
      topic = "ARCHIVE";
    }
  } else if (segments[0] === "takes") {
    if (segments[1]) {
      const take = takes.find((t) => t.slug === segments[1]);
      if (take) {
        colors = take.colors;
        topic = take.topic.toUpperCase();
      }
    } else {
      colors = ["#4c1d95", "#6d28d9", "#8b5cf6"];
      topic = "ESSAYS";
    }
  } else if (segments[0] === "freebies") {
    colors = ["#005f73", "#0a9396", "#94d2bd"];
    topic = "BOUTIQUE";
  } else if (segments[0] === "play") {
    colors = ["#ca6702", "#bb3e03", "#ae2012"];
    topic = "LABS";
  } else if (segments[0] === "contact") {
    colors = ["#333333", "#444444", "#555555"];
    topic = "CONNECT";
  }

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <div
      className={`fixed left-0 top-24 bottom-0 z-[60] flex flex-col w-6 md:w-8 pointer-events-none bg-background transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}
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
              ease: "linear",
            }}
            className="absolute top-0 right-0 bottom-0 w-[1px] bg-foreground/5 z-[70]"
          />

          {/* 1. Integrated Theme Toggle (TOP) */}
          <div className="relative h-12 w-full flex-shrink-0 pointer-events-auto">
            <motion.button
              onClick={toggleTheme}
              initial={false}
              animate={{
                width: isHome ? "auto" : "100%",
                paddingLeft: isHome ? "3rem" : "0",
                paddingRight: isHome ? "1.5rem" : "0",
              }}
              transition={{
                duration: 0.6,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="h-full flex items-center group focus:outline-none whitespace-nowrap overflow-visible"
              aria-label="Toggle Theme"
            >
              <motion.div
                animate={{
                  width: isHome
                    ? 40
                    : typeof window !== "undefined" && window.innerWidth < 768
                      ? 24
                      : 32,
                  height: isHome ? 40 : 32,
                }}
                className="relative flex items-center justify-center flex-shrink-0"
              >
                <motion.div
                  animate={{ rotate: isDark ? 360 : 0 }}
                  transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-colors ${isHome ? "text-primary" : "text-foreground/40 group-hover:text-foreground"}`}
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
              </motion.div>

              <AnimatePresence mode="wait">
                {isHome && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    className="flex flex-col items-start ml-6"
                  >
                    <span className="text-[7px] font-mono tracking-[0.4em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">
                      MODE // {isDark ? "DARK" : "LIGHT"}
                    </span>
                    <div className="h-[0.5px] w-0 group-hover:w-full bg-tech-blue transition-all duration-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

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
            <WaveGradientBar
              colors={colors}
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {topic && (
            <div className="h-32 md:h-48 flex-shrink-0 flex items-center justify-center bg-foreground text-background relative z-10 pointer-events-auto">
              <span className="text-[8px] md:text-[10px] uppercase font-sans tracking-[0.3em] -rotate-90 whitespace-nowrap origin-center">
                {topic}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
