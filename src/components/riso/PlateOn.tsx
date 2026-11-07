"use client";
// Prints the page fountain for as long as this route is mounted (html.plate-on; the plate's CSS fades it).
import { useEffect } from "react";

export default function PlateOn() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("plate-on", "plate-route");
    return () => root.classList.remove("plate-on", "plate-route");
  }, []);
  return null;
}
