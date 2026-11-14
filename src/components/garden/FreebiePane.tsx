"use client";

// A freebie's pane over the garden: the print flies from its slot to the left of the sheet, the pane slides in from
// the right with what is in the file and the download. Portaled, so no transformed ancestor contains it.
import { useEffect } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import type { FreebieItem } from "@/data/freebies";
import HUDLabel from "@/components/HUDLabel";
import TechButton from "@/components/TechButton";
import LogoMark from "@/components/LogoMark";
import Portal from "@/components/Portal";
import { useScreenSize } from "@/hooks/useScreenSize";
import { t, fx } from "@/lib/designSystem";

// the portal mounts a render later than the pane, so focus moves in when the close mark itself mounts
const focusOnMount = (el: HTMLButtonElement | null) => el?.focus({ preventScroll: true });

export default function FreebiePane({ item, onClose }: { item: FreebieItem; onClose: () => void }) {
  const screenSize = useScreenSize();
  const panelWidth = screenSize === "4xl" ? 680 : screenSize === "3xl" ? 540 : 420;
  const unavailable = item.downloadUrl === "#";

  // focus moves into the pane and returns to the piece that opened it
  useEffect(() => {
    const from = document.activeElement as HTMLElement | null;
    return () => from?.focus({ preventScroll: true });
  }, []);

  return (
    <Portal>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background z-[100] cursor-zoom-out"
      />

      <div
        className="hidden md:flex fixed inset-0 z-[102] pointer-events-none items-center justify-center"
        style={{ paddingRight: `${panelWidth}px` }}
      >
        <m.div
          layoutId={`thumb-${item.slug}`}
          className="relative w-[45vw] max-w-[55vh] h-[65vh] overflow-hidden bg-foreground/5 border border-primary/25"
          transition={{ duration: 0.8, ease: fx.easeSharp }}
        >
          <Image src={item.image} alt={item.title} fill loading="eager" referrerPolicy="no-referrer"
            sizes="50vw" className="object-cover mix-blend-print" />
        </m.div>
      </div>

      <m.div
        initial={{ clipPath: "inset(0 0 0 100%)" }}
        animate={{ clipPath: `inset(0 0 0 calc(100% - ${panelWidth}px))` }}
        exit={{ clipPath: "inset(0 0 0 100%)" }}
        transition={{ duration: 0.6, ease: fx.easeSharp }}
        className="fixed inset-0 z-[110] pointer-events-none hidden md:block"
      >
        <LogoMark variant="auto" animate={false} className="!z-[110]" />
      </m.div>

      <m.div
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.6, ease: fx.easeSharp }}
        className="fixed top-0 right-0 bottom-0 bg-background border-l border-primary/25 z-[101] flex flex-col"
        style={{ width: screenSize === "mobile" ? "100%" : `${panelWidth}px` }}
      >
        <div className="p-8 md:p-12 pb-4 3xl:p-16 3xl:pb-6 4xl:p-20 4xl:pb-8 flex justify-between items-center border-b border-primary/25">
          <HUDLabel text={item.category} className="!opacity-60" />
          <button
            ref={focusOnMount}
            onClick={onClose}
            aria-label="Close"
            className="p-2 hover:opacity-40 transition-opacity z-[111] cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        </div>

        <div data-lenis-prevent className="flex-grow p-8 md:p-12 3xl:p-16 4xl:p-20 flex flex-col justify-start md:justify-center space-y-8 md:space-y-12 3xl:space-y-16 4xl:space-y-24 overflow-y-auto">
          <div className="block md:hidden w-full aspect-[16/10] relative overflow-hidden bg-primary/5 border border-primary/25">
            <Image src={item.image} alt={item.title} fill referrerPolicy="no-referrer" sizes="100vw"
              className="object-cover mix-blend-print" />
          </div>

          <h2 className={`${t.cardTitle} text-primary`}>{item.title}</h2>

          <div className="space-y-4 max-w-md 3xl:max-w-lg 4xl:max-w-2xl">
            {item.description.split("\n\n").map((para, i) => (
              <p key={i} className={t.bodyProse}>{para}</p>
            ))}
          </div>

          <div className="flex gap-2">
            {item.colors.map((color) => (
              <div key={color} title={color} style={{ backgroundColor: color }}
                className="w-6 h-6 3xl:w-9 3xl:h-9 4xl:w-12 4xl:h-12 border border-primary/25" />
            ))}
          </div>
        </div>

        <div className="p-8 md:p-12 pt-4 3xl:p-16 3xl:pt-6 4xl:p-20 4xl:pb-8 border-t border-primary/25">
          <TechButton
            href={item.downloadUrl}
            disabled={unavailable}
            className="w-full !py-6 3xl:!py-8 4xl:!py-10 3xl:text-lg 4xl:text-xl"
          >
            {unavailable ? "Download / Unavailable" : "Download / Free"}
          </TechButton>
        </div>
      </m.div>
    </Portal>
  );
}
