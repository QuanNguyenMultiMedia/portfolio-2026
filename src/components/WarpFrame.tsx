"use client";
// The frame: a 1px hairline rectangle inset to the page margin, a golden-ratio pair of guides, and a plain
// route index in the caption. It takes no pointer input and is decorative, except the caption, which is
// announced politely on route change. KeyFlight is mounted here so the keys live with the frame.
import "@/styles/hud.css";
import { usePathname } from "next/navigation";
import { DESTS, destKey } from "@/lib/warp";
import KeyFlight from "./KeyFlight";


export default function WarpFrame() {
  const pathname = usePathname();
  const key = destKey(pathname);
  const hint = key === "" ? "W S · A D · Space" : "A D";

  return (
    <div className="warp-frame" style={{ viewTransitionName: "frame" }}>
      <svg className="warp-frame-svg" aria-hidden="true" preserveAspectRatio="none">
        <rect className="warp-frame-box" />
        <rect className="warp-notch warp-notch-tl-h" />
        <rect className="warp-notch warp-notch-tl-v" />
        <rect className="warp-notch warp-notch-tr-h" />
        <rect className="warp-notch warp-notch-tr-v" />
        <rect className="warp-notch warp-notch-bl-h" />
        <rect className="warp-notch warp-notch-bl-v" />
        <rect className="warp-notch warp-notch-br-h" />
        <rect className="warp-notch warp-notch-br-v" />
      </svg>
      <p className="warp-caption" aria-live="polite">
        <span>
          {DESTS[key].label}
        </span>
        <span className="warp-hint">{hint}</span>
      </p>
      <KeyFlight />
    </div>
  );
}
