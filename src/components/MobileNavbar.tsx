"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LogoMark from "./LogoMark";
import { NAV_ITEMS } from "@/lib/navigation";
import { setWarp, heading, setLastPath, motionBus } from "@/lib/warp";

const CHARGE_R = 22;
const CHARGE_C = 2 * Math.PI * CHARGE_R;
const CHARGE_MS = 200; // a short dwell so a finger passing over an item does not fire it
const CAPTURE = 64; // px from an item's centre that still counts as on it
// one shared context: browsers cap live AudioContexts, and a new one per tick stalled the menu after a few rolls
let audio: AudioContext | null = null;
const audioCtx = () => {
  const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  audio ??= new C();
  if (audio.state === "suspended") audio.resume().catch(() => {});
  return audio;
};

export default function MobileNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [charge, setCharge] = useState(0);
  const chargeRef = useRef(0);
  const rafRef = useRef(0);

  
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [touchCenter, setTouchCenter] = useState({ x: 0, y: 0 });
  // the ray follows the finger by direct DOM writes, not state: a re-render per touchmove made the menu lag
  const rayRef = useRef<SVGLineElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  // Disable body scroll when menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);


  // Hold charge: the active item fills over CHARGE_MS before release will navigate
  useEffect(() => {
    chargeRef.current = 0;
    if (!isOpen || activeIndex === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rafRef.current = requestAnimationFrame(() => {
        chargeRef.current = 1;
        setCharge(1);
      });
      return () => cancelAnimationFrame(rafRef.current);
    }
    const start = performance.now();
    const tick = (now: number) => {
      const next = Math.min(1, (now - start) / CHARGE_MS);
      chargeRef.current = next;
      setCharge(next);
      if (next < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isOpen, activeIndex]);

  // Spreading 6 items in an arc from 180 degrees (straight left) to 270 degrees (straight up)
  const radius = 175;
  const startAngle = 180;
  const endAngle = 270;
  const angleStep = (endAngle - startAngle) / (NAV_ITEMS.length - 1);

  const getCoordinates = (index: number) => {
    const angle = startAngle + index * angleStep;
    const rad = (angle * Math.PI) / 180;
    // Vary the radius for alternating items to create visual fluctuation & prevent overlaps
    const itemRadius = radius + (index % 2 === 0 ? -25 : 25);
    return {
      x: Math.cos(rad) * itemRadius,
      y: Math.sin(rad) * itemRadius,
    };
  };

  const handleStart = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setTouchCenter({ x: cx, y: cy });
    }
    setIsOpen(true);
    setActiveIndex(null);

    // Audio click
    playTick();
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isOpen) return;
    rayRef.current?.setAttribute("x2", String(clientX));
    rayRef.current?.setAttribute("y2", String(clientY));
    dotRef.current?.setAttribute("cx", String(clientX));
    dotRef.current?.setAttribute("cy", String(clientY));

    const dx = clientX - touchCenter.x;
    const dy = clientY - touchCenter.y;
    // the item under the finger wins: nearest drawn centre, within reach, once the finger has left the anchor
    let target: number | null = null;
    if (Math.hypot(dx, dy) > 60) {
      let best = CAPTURE;
      NAV_ITEMS.forEach((_, i) => {
        const c = getCoordinates(i);
        const d = Math.hypot(dx - c.x, dy - c.y);
        if (d < best) { best = d; target = i; }
      });
    }
    if (target !== activeIndex) {
      setActiveIndex(target);
      if (target !== null) playTick();
    }
  };

  const handleEnd = () => {
    if (!isOpen) return;
    if (activeIndex !== null && chargeRef.current >= 1) {
      const target = NAV_ITEMS[activeIndex];
      // a link exit still waiting to push would land after this and win: cancel it
      clearTimeout(motionBus.pendingNav);
      setWarp("fwd", heading(pathname, target.path), target.path);
      setLastPath(target.path);
      router.push(target.path);
      playSuccess();
    }
    setIsOpen(false);
    setActiveIndex(null);
  };

  // Synthesize micro mechanical ticking for finger rolls
  const playTick = () => {
    try {
      const ctx = audioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.006);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.006);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.008);
    } catch {}
  };

  // Synthesize soft confirm chime
  const playSuccess = () => {
    try {
      const ctx = audioCtx();
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.06); // E5

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1046.5, now); // C6

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.2);
      osc2.start(now);
      osc2.stop(now + 0.2);
    } catch {}
  };

  // Global listeners for touch move tracking
  useEffect(() => {
    if (!isOpen) return;

    const handleTouchMoveGlobal = (e: TouchEvent) => {
      if (isOpen && e.cancelable) {
        e.preventDefault();
      }
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseMoveGlobal = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    window.addEventListener("touchmove", handleTouchMoveGlobal, { passive: false });
    window.addEventListener("mousemove", handleMouseMoveGlobal);
    window.addEventListener("touchend", handleEnd);
    window.addEventListener("mouseup", handleEnd);

    return () => {
      window.removeEventListener("touchmove", handleTouchMoveGlobal);
      window.removeEventListener("mousemove", handleMouseMoveGlobal);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("mouseup", handleEnd);
    };
  }, [isOpen, touchCenter, activeIndex, pathname]); // eslint-disable-line react-hooks/exhaustive-deps -- handlers read these

  return (
    <>
      {/* Accessible fallback navigation for keyboard/AT users (the radial menu below is gesture-only) */}
      <nav aria-label="Mobile navigation" className="md:hidden">
        <ul className="fixed top-0 left-0 z-[200] flex flex-col">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className="sr-only focus:not-sr-only focus:block focus:relative focus:bg-background focus:text-foreground focus:border focus:border-primary/25 focus:px-5 focus:py-3 focus:font-sans focus:text-xs"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Floating Status Notch / Trigger Button */}
      {/* a slim strip at the thumb: logo and the hold trigger, clear of the home indicator */}
      <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-4 right-4 z-50 md:hidden pointer-events-none">
        <div className="w-full bg-background border border-primary/25 pl-3 pr-1 py-1 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-6 flex-shrink-0">
              <LogoMark fixed={false} variant="auto" animate={false} className="w-full h-full" />
            </div>
          </div>

          <button
            ref={triggerRef}
            aria-label="Hold and drag to open navigation menu"
            aria-expanded={isOpen}
            onTouchStart={(e) => {
              e.preventDefault();
              if (e.touches.length > 0) {
                handleStart();
              }
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              handleStart();
            }}
            className="font-sans text-[14px] w-11 h-11 flex items-center justify-center bg-background active:bg-primary active:text-background transition-colors duration-300 select-none cursor-pointer touch-none"
          >
            <span aria-hidden>≡</span>
          </button>
        </div>
      </div>

      {/* Radial Menu Overlay Screen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-background z-[100] md:hidden pointer-events-none flex items-center justify-center overflow-hidden"
          >
            {/* Ambient subtle glow ring */}
            <div 
              className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-primary/25 pointer-events-none animate-[spin_60s_linear_infinite]"
              style={{
                left: `${touchCenter.x - 180}px`,
                top: `${touchCenter.y - 180}px`,
              }}
            />

            {/* Pointer Ray Vector Line pointing from thumb to finger */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <line
                ref={rayRef}
                x1={touchCenter.x}
                y1={touchCenter.y}
                x2={touchCenter.x}
                y2={touchCenter.y}
                stroke="var(--tech-blue)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-40"
              />
              <circle
                ref={dotRef}
                cx={touchCenter.x}
                cy={touchCenter.y}
                r="6"
                fill="var(--tech-blue)"
                className="opacity-60"
              />
            </svg>

            {NAV_ITEMS.map((item, i) => {
              const coords = getCoordinates(i);
              const isCurrent = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path + "/"));
              const isSelected = activeIndex === i;

              return (
                <motion.div
                  key={item.path}
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: coords.x,
                    y: coords.y,
                  }}
                  exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 24,
                    delay: i * 0.02,
                  }}
                  className="absolute pointer-events-none z-20 overflow-visible"
                  style={{
                    left: `${touchCenter.x - 40}px`, // Offset by half of typical pill width
                    top: `${touchCenter.y - 20}px`,  // Offset by half of typical pill height
                  }}
                >
                  <div
                    className={`w-20 h-10 flex items-center justify-center font-sans text-[12px] border transition-all duration-300 relative overflow-visible ${
                      isSelected
                        ? "bg-tech-blue border-tech-blue text-background scale-110"
                        : isCurrent
                          ? "bg-background border-tech-blue/50 text-tech-blue"
                          : "bg-background border-primary/25 text-primary"
                    }`}
                  >
                    <span
                      className={`transition-all duration-300 whitespace-nowrap px-2 py-1 ${
                        isSelected
                          ? "-translate-y-8 text-tech-blue font-bold scale-110 bg-background border border-tech-blue/30"
                          : ""
                      }`}
                    >
                      {item.name}
                    </span>
                    {isSelected && (
                      <svg
                        aria-hidden
                        viewBox="0 0 48 48"
                        className="absolute left-1/2 top-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2 text-tech-blue pointer-events-none overflow-visible"
                      >
                        <circle
                          cx="24"
                          cy="24"
                          r={CHARGE_R}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeDasharray={CHARGE_C}
                          strokeDashoffset={CHARGE_C * (1 - charge)}
                          transform="rotate(-90 24 24)"
                        />
                      </svg>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Center Anchor Point */}
            <div
              className="absolute w-12 h-12 rounded-full border border-primary/25 flex items-center justify-center z-10 pointer-events-none bg-background"
              style={{
                left: `${touchCenter.x - 24}px`,
                top: `${touchCenter.y - 24}px`,
              }}
            >
              <div className="w-2.5 h-2.5 bg-tech-blue rounded-full animate-ping" />
            </div>

            {/* Logo on the top right of the hover modal overlay */}
            <div className="absolute top-6 right-6 z-[110] pointer-events-auto w-24 h-12">
              <LogoMark fixed={false} variant="auto" animate={false} className="w-full h-full" />
            </div>

            {/* Gesture Tip Overlay */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
              <span className="font-sans text-[12px] opacity-40">
                DRAG FINGER TO ITEM / RELEASE TO CONFIRM
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
