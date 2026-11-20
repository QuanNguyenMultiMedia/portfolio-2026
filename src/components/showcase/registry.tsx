"use client";
// Pieces ported from the sites' own code (herondlabs org repos), each running natively in the system it was
// built in. Every piece is its own chunk, fetched when its section mounts, so a case only pays for what it shows.
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const hold = () => <div className="size-full" aria-hidden />;
const lazy = (load: () => Promise<{ default: ComponentType }>) => dynamic(load, { ssr: false, loading: hold });

export const PIECES: Record<string, ComponentType> = {
  "dename/mark-rig": lazy(() => import("./dename/MarkRig")),
  "dename/chips": lazy(() => import("./dename/Chips")),
  "dename/bonsai": lazy(() => import("./dename/Bonsai")),
  "dename/water": lazy(() => import("./dename/Water")),
};

export const KITS = ["dename", "herondlabs", "defrasoft"] as const;
export type Kit = (typeof KITS)[number];
