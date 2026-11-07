"use client";
// The print run (home): sheets stacked in depth, a camera that floats through them on scroll.
// Scroll sets a target depth; the camera follows it on a spring (it drifts on and settles, never parks),
// and the pointer shifts the vantage point so near sheets move more than far ones. A sheet arrives
// off register and settles into register as it reaches the camera. Sheets carry ink only, so the next one
// overprints (multiply) while one passes. Inside a sheet, layers slide against each other with depth.
// The page fountain prints only on sheets marked [data-plate]: the camera (3D) or an observer (flow) sets
// html.plate-on while one holds the view, and the plate's CSS fades it in and out.
// Client boundary: only the camera lives here; sheet content is server-rendered children.
// Below 768px, on short screens and under reduced motion the same sheets read as a vertical page (CSS).
import { useEffect, useRef } from "react";
import IndexRail from "./IndexRail";

const DEPTH = 1400; // px between sheets along Z
const SPRING = { stiffness: 100, damping: 28, mass: 0.6 }; // camera follow: weighty, no overshoot
const LOOK = { shift: 10, stiffness: 80, damping: 30, mass: 1 }; // pointer look-around: shift only, no tilt
const ENABLED = "(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

type Spring = { x: number; v: number };
// semi-implicit Euler, sub-stepped so a long frame never explodes the spring
function step(s: Spring, target: number, k: number, c: number, m: number, dt: number) {
  const n = Math.ceil(dt / 0.008);
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    s.v += ((-k * (s.x - target) - c * s.v) / m) * h;
    s.x += s.v * h;
  }
}

export default function PrintRun({ children }: { children: React.ReactNode }) {
  const runRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const run = runRef.current;
    if (!run) return;
    const stage = run.firstElementChild as HTMLElement;
    const sheets = Array.from(run.querySelectorAll<HTMLElement>(":scope > .run-stage > .sheet"));
    const n = sheets.length;
    run.style.setProperty("--n", String(n));
    const mq = window.matchMedia(ENABLED);

    const cam: Spring = { x: 0, v: 0 };
    const lookX: Spring = { x: 0, v: 0 };
    const lookY: Spring = { x: 0, v: 0 };
    let lastNear = -1;
    let pointer = { x: 0, y: 0 };
    let raf = 0;
    let last = 0;
    let top = 0;
    let span = 1;

    const measure = () => {
      top = run.getBoundingClientRect().top + window.scrollY;
      span = Math.max(1, run.offsetHeight - window.innerHeight);
    };
    const target = () => clamp((window.scrollY - top) / span) * (n - 1) * DEPTH;

    const root = document.documentElement;
    const setPlate = (on: boolean) => root.classList.toggle("plate-on", on);

    const paint = () => {
      stage.style.perspectiveOrigin = `${50 + lookX.x * 4}% ${46 + lookY.x * 4}%`;
      for (let i = 0; i < n; i++) {
        const el = sheets[i];
        const d = (i * DEPTH - cam.x) / DEPTH; // >0 ahead of the camera, <0 passed
        const ahead = clamp(d);
        // the next sheet stays unprinted until the camera is well on its way to it: no ghost behind the held sheet
        const opacity = d < 0 ? clamp(1 + d / 0.4) : clamp(1 - d / 0.6);
        el.style.transform = `translate3d(${lookX.x * LOOK.shift}px,${lookY.x * LOOK.shift}px,${-d * DEPTH}px)`;
        el.style.opacity = opacity.toFixed(3);
        // an unprinted sheet is off the press (CSS hides it; under html.kbd it stays focusable, see onTab)
        el.toggleAttribute("data-off", opacity <= 0);
        el.style.setProperty("--d", clamp(d, -1, 1).toFixed(3));
        el.style.setProperty("--mis", (1 + ahead * 10).toFixed(2));
        el.style.pointerEvents = Math.abs(d) < 0.3 ? "auto" : "none";
      }
      run.setAttribute("data-painted", "");
      const near = Math.round(cam.x / DEPTH);
      if (near !== lastNear) {
        lastNear = near;
        window.dispatchEvent(new CustomEvent("run-index", { detail: { i: near, n } }));
      }
      setPlate(sheets[near]?.hasAttribute("data-plate") ?? false);
    };

    const frame = (t: number) => {
      const dt = Math.min(0.05, last ? (t - last) / 1000 : 1 / 60);
      last = t;
      step(cam, target(), SPRING.stiffness, SPRING.damping, SPRING.mass, dt);
      step(lookX, pointer.x, LOOK.stiffness, LOOK.damping, LOOK.mass, dt);
      step(lookY, pointer.y, LOOK.stiffness, LOOK.damping, LOOK.mass, dt);
      paint();
      const settled =
        Math.abs(cam.v) < 0.5 && Math.abs(cam.x - target()) < 0.5 &&
        Math.abs(lookX.v) + Math.abs(lookY.v) < 1e-3 &&
        Math.abs(lookX.x - pointer.x) + Math.abs(lookY.x - pointer.y) < 1e-3;
      raf = settled ? 0 : requestAnimationFrame(frame);
      if (settled) last = 0;
    };
    const wake = () => { if (!raf && mq.matches) raf = requestAnimationFrame(frame); };

    const clear = () => {
      run.classList.remove("is-3d");
      run.removeAttribute("data-painted");
      sheets.forEach((el) => { el.removeAttribute("style"); el.removeAttribute("data-off"); });
      stage.style.removeProperty("perspective-origin");
    };

    // keyboard: focusing into a sheet brings the camera to it
    const onFocus = (e: FocusEvent) => {
      if (!mq.matches) return;
      const i = sheets.findIndex((el) => el.contains(e.target as Node));
      if (i < 0) return;
      const y = top + (i / (n - 1)) * span;
      if (Math.abs(window.scrollY - y) > 4) window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
    };
    // hidden sheets skip paint, but hidden links can't take focus: the first Tab keeps them all focusable
    // (before the browser moves focus), and a pointer press hands painting back to the camera
    const onTab = (e: KeyboardEvent) => { if (e.key === "Tab") root.classList.add("kbd"); };
    const onPress = () => root.classList.remove("kbd");
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
      wake();
    };

    // the index rail and the keys drive the run: goto a sheet, step to a neighbour, open the sheet's first link
    const scrollBehavior = () =>
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth") as ScrollBehavior;
    const nearestSheet = () => {
      let best = 0, bestTop = Infinity;
      sheets.forEach((el, i) => {
        const t = Math.abs(el.getBoundingClientRect().top);
        if (t < bestTop) { best = i; bestTop = t; }
      });
      return best;
    };
    const current = () => (mq.matches ? lastNear : nearestSheet());
    const goto = (i: number) => {
      const behavior = scrollBehavior();
      if (mq.matches) window.scrollTo({ top: top + (n > 1 ? i / (n - 1) : 0) * span, behavior });
      else { const el = sheets[i]; if (el) el.scrollIntoView({ behavior, block: "start" }); }
    };
    const onGoto = (e: Event) => goto((e as CustomEvent<{ i: number }>).detail.i);
    const onStep = (e: Event) => goto(clamp(current() + (e as CustomEvent<{ d: number }>).detail.d, 0, n - 1));
    const onActivate = () => sheets[current()]?.querySelector<HTMLAnchorElement>("a[href]")?.click();

    // flow mode: a marked sheet holding most of the viewport turns the plate on
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? seen.add(e.target) : seen.delete(e.target);
      if (!mq.matches) setPlate(seen.size > 0);
    }, { rootMargin: "-35% 0px -35% 0px" });
    sheets.filter((el) => el.hasAttribute("data-plate")).forEach((el) => io.observe(el));

    const setup = () => {
      if (mq.matches) {
        run.classList.add("is-3d");
        measure();
        cam.x = target(); // arrive where the page already is (reload mid-scroll), then follow
        cam.v = 0;
        paint();
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
        clear();
        setPlate(seen.size > 0);
      }
    };
    const onResize = () => { if (mq.matches) { measure(); wake(); } };

    setup();
    mq.addEventListener("change", setup);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    run.addEventListener("focusin", onFocus);
    window.addEventListener("keydown", onTab);
    window.addEventListener("run-goto", onGoto);
    window.addEventListener("run-step", onStep);
    window.addEventListener("run-activate", onActivate);
    window.addEventListener("pointerdown", onPress, { passive: true });
    return () => {
      window.removeEventListener("keydown", onTab);
      window.removeEventListener("run-goto", onGoto);
      window.removeEventListener("run-step", onStep);
      window.removeEventListener("run-activate", onActivate);
      window.removeEventListener("pointerdown", onPress);
      root.classList.remove("kbd");
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", setup);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      run.removeEventListener("focusin", onFocus);
      io.disconnect();
      setPlate(false);
      clear();
    };
  }, []);

  return (
    <div className="run" ref={runRef}>
      <div className="run-stage">{children}</div>
      <IndexRail />
    </div>
  );
}
