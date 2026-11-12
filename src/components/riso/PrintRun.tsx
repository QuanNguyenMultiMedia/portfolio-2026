"use client";
// The print run (home): sheets stacked in depth, a camera that floats through them on scroll.
// Scroll sets a target depth; the camera follows it on a spring (it drifts on and settles, never parks),
// and the pointer shifts the vantage point so near sheets move more than far ones. A sheet arrives
// off register and settles into register as it reaches the camera. Sheets carry ink only, so the next one
// overprints (multiply) while one passes. Only the camera moves the sheets; nothing inside a sheet is displaced by it.
// Each sheet's parts ([data-o], in their reading order --o) are cued: the sheet the camera reaches prints in, part
// by part (data-cue="in"); one it leaves lifts off ("past"), one still ahead waits ("ahead"). The choreography
// itself is CSS (home.css, cues); the camera only says which sheet is on the press. Flow mode cues from an observer.
// The page fountain prints only on sheets marked [data-plate]: the camera (3D) or an observer (flow) sets
// html.plate-on while one holds the view, and the plate's CSS fades it in and out.
// Client boundary: only the camera lives here; sheet content is server-rendered children.
// Camera speed drives the speed lens: a GPU blur on each moving layer (the sheets' ink only, so paper and fountain
// behind stay sharp), weighted by a radial ramp in viewport space: sharp at the centre, soft toward the rim.
// (An SVG filter over the whole stage looked the same but re-ran every text filter inside it on the CPU each frame.)
// The reel sheet ([data-reel]) travels on its own path: it sits at the camera plane from the start, its frame scaled out
// to fill the screen under the hero, pale under a paper wash; as the camera reaches it the frame draws in to its own
// proportions at full density; as the camera moves on, the reel flies back into the distance, shrinking, and is
// taken off the press. It never passes the camera. While it flies back the page fountain crashes in behind it, stirred
// by the camera's speed, and ebbs once the next sheet holds (lib/plate, plateSurge).
// Below 768px, on short screens and under reduced motion the same sheets read as a vertical page (CSS).
import { useEffect, useRef } from "react";
import { plateCalm, plateSurge } from "@/lib/plate";
import { motionBus } from "@/lib/warp";
import IndexRail from "./IndexRail";

const DEPTH = 1400; // px between sheets along Z
const SPRING = { stiffness: 100, damping: 28, mass: 0.6 }; // camera follow: weighty, no overshoot
const LOOK = { shift: 10, stiffness: 80, damping: 30, mass: 1 }; // pointer look-around: shift only, no tilt
const ENABLED = "(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

const HOLD = 0.08; // |camera offset| from the nearest sheet, in sheets, inside which it counts as held
const CUE = 0.3; // |camera offset| from a sheet, in sheets, inside which its parts are printed in
const LENS = { vmax: 2000, rise: 14, fall: 5, blur: 10, step: 0.5 }; // speed → lens: velocity at full effect, settle rates, max blur px, blur quantum

// the lens ramp (viewport space, from the vanishing point): no blur inside LENS_IN of the radius, full at LENS_OUT
const LENS_R = 0.7, LENS_IN = 0.36, LENS_OUT = 0.92;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

// the reel: the hero's wash, the black border some of the footage carries (1152 of 1280 px: cropped off at full
// spread), how far back it flies (px of depth at the next sheet), and where along that it fades off the press
const REEL = { crop: 1280 / 1152, far: 6000, fadeFrom: 0.5, fadeTo: 0.92 };
// the surge: in by SURGE_IN of the way back, out from SURGE_OUT as the next sheet arrives; stirred at least this hard
const SURGE_IN = 0.22, SURGE_OUT = 0.72, SURGE_STIR = 1.3, SURGE_GAIN = 1.6;

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
    // the cued parts are also what the lens blurs: each by where it sits on the viewport ramp
    type Layer = { el: HTMLElement; nx: number; ny: number; hw: number; hh: number; blur: number };
    const layers: Layer[][] = sheets.map((sh) =>
      Array.from(sh.querySelectorAll<HTMLElement>("[data-o]:not([data-nolens])")).map((el) => ({ el, nx: 0, ny: 0, hw: 0, hh: 0, blur: 0 })));
    const cue = (el: HTMLElement, state: "ahead" | "in" | "past") => { if (el.dataset.cue !== state) el.dataset.cue = state; };
    let speed = 0; // 0..1, smoothed |camera velocity|
    // under travel the ink-edge filters drop (riso.css): a url() filter beside a changing blur re-runs every step
    let travelling = false;
    let hazeOn = true;
    const lensLayer = (L: Layer, px: number) => {
      // the part's rim on screen against the elliptical ramp
      const ex = (Math.abs(L.nx) + L.hw) / LENS_R, ey = (Math.abs(L.ny) + L.hh) / LENS_R;
      const ramp = clamp((Math.sqrt(ex * ex + ey * ey) - LENS_IN) / (LENS_OUT - LENS_IN));
      const b = Math.round((px * ramp) / LENS.step) * LENS.step;
      if (b === L.blur) return;
      // keep a filter the layer prints with (BlurMap's stack), and add the lens after it
      const own = L.el.style.filter.replace(/\s*blur\([^)]*\)$/, "");
      L.blur = b;
      if (b > 0) L.el.style.filter = `${own} blur(${b}px)`.trim();
      else if (own) L.el.style.filter = own;
      else L.el.style.removeProperty("filter");
    };

    // the reel sheet, and its frame's layout box (offsets: unaffected by the camera's transforms)
    const reelAt = sheets.findIndex((sh) => sh.hasAttribute("data-reel"));
    const reelScale = reelAt >= 0 ? sheets[reelAt].querySelector<HTMLElement>(".reel-scale") : null;
    const reelBox = { cover: 1, dx: 0, dy: 0 };

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
      // each layer's centre relative to the vanishing point, as a fraction of its sheet (projection-invariant)
      measureReel();
      sheets.forEach((sh, i) => {
        const s = sh.getBoundingClientRect();
        const ox = s.left + s.width * 0.5, oy = s.top + s.height * 0.46;
        for (const L of layers[i]) {
          const r = L.el.getBoundingClientRect();
          L.nx = (r.left + r.width / 2 - ox) / s.width;
          L.ny = (r.top + r.height / 2 - oy) / s.height;
          L.hw = r.width / s.width / 2; L.hh = r.height / s.height / 2;
        }
      });
    };
    const measureReel = () => {
      if (!reelScale) return;
      const frame = reelScale.parentElement as HTMLElement;
      const w = frame.offsetWidth, h = frame.offsetHeight;
      if (!w || !h) return;
      const vw = window.innerWidth, vh = stage.clientHeight || window.innerHeight;
      // cover the screen, past the look-around shift and the footage's own border
      reelBox.cover = Math.max((vw + 4 * LOOK.shift) / w, (vh + 4 * LOOK.shift) / h) * REEL.crop;
      reelBox.dx = vw / 2 - (frame.offsetLeft + w / 2);
      reelBox.dy = vh / 2 - (frame.offsetTop + h / 2);
    };
    // the reel's own path: u = camera position relative to the reel sheet, in sheets (-1 = hero held, 0 = focused)
    const paintReel = (el: HTMLElement, u: number) => {
      let z = 0, s = 1, e = 1, opacity = 1;
      if (u <= 0) {
        e = smooth(clamp(1 + u));
        s = reelBox.cover + (1 - reelBox.cover) * e;
      } else {
        const k = clamp(u);
        z = -REEL.far * Math.pow(k, 1.5);
        opacity = 1 - smooth(clamp((k - REEL.fadeFrom) / (REEL.fadeTo - REEL.fadeFrom)));
      }
      el.style.transform = `translate3d(${lookX.x * LOOK.shift * e}px,${lookY.x * LOOK.shift * e}px,${z.toFixed(1)}px)`;
      el.style.opacity = opacity.toFixed(3);
      el.toggleAttribute("data-off", opacity <= 0);
      el.toggleAttribute("data-focus", Math.abs(u) < 0.35);
      el.style.setProperty("--d", "0");
      el.style.pointerEvents = Math.abs(u) < 0.3 ? "auto" : "none";
      cue(el, u < 1 ? "in" : "past");
      if (reelScale) {
        reelScale.style.transform = `translate3d(${(reelBox.dx * (1 - e)).toFixed(1)}px,${(reelBox.dy * (1 - e)).toFixed(1)}px,0) scale(${s.toFixed(4)})`;
      }
      // the hero's ground: the paper wash and the fountain over the footage, both lifting as it comes into focus
      el.style.setProperty("--wash", (1 - e).toFixed(3));
      // the fountain wave behind the reel as it flies back
      const k = u <= 0 || u >= 1 ? 0 : smooth(clamp(u / SURGE_IN)) * (1 - smooth(clamp((u - SURGE_OUT) / (1 - SURGE_OUT))));
      const v = cam.v / DEPTH; // sheets per second
      plateSurge(k, k > 0 ? (v < 0 ? -1 : 1) * Math.max(Math.abs(v) * SURGE_GAIN, SURGE_STIR * k) : 0);
    };
    const target = () => clamp((window.scrollY - top) / span) * (n - 1) * DEPTH;

    const root = document.documentElement;
    const setPlate = (on: boolean) => root.classList.toggle("plate-on", on);

    const paint = () => {
      const lensE = 1 - (1 - speed) * (1 - speed); // ease-out: a single sheet step already reads, a hard scrub saturates
      const lensPx = Math.round((lensE * LENS.blur) / LENS.step) * LENS.step;
      if ((lensPx > 0) !== travelling) { travelling = lensPx > 0; stage.classList.toggle("is-travelling", travelling); }
      stage.style.perspectiveOrigin = `${50 + lookX.x * 4}% ${46 + lookY.x * 4}%`;
      for (let i = 0; i < n; i++) {
        const el = sheets[i];
        const d = (i * DEPTH - cam.x) / DEPTH; // >0 ahead of the camera, <0 passed
        if (i === reelAt) { paintReel(el, -d); continue; }
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
        cue(el, Math.abs(d) < CUE ? "in" : d > 0 ? "ahead" : "past");
        for (const L of layers[i]) lensLayer(L, lensPx);
      }
      run.setAttribute("data-painted", "");
      const near = Math.round(cam.x / DEPTH);
      // BlurMap's haze re-runs its whole filter chain on every step; on a sheet in projection (travelling, or
      // parked between sheets) that costs a frame budget, so the drift runs only on a held sheet
      const held = Math.abs(cam.x / DEPTH - near) < HOLD;
      if (held !== hazeOn) { hazeOn = held; root.classList.toggle("haze-hold", !held); }
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
      const want = clamp(Math.abs(cam.v) / LENS.vmax);
      speed += (want - speed) * (1 - Math.exp(-(want > speed ? LENS.rise : LENS.fall) * dt));
      if (speed < 1e-3 && want === 0) speed = 0;
      paint();
      motionBus.runVelocity = cam.v;
      const settled =
        Math.abs(cam.v) < 0.5 && Math.abs(cam.x - target()) < 0.5 &&
        Math.abs(lookX.v) + Math.abs(lookY.v) < 1e-3 &&
        Math.abs(lookX.x - pointer.x) + Math.abs(lookY.x - pointer.y) < 1e-3 && speed === 0;
      raf = settled ? 0 : requestAnimationFrame(frame);
      if (settled) motionBus.runVelocity = 0;
      if (settled) last = 0;
    };
    const wake = () => { if (!raf && mq.matches) raf = requestAnimationFrame(frame); };

    const clear = () => {
      run.classList.remove("is-3d");
      root.classList.remove("run-3d");
      run.removeAttribute("data-painted");
      sheets.forEach((el) => { el.removeAttribute("style"); el.removeAttribute("data-off"); el.removeAttribute("data-focus"); });
      reelScale?.removeAttribute("style");
      plateCalm();
      stage.style.removeProperty("perspective-origin");
      layers.flat().forEach((L) => lensLayer(L, 0));
      travelling = false; stage.classList.remove("is-travelling");
      hazeOn = true; root.classList.remove("haze-hold");
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
    // a step pressed while a previous step is still travelling counts from where that one is going,
    // so repeated W/S presses queue sheets instead of collapsing into one
    let pending = -1, pendingUntil = 0;
    const goto = (i: number) => {
      pending = i; pendingUntil = performance.now() + 900;
      const behavior = scrollBehavior();
      if (mq.matches) window.scrollTo({ top: top + (n > 1 ? i / (n - 1) : 0) * span, behavior });
      else { const el = sheets[i]; if (el) el.scrollIntoView({ behavior, block: "start" }); }
    };
    const onGoto = (e: Event) => goto((e as CustomEvent<{ i: number }>).detail.i);
    const onStep = (e: Event) => {
      const from = pending >= 0 && performance.now() < pendingUntil ? pending : current();
      goto(clamp(from + (e as CustomEvent<{ d: number }>).detail.d, 0, n - 1));
    };
    const onActivate = () => sheets[current()]?.querySelector<HTMLAnchorElement>("a[href]")?.click();

    // flow mode: a marked sheet holding most of the viewport turns the plate on
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? seen.add(e.target) : seen.delete(e.target);
      if (!mq.matches) setPlate(seen.size > 0);
    }, { rootMargin: "-35% 0px -35% 0px" });
    sheets.filter((el) => el.hasAttribute("data-plate")).forEach((el) => io.observe(el));
    // flow mode: a sheet prints in once a fifth of it is on screen, and lifts off (or waits) once it has gone
    const showing = new Set<Element>();
    const flow = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) showing.add(e.target);
        else showing.delete(e.target);
      }
      if (mq.matches) return;
      // every sheet off screen is re-placed, so one skipped over by a jump still lifts off the right way
      for (const el of sheets) cue(el, showing.has(el) ? "in" : el.getBoundingClientRect().top > 0 ? "ahead" : "past");
    }, { threshold: 0.2 });
    sheets.forEach((el) => flow.observe(el));

    const setup = () => {
      if (mq.matches) {
        run.classList.add("is-3d");
        root.classList.add("run-3d");
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

    run.setAttribute("data-cued", "");
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
      flow.disconnect();
      setPlate(false);
      clear();
      run.removeAttribute("data-cued");
      sheets.forEach((el) => el.removeAttribute("data-cue"));
    };
  }, []);

  return (
    <div className="run" ref={runRef}>
      <div className="run-stage">{children}</div>
      <IndexRail />
    </div>
  );
}
