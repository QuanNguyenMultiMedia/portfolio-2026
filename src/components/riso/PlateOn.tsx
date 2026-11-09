"use client";
// Prints the page fountain for as long as this route is mounted (html.plate-on). It arrives at full density and
// subsides; the route's controls kick it back (lib/plate).
import { useEffect } from "react";
import { plateIn, plateOut } from "@/lib/plate";

export default function PlateOn() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("plate-on", "plate-route");
    plateIn();
    return () => { plateOut(); root.classList.remove("plate-on", "plate-route"); };
  }, []);
  return null;
}
