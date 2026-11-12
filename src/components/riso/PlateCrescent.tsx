"use client";
// Prints the page fountain as a crescent for as long as this route is mounted (Contacts): html.plate-on lifts the
// plate in, html.plate-crescent tells the shader to pool the ink along the bottom and right edges (Fountain uCrescent).
// The ink holds at full density (no plateIn: nothing recedes). On leave the plate fades out through its CSS
// transition first and only then drops the crescent, so the full plate never shows through the fade.
import { useEffect } from "react";

const FADE_MS = 1300; // the page plate's opacity transition (riso.css, 1200 ms) plus a frame
let drop = 0;

export default function PlateCrescent() {
  useEffect(() => {
    const root = document.documentElement;
    clearTimeout(drop);
    root.classList.add("plate-on", "plate-crescent");
    window.dispatchEvent(new Event("plate-stir")); // wake the shared loop (phones print one frame and sleep)
    return () => {
      root.classList.remove("plate-on");
      drop = window.setTimeout(() => root.classList.remove("plate-crescent"), FADE_MS);
    };
  }, []);
  return null;
}
