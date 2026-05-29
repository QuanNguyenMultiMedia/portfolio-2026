"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Works", path: "/works" },
  { name: "Takes", path: "/takes" },
  { name: "Play", path: "/play" },
  { name: "Freebies", path: "/freebies" },
  { name: "Contacts", path: "/contacts" },
];

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

  // Determine current directory and title for the HUD Notch
  let directory = "MINHQUAN";
  let title = "HOME";

  if (pathname === "/") {
    title = "HOME";
  } else {
    const activeItem = navItems.find(
      (item) => item.path !== "/" && pathname.startsWith(item.path)
    );
    if (activeItem) {
      const section = activeItem.name.toUpperCase();

      // Build breadcrumbs: MINHQUAN // WORKS or MINHQUAN // WORKS // SLUG
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length > 1) {
        const slug = segments[1].toUpperCase().replace(/-/g, "_");
        title = `${section} // ${slug}`;
      } else {
        title = section;
      }
    }
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden md:flex flex-col items-end w-max">
      {/* Physical HUD Notch */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        key={pathname}
        className="bg-surface/40 backdrop-blur-md border border-primary/10 border-b-0 px-4 py-1 -mb-[1px] relative z-0 origin-bottom"
      >
        <div className="tech-label text-[7px] opacity-40 tracking-[0.4em] whitespace-nowrap max-w-[70vw] md:max-w-none overflow-hidden text-ellipsis">
          {`${directory} // ${title}`}
        </div>
      </motion.div>

      {/* Main Navigation Bar */}
      <nav
        ref={navRef}
        className="relative z-10 flex items-center gap-1 p-1 bg-background/95 backdrop-blur-2xl border border-primary/10 rounded-none shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.15)]"
      >
        {/* Active Pill Highlighter */}
        <div
          className={`absolute bg-tech-blue -z-10 ${
            mounted ? "transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]" : ""
          }`}
          style={{
            left: `${pillStyle.left}px`,
            width: `${pillStyle.width}px`,
            top: `${pillStyle.top}px`,
            height: `${pillStyle.height}px`,
            opacity: pillStyle.opacity,
          }}
        />

        {navItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== "/" && pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              href={item.path}
              data-active={isActive}
              className={`relative px-5 py-2 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-300 ${
                isActive
                  ? "text-background"
                  : "text-foreground/60 hover:text-foreground"
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
