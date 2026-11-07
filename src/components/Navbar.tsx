"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "./LogoMark";
import { NAV_ITEMS } from "@/lib/navigation";
import { ui } from "@/lib/designSystem";

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [pillStyle, setPillStyle] = useState({
    left: 0,
    width: 0,
    top: 0,
    height: 0,
    opacity: 0,
  });

  // Calculate local coordinates of the active link item relative to the navbar container
  useEffect(() => {
    const measure = () => {
      if (!navRef.current) return;
      const activeLink = navRef.current.querySelector(
        '[data-active="true"]'
      ) as HTMLElement;
      if (activeLink) {
        setPillStyle({
          left: activeLink.offsetLeft,
          width: activeLink.offsetWidth,
          top: activeLink.offsetTop,
          height: activeLink.offsetHeight,
          opacity: 1,
        });
      } else {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    measure();
    // After the initial layout computation, enable the smooth transition
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);

    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
  }, [pathname]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden md:flex flex-col items-end w-max">
      {/* Main Navigation Bar */}
      <nav
        ref={navRef}
        className="relative z-10 flex items-center gap-1 p-1 bg-foreground text-background rounded-none"
      >
        {/* Logo Mark on the left side of desktop navbar */}
        <div className="flex items-center pl-4 pr-2 h-7 w-24 flex-shrink-0">
          <LogoMark fixed={false} variant="on-ink" animate={false} className="w-full h-full" />
        </div>

        {/* Active Pill Highlighter */}
        <div
          className={`absolute bg-background -z-10 ${
            mounted ? "transition-all duration-300 ease-[var(--ease-editorial-sharp)]" : ""
          }`}
          style={{
            left: `${pillStyle.left}px`,
            width: `${pillStyle.width}px`,
            top: `${pillStyle.top}px`,
            height: `${pillStyle.height}px`,
            opacity: pillStyle.opacity,
          }}
        />

        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== "/" && pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              href={item.path}
              data-active={isActive}
              className={`relative px-4 py-1.5 text-[14px] font-sans tracking-[-0.01em] transition-colors duration-300 ${
                isActive
                  ? ui.hudKeyActive
                  : `${ui.hudKey} text-background/60 hover:text-background`
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
