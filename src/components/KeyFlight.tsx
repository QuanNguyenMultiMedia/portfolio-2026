"use client";
// Keyboard drive for the site. On home, W/S step through the print run and Space opens the current sheet's
// first link. Anywhere, A/D move along the route index (wrapping), through the site's own click transition.
// Renders nothing.
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { DEST_KEYS, destKey } from "@/lib/warp";

const FIELD = "input, textarea, select, [contenteditable]";

export default function KeyFlight() {
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.repeat) return;
      if (e.target instanceof Element && (e.target.closest(FIELD) || e.target.closest('[role="dialog"]'))) return;

      const key = e.key.toLowerCase();
      const home = pathname === "/";

      if (home && (key === "w" || key === "s")) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("run-step", { detail: { d: key === "w" ? -1 : 1 } }));
        return;
      }
      // Space keeps its native meaning on a focused control (button, link, notch); only bare page focus opens the sheet
      if (home && e.key === " " && !(e.target instanceof Element && e.target.closest("a,button,[role=button],summary"))) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("run-activate"));
        return;
      }
      if (key === "a" || key === "d") {
        const i = DEST_KEYS.indexOf(destKey(pathname));
        const next = DEST_KEYS[(i + (key === "d" ? 1 : -1) + DEST_KEYS.length) % DEST_KEYS.length];
        const a = document.createElement("a");
        a.href = `/${next}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname]);

  return null;
}
