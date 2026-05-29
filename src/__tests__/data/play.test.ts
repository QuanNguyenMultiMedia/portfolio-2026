import { describe, it, expect } from "vitest";
import { playItems } from "@/data/play";

describe("play data", () => {
  it("has 4 play items", () => {
    expect(playItems).toHaveLength(4);
  });

  it("each play item has required fields", () => {
    for (const p of playItems) {
      expect(p.title).toBeTruthy();
      expect(p.slug).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.src).toBeTruthy();
      expect(p.url).toMatch(/^\/play-static\//);
      expect(p.colors).toHaveLength(3);
      expect(Array.isArray(p.tech)).toBe(true);
      expect(p.tech.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("each play item has unique slug", () => {
    const slugs = playItems.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("colors are valid hex values", () => {
    for (const p of playItems) {
      for (const c of p.colors) {
        expect(c).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
  });
});
