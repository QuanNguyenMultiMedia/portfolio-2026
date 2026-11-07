// Route warp contract. Every route is a destination in one space; a navigation is a jump along the vector
// between two destinations. These names are internal only: nothing here is ever shown as UI copy.
// Writers: ExitChoreographer (link clicks, popstate), MobileNavbar (hold), KeyFlight (A/D).
// Readers: WarpField (streak pulse), riso.css (`html[data-warp]` view-transition rules), WarpFrame (index).

export type WarpDir = "fwd" | "back";
export type Heading = { x: number; y: number };

export const WARP = { exit: 380, travel: 220, arrive: 300, depth: 1400 } as const;
export const WARP_TOTAL = WARP.exit + WARP.travel + WARP.arrive;

/** Keyed by the first path segment; order is the route order (index readout, A/D keys). */
export const DESTS: Record<string, { x: number; y: number; z: number; label: string }> = {
  "": { x: 0, y: 0, z: 0, label: "Home" },
  works: { x: 1, y: 0, z: -1, label: "Works" },
  takes: { x: 1, y: 1, z: -2, label: "Takes" },
  play: { x: -1, y: 1, z: -2, label: "Play" },
  freebies: { x: -1, y: 0, z: -1, label: "Freebies" },
  contacts: { x: 0, y: -1, z: -3, label: "Contacts" },
};
export const DEST_KEYS = Object.keys(DESTS);

export const destKey = (path: string) => {
  const seg = path.split(/[?#]/)[0].split("/").filter(Boolean)[0] ?? "";
  return seg in DESTS ? seg : "";
};

/** Unit screen heading of the 3D jump from one path to another; {0,0} when both are the same destination. */
export function heading(from: string, to: string): Heading {
  const a = DESTS[destKey(from)], b = DESTS[destKey(to)];
  const x = b.x - a.x, y = b.y - a.y;
  const len = Math.hypot(x, y);
  return len === 0 ? { x: 0, y: 0 } : { x: x / len, y: y / len };
}

let lastPath = typeof window === "undefined" ? "/" : window.location.pathname;
export const getLastPath = () => lastPath;
export const setLastPath = (p: string) => { lastPath = p; };

/** Stamp an increasing index on the current history entry so popstate can tell Back from Forward. */
let counter = 0;
export function navIndex(): number {
  if (typeof window === "undefined") return 0;
  const cur = (window.history.state as { warpIdx?: number } | null)?.warpIdx;
  counter = Math.max(counter, cur ?? 0) + 1;
  return counter;
}
export function stampIndex(idx: number) {
  if (typeof window === "undefined") return;
  window.history.replaceState({ ...(window.history.state ?? {}), warpIdx: idx }, "");
}
export function currentIndex(): number {
  if (typeof window === "undefined") return 0;
  return (window.history.state as { warpIdx?: number } | null)?.warpIdx ?? 0;
}
/** On popstate: the entry we land on has a lower index than where we were → Back. */
export function dirFromPop(landedIdx: number | undefined, fromIdx: number): WarpDir {
  return (landedIdx ?? 0) < fromIdx ? "back" : "fwd";
}

let clearTimer: ReturnType<typeof setTimeout> | undefined;
export function setWarp(dir: WarpDir, h: Heading = { x: 0, y: 0 }) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.warp = dir;
  window.dispatchEvent(new CustomEvent("warp", { detail: { dir, heading: h } }));
  clearTimeout(clearTimer);
  clearTimer = setTimeout(clearWarp, WARP_TOTAL + 200);
}
export function clearWarp() {
  if (typeof document === "undefined") return;
  delete document.documentElement.dataset.warp;
}
