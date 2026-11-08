"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "./LogoMark";
import { NAV_ITEMS } from "@/lib/navigation";
import { ui } from "@/lib/designSystem";

const isActivePath = (pathname: string, path: string) =>
  pathname === path || (path !== "/" && (pathname === path || pathname.startsWith(path + "/")));

// The active box is one element moved by transform only (a 1px box translated and scaled to the link), so it
// never animates layout. It follows the click at once: the route itself lands later, after the exit choreography,
// and the box used to wait for it, then jump. Re-measured on resize, font swap and route change.
export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  // the destination a warp named, tagged with the route it left from: once the route changes (it landed, or Back
  // moved elsewhere) the tag no longer matches and the pathname is the truth again
  const [pending, setPending] = useState<{ to: string; from: string } | null>(null);
  const current = pending && pending.from === pathname ? pending.to : pathname;
  // a warp names its destination before the route lands (link exits, mobile hold, keys)
  useEffect(() => {
    const onWarp = (e: Event) => {
      const to = (e as CustomEvent<{ to?: string }>).detail?.to;
      if (to) setPending({ to, from: location.pathname });
    };
    window.addEventListener("warp", onWarp);
    return () => window.removeEventListener("warp", onWarp);
  }, []);

  useLayoutEffect(() => {
    const nav = navRef.current, pill = pillRef.current;
    if (!nav || !pill) return;
    let animated = pill.dataset.ready === "1";
    const measure = () => {
      const a = nav.querySelector<HTMLElement>('[data-active="true"]');
      if (!a) { pill.style.opacity = "0"; return; }
      pill.style.height = `${a.offsetHeight}px`;
      // the links sit in the ink row, whose filter makes it their offsetParent: add its offset within the nav
      const row = a.offsetParent instanceof HTMLElement && a.offsetParent !== nav ? a.offsetParent : null;
      const x = a.offsetLeft + (row?.offsetLeft ?? 0), y = a.offsetTop + (row?.offsetTop ?? 0);
      pill.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${a.offsetWidth})`;
      pill.style.opacity = "1";
      if (!animated) {
        animated = true;
        // first placement lands without a slide; transitions start on the next frame
        requestAnimationFrame(() => { pill.dataset.ready = "1"; });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    nav.querySelectorAll("a").forEach((a) => ro.observe(a));
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [current]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden md:flex flex-col items-end w-max">
      <nav
        ref={navRef}
        aria-label="Primary"
        className="relative z-10 flex items-center gap-1 p-1 bg-foreground text-background rounded-none"
      >
        <div className="flex items-center pl-4 pr-2 h-7 w-24 flex-shrink-0">
          <LogoMark fixed={false} variant="on-ink" animate={false} className="w-full h-full" />
        </div>

        <div
          ref={pillRef}
          aria-hidden
          className="absolute left-0 top-0 w-px bg-background -z-10 origin-left opacity-0 will-change-transform data-[ready='1']:transition-[transform,opacity] data-[ready='1']:duration-500 data-[ready='1']:ease-[var(--ease-editorial-sharp)] motion-reduce:!transition-none"
        />

        {/* one ink-edges pass for the whole row (riso.css [data-ink]), not one per link */}
        <div data-ink="" className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = isActivePath(current, item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              data-active={isActive}
              aria-current={isActivePath(pathname, item.path) ? "page" : undefined}
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
        </div>
      </nav>
    </div>
  );
}
