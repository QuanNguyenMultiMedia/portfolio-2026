"use client";

// A photo's full view over the garden: the print grows from its slot to the full height of the screen, alone on
// the paper. A click anywhere, the close mark or Escape puts it back.
import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { GardenEntry } from "@/data/garden";
import Portal from "@/components/Portal";
import { fx } from "@/lib/designSystem";

// the portal mounts a render later than the pane, so focus moves in when the close mark itself mounts
const focusOnMount = (el: HTMLButtonElement | null) => el?.focus({ preventScroll: true });

export default function PhotoView({ entry, onClose }: { entry: GardenEntry; onClose: () => void }) {

  useEffect(() => {
    const from = document.activeElement as HTMLElement | null;
    return () => from?.focus({ preventScroll: true });
  }, []);

  return (
    <Portal>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={entry.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: fx.easeSharp }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-background cursor-zoom-out"
      >
        <button
          ref={focusOnMount}
          onClick={onClose}
          aria-label="Close"
          className="absolute top-6 right-6 md:top-10 md:right-10 z-[102] p-2 hover:opacity-40 transition-opacity cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      </motion.div>

      <div className="fixed inset-0 z-[101] pointer-events-none flex items-center justify-center p-6 md:p-12">
        <motion.div
          layoutId={`photo-${entry.slug}`}
          transition={{ duration: 0.8, ease: fx.easeSharp }}
          className="relative h-full max-h-full aspect-[2/3] max-w-full"
        >
          <Image src={entry.image} alt={entry.title} fill priority sizes="(max-width: 768px) 100vw, 60vh"
            className="object-contain mix-blend-print" />
        </motion.div>
      </div>
    </Portal>
  );
}
