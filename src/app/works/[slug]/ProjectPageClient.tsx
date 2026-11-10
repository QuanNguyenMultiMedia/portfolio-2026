"use client";

import { useRef, use } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import { t } from "@/lib/designSystem";
import { notFound } from "next/navigation";
import useLenis from "@/hooks/useLenis";
import { useScreenSize } from "@/hooks/useScreenSize";
import dynamic from "next/dynamic";
import WorkMedia, { mediaAspect } from "@/components/WorkMedia";
import BleedName from "@/components/riso/BleedName";
import { Head, Plate, Lanes, Rail, type Screen, type SectionProps } from "@/components/works/kit";
import Process from "@/components/works/Process";
import Loops from "@/components/works/Loops";
import Evolution from "@/components/works/Evolution";
import Library from "@/components/works/Library";
import Matrix from "@/components/works/Matrix";
import Feed from "@/components/works/Feed";
import Store from "@/components/works/Store";
import Roster from "@/components/works/Roster";
import Ledger from "@/components/works/Ledger";
import Timeline from "@/components/works/Timeline";
import Variants from "@/components/works/Variants";

const MuxPlayerWrapper = dynamic(() => import("@/components/MuxPlayerWrapper"), {
  ssr: false,
});

// Each section type is a module in components/works, shaped by what its media is (see projects.ts). Every
// media frame is sized from the work's own aspect ratio, so footage is only ever scaled, never cropped. Copy
// comes from projects.ts only.
const MODULES: Partial<Record<Screen["type"], (p: SectionProps) => React.ReactNode>> = {
  process: Process,
  loops: Loops,
  evolution: Evolution,
  library: Library,
  matrix: Matrix,
  feed: Feed,
  store: Store,
  roster: Roster,
  ledger: Ledger,
  timeline: Timeline,
  variants: Variants,
};

// Photo essays and mixed print sets: `feature` stands its first piece at full height, the rest as lanes after it.
function Breakdown({ screen, isMobile, ink, n }: SectionProps) {
  const images = (screen.images ?? []).map((src) => ({ src }));
  const feature = (screen.layout ?? "wall") === "feature";
  const [hero, ...rest] = feature ? images : [undefined, ...images];

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-4)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        {hero && <Plate src={hero.src} size={{ w: "100%" }} sizes="100vw" className="wk-in" />}
        {rest.length > 0 && <Rail items={rest as { src: string }[]} captions={false} />}
      </div>
    );
  }

  return (
    <div className="h-full py-16 pb-24 flex items-center gap-[var(--s-6)]">
      <Head screen={screen} ink={ink} n={n} />
      {hero && (
        <div className="wk-in self-center">
          <Plate src={hero.src} size={{ fit: ["56vw", "70vh"] }} sizes="56vw" />
        </div>
      )}
      {rest.length > 0 && <Lanes items={rest as { src: string }[]} height={rest.length > 3 ? 70 : 52} captions={false} start={1} />}
    </div>
  );
}

// The film the section is about, at its own aspect, its caption set beside it rather than over it.
function Film({ screen, isMobile, ink, n }: SectionProps) {
  const local = screen.src?.startsWith("/");
  const film = local ? (
    <div className="wk-in self-center">
      <Plate src={screen.src!} tone="dark" sizes="80vw" size={isMobile ? { w: "100%" } : { fit: [screen.title ? "62vw" : "78vw", "72vh"] }} alt={screen.title} />
    </div>
  ) : (
    <div className={isMobile ? "w-full aspect-video relative" : "h-[72vh] aspect-video relative"}>
      <MuxPlayerWrapper playbackId={screen.src || ""} className="w-full h-full object-contain" />
    </div>
  );
  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-4)]">
        {screen.title && <Head screen={screen} ink={ink} n={n} variant="stack" />}
        {film}
      </div>
    );
  }
  return (
    <div className="h-full py-16 pb-24 flex items-center gap-[var(--s-6)]">
      {screen.title && <Head screen={screen} ink={ink} n={n} />}
      {film}
    </div>
  );
}

// A working build shown as its capture: the capture large, the head beside it.
function InteractivePreview({ screen, isMobile, ink, n }: SectionProps) {
  return (
    <div className={isMobile ? "w-full flex flex-col gap-[var(--s-4)]" : "h-full py-16 pb-24 flex items-center gap-[var(--s-6)]"}>
      <Head screen={screen} ink={ink} n={n} variant={isMobile ? "stack" : "column"} />
      <div className="wk-in self-center">
        <Plate src={screen.src || ""} tone="dark" sizes={isMobile ? "100vw" : "60vw"} size={isMobile ? { w: "100%" } : { fit: ["58vw", "72vh"] }} alt={screen.title} />
      </div>
    </div>
  );
}

export default function ProjectPageClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const screenSize = useScreenSize();
  const isMobile = screenSize === "mobile";

  const scrollRef = useRef<HTMLDivElement>(null);
  const lenisRef = useLenis({
    wrapperRef: isMobile ? undefined : scrollRef,
    contentQuery: isMobile ? undefined : ".lenis-content",
    orientation: isMobile ? "vertical" : "horizontal",
    gestureOrientation: isMobile ? "vertical" : "both",
    wheelMultiplier: 0.7,
    lerp: 0.11,
    autoAssign: false,
  });

  // Drag-to-scroll lives in refs, not state: a pointermove re-rendering the whole spread every
  // frame is what made it stutter. 1:1 with the pointer while held, then a flick carries on
  // through Lenis's own easing. A drag past the threshold swallows the click it ends on.
  const drag = useRef({ active: false, moved: false, x: 0, scroll: 0, lastX: 0, lastT: 0, v: 0 });

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const screens = project.screens;
  // Landscape cover footage gets the wider column, so it never reads as a postage stamp.
  const print = project.print ?? { fountain: "mint", deck: "ink-violet" };
  // sections that carry a head are numbered in reading order
  let count = 0;
  const numbers = screens.map((s) => (s.title && s.type !== "zine-cover" && s.type !== "zine-outro" ? ++count : undefined));
  const coverWide = mediaAspect(project.coverVideo || project.coverImage || "") > 1.2;
  const next = projects[(projects.findIndex((p) => p.slug === slug) + 1) % projects.length];

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !lenisRef.current) return;
    lenisRef.current.stop();
    lenisRef.current.start();
    drag.current = { active: true, moved: false, x: e.clientX, scroll: lenisRef.current.scroll, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active || !lenisRef.current) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 6) return;
    if (!d.moved) {
      d.moved = true;
      scrollRef.current?.setPointerCapture(e.pointerId);
      if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
    }
    const dt = Math.max(e.timeStamp - d.lastT, 1);
    d.v = 0.8 * ((e.clientX - d.lastX) / dt) + 0.2 * d.v;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    lenisRef.current.scrollTo(d.scroll - dx, { immediate: true });
  };

  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "";
    if (scrollRef.current?.hasPointerCapture(e.pointerId)) scrollRef.current.releasePointerCapture(e.pointerId);
    if (!d.moved || !lenisRef.current) return;
    // Flick: a stale velocity (pointer held still before release) carries nothing.
    const v = e.timeStamp - d.lastT > 80 ? 0 : Math.max(-3, Math.min(3, d.v));
    if (v) lenisRef.current.scrollTo(lenisRef.current.scroll - v * 220);
  };

  const swallowClickAfterDrag = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div
      ref={scrollRef}
      onPointerDown={isMobile ? undefined : handlePointerDown}
      onPointerMove={isMobile ? undefined : handlePointerMove}
      onPointerUp={isMobile ? undefined : endDrag}
      onPointerCancel={isMobile ? undefined : endDrag}
      onClickCapture={isMobile ? undefined : swallowClickAfterDrag}
      onDragStart={isMobile ? undefined : (e) => e.preventDefault()}
      data-lenis-prevent={isMobile ? undefined : ""}
      className={
        isMobile
          ? "relative bg-background w-full min-h-screen overflow-y-auto"
          : "relative bg-background h-screen w-full overflow-hidden select-none cursor-grab"
      }
    >
      <div
        data-axis={isMobile ? "block" : "inline"}
        className={
          isMobile
            ? "lenis-content w-full h-auto flex flex-col items-stretch px-6 py-16 gap-16"
            : "lenis-content h-screen w-fit flex items-stretch"
        }
      >
        {screens.map((screen, i) => {
          const Module = MODULES[screen.type];
          const sp: SectionProps = { screen, isMobile, ink: print.deck, n: numbers[i] };
          const spread = screen.type === "zine-cover" || screen.type === "zine-outro";
          return (
          <section
            key={i}
            aria-label={screen.title}
            className={
              isMobile
                ? "w-full flex items-center justify-center relative isolate overflow-x-clip py-8"
                : `flex-shrink-0 h-screen flex items-center justify-center relative isolate px-12 md:px-24 3xl:px-40 4xl:px-48 border-r border-primary/25 ${
                    spread ? "overflow-x-clip" : ""
                  } ${screen.type === "zine-cover" ? "w-[85vw] 3xl:w-[80vw]" : ""} ${
                    screen.type === "zine-outro" ? "w-[100vw]" : ""
                  } ${screen.type === "editorial-text" ? "min-w-[65vw] 3xl:min-w-[60vw]" : ""}`
            }
          >
            {/* ZINE COVER SCREEN */}
            {screen.type === "zine-cover" && (
              <div
                className={
                  isMobile
                    ? "w-full flex flex-col gap-6"
                    : "w-full h-full py-16 grid grid-cols-12 gap-12 items-center"
                }
              >
                {/* Desktop Left: running metadata */}
                {!isMobile && (
                  <div className="col-span-3 h-full flex flex-col justify-between border-r border-primary/25 pr-8">
                    <div className="space-y-4">
                      <div className="text-[12px] font-sans text-primary">{project.category}</div>
                      <div className="text-[12px] font-sans opacity-40">
                        YEAR / {project.year}
                      </div>
                      <div className="text-[12px] font-sans opacity-40">
                        CLIENT / {project.client}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-1.5">
                        {project.services?.map((svc, sIdx) => (
                          <span
                            key={sIdx}
                            className={`${t.metaDataLabel} opacity-70`}
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* The name bleeds off the spread's trim, the cover prints over its tail, the deck overprints
                    both (MainTitle.aep end comps) */}
                <div
                  data-axis={isMobile ? "block" : "inline"}
                  className={isMobile ? "w-full flex flex-col pt-10" : "col-span-9 h-full flex flex-col justify-center pl-4"}
                >
                  <BleedName title={project.title} print={print} />
                  <div
                    className={
                      isMobile
                        ? "flex flex-col gap-8 -mt-[calc(var(--t-bleed)*0.16)]"
                        : "flex items-start gap-[var(--s-5)] -mt-[calc(var(--t-bleed)*0.36)]"
                    }
                  >
                    <div className={`deck ${isMobile ? "" : "flex-1 min-w-0"}`}>
                      <p className={`plate ${print.deck}`}>{project.description}</p>
                    </div>
                    {(project.coverVideo || project.coverImage) && (
                      <div
                        className={`relative z-[1] flex-shrink-0 border border-primary/25 bg-background ${
                          isMobile
                            ? "w-4/5 self-end p-2"
                            : `${coverWide ? "w-[42%]" : "w-[26%]"} -mt-[calc(var(--t-bleed)*0.3)] max-h-[60vh] p-3 md:p-4`
                        }`}
                        style={{ aspectRatio: `${mediaAspect(project.coverVideo || project.coverImage || "")}` }}
                      >
                        <div className="relative w-full h-full">
                          <WorkMedia
                            src={project.coverVideo || project.coverImage || ""}
                            alt={project.title}
                            sizes="(max-width: 768px) 80vw, 30vw"
                            priority
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* EDITORIAL: the opening paragraph set as a lead in the display face, the rest as reading text under it */}
            {screen.type === "editorial-text" && (() => {
              const [lead, ...rest] = (screen.content ?? "").split("\n\n");
              return (
                <div
                  className={
                    isMobile
                      ? "w-full flex flex-col gap-[var(--s-4)]"
                      : "w-full h-full py-16 pb-24 grid grid-cols-12 gap-x-[var(--s-5)] content-center"
                  }
                >
                  <p className={`wk-in font-display text-[length:var(--t-lead-serif)] leading-[1.04] tracking-[-0.01em] text-foreground ${isMobile ? "" : "col-span-9 max-w-[24ch]"}`}>
                    {lead}
                  </p>
                  {rest.length > 0 && (
                    <div
                      className={`wk-in ${t.bodyProse} text-foreground space-y-[var(--s-2)] max-w-[38ch] ${isMobile ? "" : "col-start-7 col-span-6 mt-[var(--s-5)]"}`}
                      style={{ "--i": 2 } as React.CSSProperties}
                    >
                      {rest.map((para, k) => (
                        <p key={k}>{para}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {screen.type === "deliverable-breakdown" && <Breakdown {...sp} />}
            {screen.type === "video" && <Film {...sp} />}
            {screen.type === "interactive-preview" && <InteractivePreview {...sp} />}
            {Module && <Module {...sp} />}

            {/* OUTRO: the end comp (05/08/11). Credits, the name bled across the sheet (or standing in columns),
                the line of the job overprinting it, and the way on to the next project */}
            {screen.type === "zine-outro" && (
              <div
                data-axis={isMobile ? "block" : "inline"}
                className={
                  isMobile
                    ? "w-full py-12 grid grid-cols-1 gap-y-8"
                    : print.stack
                      ? "w-full h-full py-16 grid grid-cols-12 grid-rows-[auto_1fr_auto] gap-x-12"
                      : "w-full h-full py-16 grid grid-cols-12 grid-rows-[auto_1fr_auto_auto_1fr_auto] gap-x-12"
                }
              >
                <div
                  className={`space-y-2 text-[12px] font-sans text-foreground ${
                    isMobile ? "" : print.stack ? "col-start-8 col-span-5 row-start-1" : "col-start-1 col-span-4 row-start-1"
                  }`}
                >
                  <div>CLIENT / {project.client}</div>
                  <div>ROLE / {project.role}</div>
                  <div>YEAR / {project.year}</div>
                </div>

                <BleedName
                  as="div"
                  title={project.title}
                  print={print}
                  stack={print.stack && !isMobile}
                  className={isMobile ? "" : print.stack ? "col-start-1 col-span-6 row-start-1 row-span-3 self-center" : "col-start-1 col-span-12 row-start-3"}
                />
                <div
                  className={`deck is-lg ${
                    isMobile
                      ? "-mt-[calc(var(--t-bleed)*0.16+2rem)]"
                      : print.stack
                        ? "col-start-1 col-span-5 row-start-1 row-span-3 self-center"
                        : "col-start-1 col-span-10 row-start-4 -mt-[calc(var(--t-bleed)*0.45)]"
                  }`}
                >
                  <p className={`plate ${print.deck}`}>
                    {project.client}, {project.year} — {project.role}.
                  </p>
                </div>

                <Link
                  href={`/works/${next.slug}`}
                  className={`group grid grid-cols-[auto_1fr] items-end gap-6 ${
                    isMobile ? "" : print.stack ? "col-start-8 col-span-5 row-start-3" : "col-start-8 col-span-5 row-start-6"
                  }`}
                >
                  <Plate
                    src={next.coverVideo || next.coverImage || ""}
                    sizes="20vw"
                    className="transition-transform duration-500 group-hover:scale-[1.02]"
                    size={{ fit: [isMobile ? "40vw" : "14vw", isMobile ? "30vw" : "22vh"] }}
                  />
                  <span className="space-y-3">
                    <span aria-hidden className="block text-2xl text-foreground group-hover:text-primary group-hover:translate-x-2 transition-[color,transform] duration-500">→</span>
                    <span className={`block ${t.cardTitle} text-foreground group-hover:text-primary transition-colors duration-500`}>
                      {next.title}
                    </span>
                  </span>
                </Link>
              </div>
            )}

          </section>
          );
        })}
      </div>
    </div>
  );
}
