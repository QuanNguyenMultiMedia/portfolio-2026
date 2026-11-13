import { describe, it, expect } from "vitest";
import { garden, findEntry, neighbours } from "@/data/garden";
import { takes } from "@/data/takes";
import { playItems } from "@/data/play";
import { freebies } from "@/data/freebies";

describe("garden data", () => {
  it("plants every take, play item, freebie and photo once", () => {
    expect(garden).toHaveLength(takes.length + playItems.length + freebies.length + 3);
  });

  it("slugs are unique across kinds (one /garden/[slug] space)", () => {
    const slugs = garden.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("interleaves the kinds", () => {
    expect(garden.slice(0, 3).map((e) => e.kind)).toEqual(["takes", "play", "freebies"]);
    expect(garden[3].kind).toBe("photos");
  });

  it("neighbours wrap within a kind", () => {
    const first = findEntry(playItems[0].slug)!;
    const { prev, next } = neighbours(first);
    expect(prev.slug).toBe(playItems[playItems.length - 1].slug);
    expect(next.slug).toBe(playItems[1].slug);
  });
});
