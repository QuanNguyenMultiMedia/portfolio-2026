"use client";
// The frame: a 1px hairline rectangle inset to the page margin, a golden-ratio pair of guides, and a plain
// route index in the caption. It takes no pointer input and is decorative, except the caption, which is
// announced politely on route change. KeyFlight is mounted here so the keys live with the frame.
import "@/styles/hud.css";
import { usePathname } from "next/navigation";
import { DESTS, DEST_KEYS, destKey } from "@/lib/warp";
import KeyFlight from "./KeyFlight";

const pad = (n: number) => String(n).padStart(2, "0");

export default function WarpFrame() {
  const pathname = usePathname();
  const key = destKey(pathname);
  const idx = DEST_KEYS.indexOf(key) + 1;
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
        <line className="warp-guide" x1="61.8%" y1="0" x2="61.8%" y2="100%" />
        <line className="warp-guide" x1="0" y1="38.2%" x2="100%" y2="38.2%" />
      </svg>
      <p className="warp-caption" aria-live="polite">
        <span>
          {pad(idx)} / {pad(DEST_KEYS.length)}  {DESTS[key].label}
        </span>
        <span className="warp-hint">{hint}</span>
      </p>
      <KeyFlight />
    </div>
  );
}
