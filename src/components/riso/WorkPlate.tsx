"use client";
// Home · one piece of a project's cover, printed at its real aspect ratio. Footage loops only while its sheet
// holds the view (useSheetLive) and holds its poster under reduced motion; stills go through next/image.
// Decorative here: the sheet's title link names the project, so the plate carries no label of its own.
import { useEffect, useRef } from "react";
import Image from "next/image";
import { mediaMeta } from "@/data/workMedia";
import { useSheetLive } from "@/hooks/useSheetLive";

export default function WorkPlate({ src, poster }: { src: string; poster?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const live = useSheetLive(box);
  const m = mediaMeta(src);
  const isVideo = m?.video ?? src.endsWith(".mp4");
  const w = m?.w ?? 16, h = m?.h ?? 9;

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (live && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.play().catch(() => {});
    else v.pause();
  }, [live]);

  return (
    <div ref={box} className="work-plate printed" style={{ "--ar": w / h } as React.CSSProperties}>
      {isVideo ? (
        <video ref={video} src={src} poster={poster ?? m?.poster} muted loop playsInline preload="none" />
      ) : (
        <Image src={src} alt="" width={w} height={h} sizes="(max-width: 640px) 100vw, 66vw" />
      )}
    </div>
  );
}
