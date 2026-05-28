import { describe, it, expect } from "vitest";
import { freebies } from "@/data/freebies";

describe("freebies data", () => {
  it("has 5 freebies", () => {
    expect(freebies).toHaveLength(5);
  });

  it("each freebie has required fields", () => {
    for (const f of freebies) {
      expect(f.id).toMatch(/^\d{2}$/);
      expect(f.slug).toBeTruthy();
      expect(f.title).toBeTruthy();
      expect(f.description).toBeTruthy();
      expect(f.category).toMatch(/^(TYPOGRAPHY|TEXTURES|MOCKUPS|MOTION)$/);
      expect(f.image).toBeTruthy();
      expect(typeof f.downloadUrl).toBe("string");
      expect(f.colors).toHaveLength(3);
    }
  });

  it("each freebie has unique slug", () => {
    const slugs = freebies.map((f) => f.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("colors are valid hex values", () => {
    for (const f of freebies) {
      for (const c of f.colors) {
        expect(c).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
  });

  it("all categories are represented at least once", () => {
    const categories = new Set(freebies.map((f) => f.category));
    expect(categories.has("TYPOGRAPHY")).toBe(true);
    expect(categories.has("TEXTURES")).toBe(true);
    expect(categories.has("MOCKUPS")).toBe(true);
    expect(categories.has("MOTION")).toBe(true);
  });
});
