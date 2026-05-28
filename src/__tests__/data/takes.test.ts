import { describe, it, expect } from "vitest";
import { takes } from "@/data/takes";

describe("takes data", () => {
  it("has 6 takes", () => {
    expect(takes).toHaveLength(6);
  });

  it("each take has required fields", () => {
    for (const t of takes) {
      expect(t.title).toBeTruthy();
      expect(t.slug).toBeTruthy();
      expect(t.date).toMatch(/^[A-Z][a-z]+ \d{4}$/);
      expect(t.excerpt).toBeTruthy();
      expect(t.topic).toBeTruthy();
      expect(t.image).toBeTruthy();
      expect(t.content).toBeTruthy();
      expect(t.colors).toHaveLength(3);
    }
  });

  it("each take has unique slug", () => {
    const slugs = takes.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("content contains double-newline paragraph separators", () => {
    for (const t of takes) {
      expect(t.content).toContain("\n\n");
    }
  });

  it("colors are valid hex values", () => {
    for (const t of takes) {
      for (const c of t.colors) {
        expect(c).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
  });

  it("each take has a topic label (uppercase)", () => {
    for (const t of takes) {
      expect(t.topic).toMatch(/^[A-Z]+$/);
    }
  });
});
