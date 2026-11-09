"use client";

/**
 * WorkDial — the works selector: a 3D title cylinder read through a viewfinder,
 * driven by a rotary dial on its right. One component owns the geometry,
 * input (pointer drag, click, keyboard), sound and haptics.
 *
 * Geometry is derived from two unitless CSS vars set per breakpoint on the root:
 *   --row   height of one title row (px)
 *   --dial  dial diameter (px)
 * Everything else is computed from them, so every breakpoint stays consistent:
 *   - the wheel box is 4 rows tall, so prev and next are always in view;
 *   - the viewfinder's two strokes end exactly on the dial's outer ring
 *     (chord intersection: x = r + sqrt(r² − (row/2)²) from the right edge);
 *   - cylinder radius = 2.5 rows, so neighbours sit one row from centre.
 * Per-frame motion bypasses React: transforms are written straight to the DOM.
 */

import { useEffect, useRef, useState } from "react";
import { plateKick } from "@/lib/plate";
import gsap from "gsap";

// white noise for the click transient (runs in the sound handler, never during render)
function fillNoise(d: Float32Array) {
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}

type Item = { slug: string; title: string };

type Props = {
  items: Item[];
  activeIndex: number;
  onChange: (index: number) => void;
  onOpen: (index: number) => void;
};

const TICK_DEG = 15;
const ANGLE_STEP = 24;
const SNAP = "0.75s cubic-bezier(0.19, 1, 0.22, 1)";
const DRAG = "0.12s cubic-bezier(0.1, 0.8, 0.2, 1)";

/* Viewfinder stroke endpoint: where y = ±row/2 meets the dial's outer ring. */
const CHORD = "calc((var(--dial) / 2 + sqrt(var(--dial) * var(--dial) / 4 - var(--row) * var(--row) / 4)) * 1px)";

const wrap = (i: number, n: number) => ((i % n) + n) % n;

export default function WorkDial({ items, activeIndex, onChange, onOpen }: Props) {
  const N = items.length;
  const sector = 360 / N;

  const rootRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const rotation = useRef(0);
  const active = useRef(activeIndex);
  const row = useRef(80);
  const lastAngle = useRef<number | null>(null);
  const wound = useRef(0);
  const audio = useRef<AudioContext | null>(null);
  const lastTick = useRef(0);
  const spin = useRef({ rot: 0, t: 0 }); // last painted rotation and time: the spin speed that feeds the plate
  const [dragging, setDragging] = useState(false);

  /* ---------- sound + haptics ---------- */
  const ctx = () => {
    if (!audio.current) {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (C) audio.current = new C();
    }
    if (audio.current?.state === "suspended") audio.current.resume();
    return audio.current;
  };

  const blip = (noiseHz: number, noiseLen: number, noiseVol: number, wave: OscillatorType, f0: number, f1: number, len: number, vol: number) => {
    try {
      const c = ctx();
      if (!c) return;
      const now = c.currentTime;
      const buf = c.createBuffer(1, Math.ceil(c.sampleRate * noiseLen), c.sampleRate);
      const d = buf.getChannelData(0);
      fillNoise(d);
      const noise = c.createBufferSource();
      noise.buffer = buf;
      const hp = c.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.setValueAtTime(noiseHz, now);
      const ng = c.createGain();
      ng.gain.setValueAtTime(noiseVol, now);
      ng.gain.exponentialRampToValueAtTime(0.001, now + noiseLen * 0.9);
      noise.connect(hp).connect(ng).connect(c.destination);
      noise.start(now);
      const osc = c.createOscillator();
      const og = c.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(f0, now);
      osc.frequency.exponentialRampToValueAtTime(f1, now + len);
      og.gain.setValueAtTime(vol, now);
      og.gain.exponentialRampToValueAtTime(0.001, now + len);
      osc.connect(og).connect(c.destination);
      osc.start(now);
      osc.stop(now + len + 0.005);
    } catch {
      /* audio blocked */
    }
  };

  const lockSound = () => blip(2000, 0.008, 0.08, "triangle", 240, 60, 0.03, 0.12);
  const windTick = (v: number) => {
    const c = audio.current;
    if (!c || c.currentTime - lastTick.current < 0.016) return;
    lastTick.current = c.currentTime;
    const f = 480 + Math.min(v * 12, 600);
    blip(3000, 0.004, 0.03 + Math.min(v / 800, 0.03), "sine", f, f * 0.5, 0.008, 0.04 + Math.min(v / 600, 0.04));
  };
  const buzz = () => navigator.vibrate?.(10);

  /* ---------- DOM writers ---------- */
  const setTransition = (t: string) => {
    if (knobRef.current) knobRef.current.style.transition = t === "none" ? "none" : `transform ${t}`;
    itemRefs.current.forEach((el) => {
      if (el) el.style.transition = t === "none" ? "none" : `transform ${t}, opacity ${t}, filter ${t}`;
    });
  };

  const paint = (rot: number) => {
    const now = performance.now(), s = spin.current;
    if (s.t && now > s.t) plateKick(((rot - s.rot) * 1000) / Math.max(8, now - s.t), now - s.t);
    s.rot = rot; s.t = now;
    const R = row.current * 2.5;
    const curve = row.current * 1.5;
    if (knobRef.current) knobRef.current.style.transform = `rotate(${rot}deg)`;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const diff = wrap(i - rot / sector + N / 2, N) - N / 2;
      const rad = (diff * ANGLE_STEP * Math.PI) / 180;
      const isActive = i === active.current;
      const dist = Math.abs(diff);
      // the next pick either side stays readable ink (AA over the plate); further rows fall away as wheel depth
      const opacity = isActive ? 1 : dist <= 1 ? 1 - dist * 0.14 : Math.max(0, 0.86 * (1 - (dist - 1) / 1.5));
      const scale = isActive ? 1.02 : 1 - Math.min(dist * 0.08, 0.3);
      el.style.transform = `translate3d(${-(1 - Math.cos(rad)) * curve}px, ${Math.sin(rad) * R}px, ${(Math.cos(rad) - 1) * R}px) rotateX(${-diff * ANGLE_STEP}deg) scale(${scale})`;
      el.style.opacity = String(opacity > 0.01 ? opacity : 0);
      const f = isActive ? "url(#ink-edges) blur(0px)" : `url(#ink-edges) blur(${(dist <= 1 ? dist * 0.6 : Math.min(0.6 + (dist - 1) * 2, 4)).toFixed(1)}px)`; // every title prints roughened (InkEdges); depth adds defocus
      // the SVG roughen re-runs whenever filter is written, so only write when the defocus step changes
      if (el.dataset.f !== f) { el.dataset.f = f; el.style.filter = f; }
      el.style.pointerEvents = dist <= 1 ? "auto" : "none"; // depth ghosts are scenery: the wheel brings them forward
    });
  };

  const sync = (rot: number) => {
    const idx = wrap(Math.round(rot / sector), N);
    if (idx !== active.current) {
      active.current = idx;
      onChange(idx);
      buzz();
    }
  };

  /* Re-read --row whenever the layout changes breakpoint. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const read = () => {
      row.current = parseFloat(getComputedStyle(root).getPropertyValue("--row")) || 80;
      paint(rotation.current);
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(root);
    return () => {
      ro.disconnect();
      gsap.killTweensOf(rotation);
      audio.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Repaint when the active item changes so its emphasis lands. */
  useEffect(() => {
    active.current = activeIndex;
    paint(rotation.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  /* ---------- input ---------- */
  const go = (i: number) => {
    ctx();
    let target = Math.floor(rotation.current / 360) * 360 + i * sector;
    const d = target - rotation.current;
    if (d > 180) target -= 360;
    if (d < -180) target += 360;
    setTransition("none");
    gsap.killTweensOf(rotation);
    gsap.to(rotation, {
      current: target,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.75,
      ease: "power4.out",
      onUpdate: () => {
        paint(rotation.current);
        sync(rotation.current);
      },
      onComplete: () => sync(target),
    });
    lockSound();
    buzz();
  };

  const angleAt = (x: number, y: number) => {
    const r = dialRef.current!.getBoundingClientRect();
    return (Math.atan2(y - r.top - r.height / 2, x - r.left - r.width / 2) * 180) / Math.PI;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    ctx();
    gsap.killTweensOf(rotation);
    setTransition(DRAG);
    lastAngle.current = angleAt(e.clientX, e.clientY);
    wound.current = 0;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || lastAngle.current === null) return;
    const a = angleAt(e.clientX, e.clientY);
    let delta = a - lastAngle.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    lastAngle.current = a;
    const abs = Math.abs(delta);
    if (abs > 0.05) {
      wound.current += abs;
      if (wound.current >= 3.5) {
        wound.current %= 3.5;
        windTick(Math.min(abs * 8, 120));
      }
    }
    rotation.current += delta;
    paint(rotation.current);
    sync(rotation.current);
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    lastAngle.current = null;
    spin.current.t = 0; // the snap to the nearest row is not a spin
    rotation.current = Math.round(rotation.current / sector) * sector;
    setTransition(SNAP);
    paint(rotation.current);
    sync(rotation.current);
    lockSound();
    buzz();
  };

  const onDialKey = (e: React.KeyboardEvent) => {
    const k = e.key;
    if (k === "ArrowRight" || k === "ArrowDown") go(wrap(activeIndex + 1, N));
    else if (k === "ArrowLeft" || k === "ArrowUp") go(wrap(activeIndex - 1, N));
    else if (k === "Home") go(0);
    else if (k === "End") go(N - 1);
    else if (k === "Enter" || k === " ") onOpen(activeIndex);
    else return;
    e.preventDefault();
  };

  /* ---------- render ---------- */
  return (
    <div
      ref={rootRef}
      className="relative w-full select-none [--row:60] [--dial:120] md:[--row:80] md:[--dial:160] 3xl:[--row:110] 3xl:[--dial:240] 4xl:[--row:140] 4xl:[--dial:320]"
      style={{ height: "calc(max(var(--row) * 4, var(--dial) + 24) * 1px)" }}
    >
      {/* Viewfinder: two strokes that end on the dial ring, plus the fixed left indicator */}
      <div
        aria-hidden
        className="absolute left-0 top-1/2 -translate-y-1/2 border-y border-primary/25 pointer-events-none"
        style={{ right: CHORD, height: "calc(var(--row) * 1px)" }}
      >
        <div className="absolute left-0 inset-y-0 w-[3px] bg-primary rounded-full" />
      </div>

      {/* Title cylinder, clipped to the viewfinder's span and feathered at both ends */}
      <div
        className="absolute left-0 inset-y-0 overflow-hidden"
        style={{
          right: CHORD,
          perspective: "1500px",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        }}
      >
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2"
          style={{ height: "calc(var(--row) * 1px)", transformStyle: "preserve-3d" }}
        >
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={item.slug}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                data-ink="" /* prints its own ink-edges pass (inline, with the depth blur); the title inside takes no second one */
                role="button"
                tabIndex={isActive ? 0 : -1}
                aria-label={isActive ? `Open ${item.title}` : `Select ${item.title}`}
                onClick={() => (isActive ? onOpen(i) : go(i))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (isActive) onOpen(i);
                    else go(i);
                  }
                }}
                className="absolute inset-0 pl-6 md:pl-8 pr-3 flex items-center cursor-pointer group/item will-change-transform"
                style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
              >
                {/* one ink for every title, as on the boards: depth comes from the wheel, never a paler ink */}
                <h2
                  className={`font-display font-bold tracking-tighter leading-[1.2] truncate origin-left transition-[color,transform] duration-300 group-hover/item:skew-x-[-10deg] text-(--ink-display) ${
                    item.title.length > 15
                      ? "text-base md:text-2xl lg:text-[1.5rem] xl:text-[1.75rem] 3xl:text-[2.25rem] 4xl:text-[3rem]"
                      : "text-lg md:text-3xl lg:text-[2.25rem] xl:text-[2.5rem] 3xl:text-[3rem] 4xl:text-[3.75rem]"
                  }`}
                >
                  {item.title}
                </h2>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dial: outer ring + bezel ticks, rotating knob, static index cap. Sized from --dial. */}
      <div
        ref={dialRef}
        role="slider"
        tabIndex={0}
        aria-label="Select project"
        aria-valuemin={1}
        aria-valuemax={N}
        aria-valuenow={activeIndex + 1}
        aria-valuetext={items[activeIndex]?.title}
        onKeyDown={onDialKey}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-primary/25 touch-none transition-colors duration-300 hover:border-primary/50 focus-visible:outline-1 focus-visible:outline-offset-[6px] focus-visible:outline-primary/40 ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ width: "calc(var(--dial) * 1px)", height: "calc(var(--dial) * 1px)" }}
      >
        {items.map((_, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute inset-0 flex justify-center pointer-events-none"
            style={{ transform: `rotate(${i * sector}deg)` }}
          >
            <div
              className={`w-0.5 transition-all duration-300 ${i === activeIndex ? "bg-primary" : "bg-foreground/20"}`}
              style={
                i === activeIndex
                  ? { height: "calc(var(--dial) * 0.09px)" }
                  : { height: "calc(var(--dial) * 0.05px)", marginTop: "calc(var(--dial) * 0.035px)" }
              }
            />
          </div>
        ))}

        <div
          ref={knobRef}
          aria-hidden
          className="absolute left-1/2 top-1/2 rounded-full border border-primary/25 pointer-events-none"
          style={{
            width: "70%",
            height: "70%",
            margin: "-35% 0 0 -35%",
          }}
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            {Array.from({ length: 360 / TICK_DEG }, (_, i) => (
              <line
                key={i}
                x1="50"
                y1="3"
                x2="50"
                y2={i % 6 === 0 ? 9 : 6}
                transform={`rotate(${i * TICK_DEG} 50 50)`}
                stroke="currentColor"
                strokeWidth={0.5}
                vectorEffect="non-scaling-stroke"
                className="text-primary"
              />
            ))}
            <circle cx="50" cy="16" r="4.5" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" className="text-primary" />
          </svg>
        </div>

        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/25 flex items-center justify-center pointer-events-none"
          style={{ width: "27.5%", height: "27.5%" }}
        >
          <span
            className="font-sans font-black tracking-tighter text-primary tabular-nums"
            style={{ fontSize: "calc(var(--dial) * 0.09px)" }}
          >
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
