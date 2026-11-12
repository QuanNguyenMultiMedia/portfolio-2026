// The cover gate (Book): on the first visit of a session to home, an inline script in the layout's head marks
// html[data-cover] before first paint, so the cover prints over the first spread from the first frame. Anything on
// the first spread that would play behind the cover (the name's haze, the reel) waits for the cover to be turned.
export const COVER_ATTR = "data-cover";
export const COVER_EVENT = "cover-open";
export const LOCK_ATTR = "data-lock"; // scrolling held while the cover is up and the hero prints in (Book)
export const COVER_KEY = "cover-open"; // sessionStorage: the cover was turned this session

/** Runs before first paint (layout <head>): home, first visit this session, script on. */
export const COVER_SCRIPT = `try{if(location.pathname==="/"&&!sessionStorage.getItem("${COVER_KEY}"))document.documentElement.setAttribute("${COVER_ATTR}","")}catch(e){}`;

export const covered = () => typeof document !== "undefined" && document.documentElement.hasAttribute(COVER_ATTR);

/** Runs `fn` now, or once the cover has been turned. Returns a cancel. */
export function afterCover(fn: () => void): () => void {
  if (!covered()) { fn(); return () => {}; }
  window.addEventListener(COVER_EVENT, fn, { once: true });
  return () => window.removeEventListener(COVER_EVENT, fn);
}
