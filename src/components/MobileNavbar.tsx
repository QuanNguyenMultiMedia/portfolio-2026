"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LogoMark from "./LogoMark";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Works", path: "/works" },
  { name: "Takes", path: "/takes" },
  { name: "Play", path: "/play" },
  { name: "Freebies", path: "/freebies" },
  { name: "Contacts", path: "/contacts" },
];

export default function MobileNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const interacted = localStorage.getItem("mq_menu_interacted") === "true";
      setHasInteracted(interacted);
    }
  }, []);
  
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [touchCenter, setTouchCenter] = useState({ x: 0, y: 0 });
  const [currentTouch, setCurrentTouch] = useState({ x: 0, y: 0 });

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

  // Compute active item label matching the desktop breadcrumbs exactly
  const directory = "MINHQUAN";
  let title = "HOME";

  if (pathname === "/") {
    title = "HOME";
  } else {
    const activeItem = navItems.find(
      (item) => item.path !== "/" && pathname.startsWith(item.path)
    );
    if (activeItem) {
      const section = activeItem.name.toUpperCase();
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length > 1) {
        const slug = segments[1].toUpperCase().replace(/-/g, "_");
        title = `${section} // ${slug}`;
      } else {
        title = section;
      }
    }
  }
  const breadcrumb = `${directory} // ${title}`;

  // Spreading 6 items in an arc from 180 degrees (straight left) to 270 degrees (straight up)
  const radius = 175; // Radius in pixels
  const startAngle = 180;
  const endAngle = 270;
  const angleStep = (endAngle - startAngle) / (navItems.length - 1); // 18 degrees per step

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

  const handleStart = (clientX: number, clientY: number) => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setTouchCenter({ x: cx, y: cy });
      setCurrentTouch({ x: cx, y: cy });
    }
    setIsOpen(true);
    setActiveIndex(null);

    // Audio click
    playTick();
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isOpen) return;
    setCurrentTouch({ x: clientX, y: clientY });

    const dx = clientX - touchCenter.x;
    const dy = clientY - touchCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only select if finger is dragged outwards
    if (distance > 60 && distance < 280) {
      // Calculate angle in degrees
      let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (angle < 0) angle += 360;

      // Map drag angle to nearest menu item index
      let targetIndex = null;
      let minDiff = Infinity;

      navItems.forEach((_, i) => {
        const itemAngle = startAngle + i * angleStep;
        let diff = Math.abs(angle - itemAngle);
        if (diff > 180) diff = 360 - diff;
        if (diff < minDiff) {
          minDiff = diff;
          targetIndex = i;
        }
      });

      // Clamp target within angular threshold (max 22 degrees away)
      if (minDiff < 22 && targetIndex !== null) {
        if (targetIndex !== activeIndex) {
          setActiveIndex(targetIndex);
          playTick();
        }
      } else {
        setActiveIndex(null);
      }
    } else {
      setActiveIndex(null);
    }
  };

  const handleEnd = () => {
    if (!isOpen) return;
    if (activeIndex !== null) {
      const target = navItems[activeIndex];
      router.push(target.path);
      playSuccess();
      localStorage.setItem("mq_menu_interacted", "true");
      setHasInteracted(true);
    }
    setIsOpen(false);
    setActiveIndex(null);
  };

  // Synthesize micro mechanical ticking for finger rolls
  const playTick = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
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
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
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
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseMoveGlobal = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    window.addEventListener("touchmove", handleTouchMoveGlobal, { passive: true });
    window.addEventListener("mousemove", handleMouseMoveGlobal);
    window.addEventListener("touchend", handleEnd);
    window.addEventListener("mouseup", handleEnd);

    return () => {
      window.removeEventListener("touchmove", handleTouchMoveGlobal);
      window.removeEventListener("mousemove", handleMouseMoveGlobal);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("mouseup", handleEnd);
    };
  }, [isOpen, touchCenter, activeIndex]);

  return (
    <>
      {/* Floating Status Notch / Trigger Button */}
      <div className="fixed bottom-10 left-6 right-6 z-50 md:hidden pointer-events-none">
        <div className="w-full bg-surface/50 backdrop-blur-xl border border-primary/10 px-5 py-4 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-16 h-8 flex-shrink-0">
              <LogoMark fixed={false} variant="auto" animate={false} className="w-full h-full" />
            </div>
            <span className="font-mono text-[8px] tracking-[0.2em] opacity-60 uppercase">{breadcrumb}</span>
          </div>

          <button
            ref={triggerRef}
            onTouchStart={(e) => {
              e.preventDefault();
              if (e.touches.length > 0) {
                handleStart(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              handleStart(e.clientX, e.clientY);
            }}
            className={`font-mono text-[10px] tracking-[0.3em] uppercase border border-primary/25 py-3.5 bg-surface/20 active:bg-primary active:text-background transition-all duration-300 focus:outline-none min-h-[44px] select-none cursor-pointer ${
              hasInteracted ? "min-w-[44px] px-3" : "min-w-[100px] px-5"
            }`}
          >
            {hasInteracted ? "[ ]" : "[ HOLD MENU ]"}
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
            className="fixed inset-0 bg-background/70 backdrop-blur-md z-[100] md:hidden pointer-events-none flex items-center justify-center overflow-hidden"
          >
            {/* Ambient subtle glow ring */}
            <div 
              className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-primary/5 pointer-events-none animate-[spin_60s_linear_infinite]"
              style={{
                left: `${touchCenter.x - 180}px`,
                top: `${touchCenter.y - 180}px`,
              }}
            />

            {/* Pointer Ray Vector Line pointing from thumb to finger */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <line
                x1={touchCenter.x}
                y1={touchCenter.y}
                x2={currentTouch.x}
                y2={currentTouch.y}
                stroke="var(--tech-blue)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-40"
              />
              <circle
                cx={currentTouch.x}
                cy={currentTouch.y}
                r="6"
                fill="var(--tech-blue)"
                className="opacity-60"
              />
            </svg>

            {/* Radial Arc Options */}
            {navItems.map((item, i) => {
              const coords = getCoordinates(i);
              const isCurrent = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
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
                    className={`w-20 h-10 flex items-center justify-center font-mono text-[9px] tracking-[0.15em] uppercase border transition-all duration-300 relative overflow-visible ${
                      isSelected
                        ? "bg-tech-blue border-tech-blue text-background scale-110"
                        : isCurrent
                          ? "bg-surface/80 border-tech-blue/50 text-tech-blue"
                          : "bg-surface/30 backdrop-blur-xl border-primary/10 text-primary/70"
                    }`}
                  >
                    <span
                      className={`transition-all duration-300 whitespace-nowrap px-2 py-1 ${
                        isSelected
                          ? "-translate-y-8 text-tech-blue font-bold scale-110 bg-surface/90 border border-tech-blue/30 backdrop-blur-md"
                          : ""
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Center Anchor Point */}
            <div
              className="absolute w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center z-10 pointer-events-none bg-surface/20"
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
              <span className="font-mono text-[8px] tracking-[0.3em] uppercase opacity-40">
                DRAG FINGER TO ITEM // RELEASE TO CONFIRM
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
