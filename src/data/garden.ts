// The garden: one bed for everything grown here. Takes (writing), Play (live experiments), Freebies (files to take
// home) and photos of me keep their own sources; this module plants them side by side under one slug space.
// How an entry opens is part of its kind: takes and play are pages (/garden/[slug]); freebies open a pane and photos
// a full view, in place, over the bed (/garden?open=[slug]).
import { takes, type Take } from "./takes";
import { playItems, type PlayItem } from "./play";
import { freebies, type FreebieItem } from "./freebies";

export type GardenKind = "takes" | "play" | "freebies" | "photos";

/** Filter labels, the old section names. Photos carry no label: they are only ever seen, never filed. */
export const GARDEN_KINDS: { kind: Exclude<GardenKind, "photos">; label: string }[] = [
  { kind: "takes", label: "Takes" },
  { kind: "play", label: "Play" },
  { kind: "freebies", label: "Freebies" },
];

type Base = { slug: string; title: string; image: string; summary: string; meta: string };
export type GardenEntry =
  | (Base & { kind: "takes"; item: Take })
  | (Base & { kind: "play"; item: PlayItem })
  | (Base & { kind: "freebies"; item: FreebieItem })
  | (Base & { kind: "photos"; item: null });

const PHOTOS = ["portrait_sitting", "portrait_standing", "portrait_sitting_smiling"];

const beds: GardenEntry[][] = [
  takes.map((item) => ({
    kind: "takes" as const, item, slug: item.slug, title: item.title, image: item.image,
    summary: item.excerpt, meta: `${item.topic} · ${item.date.split(" ").pop()}`,
  })),
  playItems.map((item) => ({
    kind: "play" as const, item, slug: item.slug, title: item.title, image: item.src,
    summary: item.description, meta: item.tech.join(" · "),
  })),
  freebies.map((item) => ({
    kind: "freebies" as const, item, slug: item.slug, title: item.title, image: item.image,
    summary: item.description.split("\n\n")[0], meta: item.category,
  })),
  PHOTOS.map((name) => ({
    kind: "photos" as const, item: null, slug: name.replaceAll("_", "-"), title: "Minh Quân",
    image: `/assets/${name}.jpg`, summary: "", meta: "",
  })),
];

/** Kinds that open over the bed instead of on a page of their own. */
export const opensInPlace = (e: GardenEntry) => e.kind === "freebies" || e.kind === "photos";

/** Every entry, the beds interleaved so the garden reads mixed, not as sections stacked. */
export const garden: GardenEntry[] = Array.from(
  { length: Math.max(...beds.map((b) => b.length)) },
  (_, i) => beds.flatMap((b) => (b[i] ? [b[i]] : [])),
).flat();

export const findEntry = (slug: string) => garden.find((e) => e.slug === slug);

/** Siblings of the same kind, wrapping (the play viewer's prev/next). */
export function neighbours(entry: GardenEntry) {
  const same = garden.filter((e) => e.kind === entry.kind);
  const i = same.findIndex((e) => e.slug === entry.slug);
  return {
    prev: same[(i - 1 + same.length) % same.length],
    next: same[(i + 1) % same.length],
    index: i,
    count: same.length,
  };
}

export const isKind = (v: unknown): v is (typeof GARDEN_KINDS)[number]["kind"] => GARDEN_KINDS.some((k) => k.kind === v);
