"use client";

import { useRef, use, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { projects, type Project } from "@/data/projects";

type Screen = Project["screens"][number];
import { t, fx } from "@/lib/designSystem";
import { notFound } from "next/navigation";
import useLenis from "@/hooks/useLenis";
import { useScreenSize } from "@/hooks/useScreenSize";
import dynamic from "next/dynamic";
import WorkMedia, { mediaAspect } from "@/components/WorkMedia";
import BleedName from "@/components/riso/BleedName";

const MuxPlayerWrapper = dynamic(() => import("@/components/MuxPlayerWrapper"), {
  ssr: false,
});

// Every media frame below is sized from the work's own aspect ratio (mediaAspect), so footage is
// only ever scaled, never cropped. Copy comes from projects.ts only.

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * A matted print of one piece of work, sized by height; width follows the media. `fit` instead
 * contains it in a max width × max height box, so very wide or tall work never letterboxes.
 */
function Plate({
  src,
  className = "",
  sizes = "40vw",
  dark = false,
  thin = false,
  fit,
  style,
}: {
  src: string;
  style?: React.CSSProperties;
  className?: string;
  sizes?: string;
  dark?: boolean;
  thin?: boolean;
  fit?: { w: string; h: string };
}) {
  const aspect = mediaAspect(src);
  return (
    <div
      className={`relative flex-shrink-0 border border-primary/25 ${thin ? "p-1" : "p-2 md:p-3"} ${dark ? "bg-foreground" : "bg-background"} ${className}`}
      style={{ aspectRatio: `${aspect}`, ...style, ...(fit && { width: `min(${fit.w}, calc(${fit.h} * ${aspect}))` }) }}
    >
      <div className="relative w-full h-full">
        <WorkMedia src={src} sizes={sizes} />
      </div>
    </div>
  );
}

function SplitGallery({ screen, isMobile }: { screen: Screen; isMobile: boolean }) {
  const images: string[] = screen.images ?? [];
  const [activeImage, setActiveImage] = useState(images[0] || "");

  const thumbs = (size: string) =>
    images.map((img, idx) => (
      <button
        type="button"
        key={img}
        aria-label={`${screen.title} ${idx + 1}`}
        aria-pressed={activeImage === img}
        onMouseEnter={() => setActiveImage(img)}
        onFocus={() => setActiveImage(img)}
        onClick={() => setActiveImage(img)}
        className={`relative flex-shrink-0 aspect-square border bg-foreground p-1 cursor-pointer transition-[opacity,border-color] duration-300 ${size} ${
          activeImage === img ? "border-primary" : "border-primary/25 opacity-80 hover:opacity-100"
        }`}
      >
        <span className="relative block w-full h-full">
          <WorkMedia src={img} sizes="96px" />
        </span>
      </button>
    ));

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-6">
        <h3 className={`${t.cardTitle} text-primary`}>{screen.title}</h3>
        <p className={t.bodyProse}>{screen.description}</p>
        <Plate src={activeImage} dark sizes="100vw" className="w-full" />
        <div className="flex gap-2 overflow-x-auto py-1">{thumbs("h-16")}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full py-16 grid grid-cols-12 gap-12 items-center">
      <div className="col-span-7 min-w-0 h-[70vh] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: fx.easeSharp }}
            className="w-full h-full flex items-center justify-center"
          >
            <Plate src={activeImage} dark sizes="50vw" fit={{ w: "100%", h: "70vh" }} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="col-span-5 min-w-0 h-[70vh] flex flex-col justify-between gap-8 pl-6 border-l border-primary/25">
        <div className="space-y-6">
          <h3 className={t.cardTitle}>{screen.title}</h3>
          <p className={t.bodyProse}>{screen.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">{thumbs("h-20 3xl:h-24")}</div>
      </div>
    </div>
  );
}

// Media wall for large sets. Lanes are contiguous runs of the data order (which groups work by
// app/campaign), cut where each lane's total aspect is closest to an equal share, so lanes end near
// the same length. Plates keep their own aspect: lanes share a height and only widths vary.
function balanceLanes(images: string[], laneCount: number) {
  const total = images.reduce((sum, img) => sum + mediaAspect(img), 0);
  const lanes: string[][] = [[]];
  let run = 0;
  for (const img of images) {
    const share = (total / laneCount) * lanes.length;
    const a = mediaAspect(img);
    if (lanes.length < laneCount && run + a / 2 > share && lanes[lanes.length - 1].length) lanes.push([]);
    lanes[lanes.length - 1].push(img);
    run += a;
  }
  const lengths = lanes.map((l) => l.reduce((sum, img) => sum + mediaAspect(img), 0));
  return { lanes, longest: Math.max(...lengths) };
}

// A second lane once one lane would run past ~5 frame-heights of width; sections are cut from the
// AE boards so none needs a third.
const wallLanes = (images: string[]) =>
  images.reduce((sum, img) => sum + mediaAspect(img), 0) > 5 ? 2 : 1;

function MediaWall({ images, height }: { images: string[]; height?: number }) {
  const laneCount = wallLanes(images);
  height ??= laneCount === 2 ? 82 : 70;
  const { lanes, longest } = balanceLanes(images, laneCount);
  const gapRem = 0.75;
  const laneVh = (height - (laneCount - 1) * 2) / laneCount;
  return (
    <div
      className="flex-shrink-0 flex flex-col justify-center"
      style={{ gap: `${gapRem}rem`, width: `calc(${longest} * ${laneVh}vh + ${Math.max(...lanes.map((l) => l.length))}rem)` }}
    >
      {lanes.map((lane, li) => (
        <div key={li} className="flex items-end" style={{ gap: `${gapRem}rem`, height: `${laneVh}vh` }}>
          {lane.map((img) => (
            <Plate key={img} src={img} sizes="25vw" thin className="h-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Titled media wall: bento-moodboard and timeline-sequence share it.
function BentoMoodboard({ screen, isMobile }: { screen: Screen; isMobile: boolean }) {
  const images: string[] = screen.images ?? [];

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-6">
        <h3 className={`${t.cardTitle} text-primary`}>{screen.title}</h3>
        <p className={t.bodyProse}>{screen.description}</p>
        <div className="-mx-6 px-6 overflow-x-auto scrollbar-none">
          <MediaWall images={images} height={wallLanes(images) === 2 ? 58 : 40} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 h-full py-16 flex items-center gap-12">
      <div className="w-[22vw] flex-shrink-0 self-stretch flex flex-col justify-end gap-6 pr-10 border-r border-primary/25">
        <h3 className={t.cardTitle}>{screen.title}</h3>
        <p className={t.bodyProse}>{screen.description}</p>
      </div>
      <MediaWall images={images} />
    </div>
  );
}

function BreakdownText({ screen, className = "" }: { screen: Screen; className?: string }) {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <span className="font-sans text-2xl md:text-3xl font-black text-primary block">{screen.number}</span>
      <h3 className={`${t.cardTitle} text-primary`}>{screen.title}</h3>
      <div className={`${t.bodyProse} text-foreground space-y-4`}>
        {screen.description?.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
      </div>
    </div>
  );
}

// Contact sheet: a uniform set as rows of equals, filled left to right so the data order (grouped
// by app/campaign) reads like a line of text. Cells share a height; width follows each aspect.
// Fills whatever height its parent leaves under the title band. Pieces whose shape differs from
// the set (a BTS clip among medals) would blow a column open, so they stand beside the sheet.
function ContactSheet({ images, rows }: { images: string[]; rows: number }) {
  const shapeOf = (img: string) => Math.round(mediaAspect(img) * 4) / 4;
  const counts = new Map<number, number>();
  images.forEach((img) => counts.set(shapeOf(img), (counts.get(shapeOf(img)) ?? 0) + 1));
  const common = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const sheet = images.filter((img) => shapeOf(img) === common);
  const aside = images.filter((img) => shapeOf(img) !== common);
  const cols = Math.ceil(sheet.length / rows);

  // The height left under the title band varies with the description, and an aspect-ratio plate
  // sized from a percentage height reports no width to the horizontal track, so the section would
  // not grow to hold it. Measure the box once per resize and size every plate in pixels.
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxH, setBoxH] = useState(0);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBoxH(e.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const gap = 12;
  const cellH = (boxH - (rows - 1) * gap) / rows;
  const asideH = (boxH - (aside.length - 1) * gap) / Math.max(aside.length, 1);
  const sized = (img: string, h: number) => ({ height: h, width: h * mediaAspect(img) });

  return (
    <div ref={boxRef} className="h-full flex gap-10">
      {boxH > 0 && (
        <>
          <div
            className="grid"
            style={{ gap, gridTemplateColumns: `repeat(${cols}, max-content)`, gridTemplateRows: `repeat(${rows}, ${cellH}px)` }}
          >
            {sheet.map((img) => (
              <Plate key={img} src={img} sizes="20vw" thin style={sized(img, cellH)} />
            ))}
          </div>
          {aside.length > 0 && (
            <div className="flex flex-col" style={{ gap }}>
              {aside.map((img) => (
                <Plate key={img} src={img} sizes="30vw" thin style={sized(img, asideH)} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// One creative cut into formats: the tallest cut stands full height, the others stack beside it.
function FormatSets({ images, sets, height }: { images: string[]; sets: number[]; height: number }) {
  const groups: string[][] = [];
  let i = 0;
  for (const n of sets) groups.push(images.slice(i, (i += n)));
  if (i < images.length) groups.push(...images.slice(i).map((img) => [img]));
  return (
    <div className="flex items-center gap-10" style={{ height: `${height}vh` }}>
      {groups.map((g) => (
        <div key={g[0]} className="h-full flex gap-3">
          <Plate src={g[0]} sizes="20vw" thin className="h-full" />
          {g.length > 1 && (
            <div className="h-full flex flex-col justify-end gap-3">
              {g.slice(1).map((img) => (
                <Plate key={img} src={img} sizes="15vw" thin style={{ height: `calc((100% - ${(g.length - 2) * 0.75}rem) / ${g.length - 1})` }} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Breakdown({ screen, isMobile }: { screen: Screen; isMobile: boolean }) {
  const images = screen.images ?? [];
  const layout = screen.layout ?? "wall";

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-6">
        <BreakdownText screen={screen} />
        {layout === "feature" && <Plate src={images[0]} dark sizes="100vw" className="w-full" />}
        <div className="-mx-6 px-6 overflow-x-auto scrollbar-none">
          {(() => {
            const rest = layout === "feature" ? images.slice(1) : images;
            return <MediaWall images={rest} height={wallLanes(rest) === 2 ? 58 : 40} />;
          })()}
        </div>
      </div>
    );
  }

  if (layout === "grid") {
    return (
      <div className="h-full w-max pt-16 pb-28 flex flex-col gap-8">
        <div className="flex items-end gap-16 border-b border-primary/25 pb-6 min-w-[48rem]">
          <div className="flex-shrink-0 space-y-3">
            <span className="font-sans text-2xl md:text-3xl font-black text-primary block">{screen.number}</span>
            <h3 className={`${t.cardTitle} text-primary`}>{screen.title}</h3>
          </div>
          <div className={`${t.bodyProse} text-foreground w-[32rem] flex-shrink-0 space-y-4`}>
            {screen.description?.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
          </div>
        </div>
        <div className={`min-h-0 ${screen.rows === 1 ? "h-[50vh] my-auto" : "flex-1"}`}>
          <ContactSheet images={images} rows={screen.rows ?? 2} />
        </div>
      </div>
    );
  }

  const side = (
    <BreakdownText
      screen={screen}
      className="w-[22vw] flex-shrink-0 self-stretch justify-center pr-10 border-r border-primary/25"
    />
  );

  if (layout === "feature") {
    const [hero, ...rest] = images;
    return (
      <div className="h-full py-16 flex items-center gap-12">
        {side}
        <Plate src={hero} sizes="60vw" fit={{ w: "60vw", h: "72vh" }} />
        {rest.length > 0 && <MediaWall images={rest} height={rest.length > 3 ? 60 : 44} />}
      </div>
    );
  }

  return (
    <div className="h-full py-16 flex items-center gap-12">
      {side}
      {layout === "sets" ? (
        <FormatSets images={images} sets={screen.sets ?? []} height={64} />
      ) : (
        <MediaWall images={images} />
      )}
    </div>
  );
}

function InteractivePreview({ screen, isMobile }: { screen: Screen; isMobile: boolean }) {
  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-6">
        <h3 className={`${t.cardTitle} text-primary`}>{screen.title}</h3>
        <Plate src={screen.src || ""} dark sizes="100vw" className="w-full" />
        <p className={t.bodyProse}>{screen.description}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full py-16 grid grid-cols-12 gap-12 items-center">
      <div className="col-span-4 flex flex-col gap-6 pr-8 border-r border-primary/25">
        <h3 className={t.cardTitle}>{screen.title}</h3>
        <p className={t.bodyProse}>{screen.description}</p>
      </div>
      <div className="col-span-8 min-w-0 h-[70vh] flex items-center justify-center group">
        <Plate
          src={screen.src || ""}
          dark
          sizes="60vw"
          fit={{ w: "100%", h: "70vh" }}
          className="transition-transform group-hover:scale-[1.01]"
        />
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
        className={
          isMobile
            ? "lenis-content w-full h-auto flex flex-col items-stretch px-6 py-16 gap-16"
            : "lenis-content h-screen w-fit flex items-stretch"
        }
      >
        {screens.map((screen, i) => (
          <section
            key={i}
            className={
              isMobile
                ? "w-full flex items-center justify-center relative isolate overflow-x-clip py-8"
                : `flex-shrink-0 h-screen flex items-center justify-center relative isolate ${screen.type === "zine-cover" || screen.type === "zine-outro" ? "overflow-x-clip" : ""} px-12 md:px-24 3xl:px-40 4xl:px-48 border-r border-primary/25
                ${screen.type === "zine-cover" ? "w-[85vw] md:w-[85vw] 3xl:w-[80vw]" : ""}
                ${screen.type === "editorial-text" ? "min-w-[65vw] md:min-w-[65vw] 3xl:min-w-[60vw]" : ""}
                ${screen.type === "video" ? "min-w-[80vw] md:min-w-[100vw] 3xl:min-w-[90vw]" : ""}
                ${screen.type === "deliverable-breakdown" ? "min-w-[90vw]" : ""}
                ${screen.type === "split-gallery" ? "w-[95vw] md:w-[95vw] 3xl:w-[90vw]" : ""}
                ${screen.type === "bento-moodboard" ? "min-w-[100vw]" : ""}
                ${screen.type === "interactive-preview" ? "w-[95vw] md:w-[95vw] 3xl:w-[90vw]" : ""}
                ${screen.type === "timeline-sequence" ? "min-w-[100vw] md:min-w-[100vw] 3xl:min-w-[95vw]" : ""}
                ${screen.type === "zine-outro" ? "w-[100vw]" : ""}
                ${screen.type === "image" ? "min-w-[80vw] md:min-w-[100vw] 3xl:min-w-[90vw]" : ""}
                ${screen.type === "bento" ? "min-w-[100vw] md:min-w-[120vw] 3xl:min-w-[110vw]" : ""}
                ${screen.type === "details" ? "min-w-[50vw] md:min-w-[40vw] 3xl:min-w-[35vw]" : ""}
              `
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

            {/* EDITORIAL TEXT SCREEN */}
            {screen.type === "editorial-text" && (
              <div
                className={
                  isMobile
                    ? "w-full flex flex-col gap-4"
                    : "w-full h-full py-24 flex flex-col justify-center max-w-2xl 3xl:max-w-3xl 4xl:max-w-4xl"
                }
              >
                <div className="pt-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 3xl:gap-12">
                    <div className={`md:col-span-12 md:columns-2 gap-10 ${t.bodyProse} text-foreground`}>
                      {screen.content?.split("\n\n").map((para, pIdx) => (
                        <p key={pIdx} className="mb-4 inline-block w-full break-inside-avoid">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DELIVERABLE BREAKDOWN SCREEN */}
            {screen.type === "deliverable-breakdown" && (
              <Breakdown screen={screen} isMobile={isMobile} />
            )}

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
                    thin
                    className="transition-transform duration-500 group-hover:scale-[1.02]"
                    fit={{ w: isMobile ? "40vw" : "14vw", h: isMobile ? "30vw" : "22vh" }}
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

            {/* Split Gallery Component */}
            {screen.type === "split-gallery" && (
              <SplitGallery screen={screen} isMobile={isMobile} />
            )}

            {/* Video: the film at its own aspect, its caption set beside it rather than over it */}
            {screen.type === "video" && (
              <div
                className={
                  isMobile
                    ? "w-full flex flex-col gap-4"
                    : "w-full h-full py-16 flex flex-row-reverse items-center justify-end gap-12"
                }
              >
                {screen.src?.startsWith("/") ? (
                  <Plate
                    src={screen.src}
                    dark
                    sizes="80vw"
                    className={isMobile ? "w-full" : ""}
                    fit={isMobile ? undefined : { w: "62vw", h: "70vh" }}
                  />
                ) : (
                  <div className={isMobile ? "w-full aspect-video relative" : "h-[72vh] aspect-video relative"}>
                    <MuxPlayerWrapper playbackId={screen.src || ""} className="w-full h-full object-contain" />
                  </div>
                )}
                {screen.title && (
                  <div className={isMobile ? "space-y-2" : "max-w-xs self-end space-y-3 pt-4 flex-shrink-0"}>
                    <h3 className={t.cardTitle}>{screen.title}</h3>
                    {screen.description && <p className={t.bodyProse}>{screen.description}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Bento Moodboard Component */}
            {screen.type === "bento-moodboard" && (
              <BentoMoodboard screen={screen} isMobile={isMobile} />
            )}

            {/* Interactive Preview Component */}
            {screen.type === "interactive-preview" && (
              <InteractivePreview screen={screen} isMobile={isMobile} />
            )}

            {/* Timeline Sequence Component */}
            {screen.type === "timeline-sequence" && (
              <BentoMoodboard screen={screen} isMobile={isMobile} />
            )}

            {/* --- BACKWARD COMPATIBILITY FALLBACKS --- */}

            {/* Bento Spread */}
            {screen.type === "bento" && (
              <div
                className={
                  isMobile
                    ? "w-full grid grid-cols-1 gap-6 items-center"
                    : "w-full h-full py-24 md:py-32 grid grid-cols-12 gap-6 md:gap-12 items-center"
                }
              >
                <motion.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: fx.easeSharp }}
                  className={
                    isMobile
                      ? "w-full aspect-[16/10] relative overflow-hidden group border border-primary/25"
                      : "col-span-8 h-[60vh] relative overflow-hidden group border border-primary/25"
                  }
                >
                  <Image
                    src={screen.images?.[0] || ""}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain transition-transform"
                  />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                </motion.div>

                <div
                  className={
                    isMobile
                      ? "w-full grid grid-cols-2 gap-4"
                      : "col-span-4 space-y-12"
                  }
                >
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="aspect-square relative overflow-hidden border border-primary/25 group"
                  >
                    <Image
                      src={screen.images?.[1] || ""}
                      alt={`${project.title} detail`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain transition-all duration-700"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="aspect-[4/3] relative overflow-hidden border border-primary/25 group"
                  >
                    <Image
                      src={screen.images?.[2] || ""}
                      alt={`${project.title} detail secondary`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain transition-all duration-700"
                    />
                  </motion.div>
                </div>
              </div>
            )}

            {/* Single Image Spread */}
            {screen.type === "image" && (
              <div
                className={
                  isMobile
                    ? "w-full aspect-[16/10] flex items-center justify-center"
                    : "w-full h-[75vh] flex items-center justify-center"
                }
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: fx.easeSharp }}
                  className="w-full h-full relative overflow-hidden group border border-primary/25"
                >
                  <Image
                    src={screen.src || ""}
                    alt={screen.caption || project.title}
                    fill
                    sizes="100vw"
                    className="object-contain transition-transform"
                  />
                </motion.div>
              </div>
            )}

            {/* Editorial Details */}
            {screen.type === "details" && (
              <div
                className={
                  isMobile
                    ? "w-full space-y-6"
                    : "max-w-[576px] space-y-8"
                }
              >
                <div className="h-px w-16 bg-primary" />
                <h3
                  className={
                    isMobile
                      ? "text-lg md:text-xl font-light leading-relaxed text-left"
                      : t.heroTagline
                  }
                >
                  {screen.content}
                </h3>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
