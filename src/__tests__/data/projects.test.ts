import { describe, it, expect } from "vitest";
import { projects } from "@/data/projects";

describe("projects data", () => {
  it("has 5 projects", () => {
    expect(projects).toHaveLength(5);
  });

  it("each project has required fields", () => {
    for (const p of projects) {
      expect(p.title).toBeTruthy();
      expect(p.slug).toBeTruthy();
      expect(p.year).toBeTruthy();
      expect(p.category).toBeTruthy();
      expect(p.id).toMatch(/^PRJ_\d{3}$/);
      expect(p.description).toBeTruthy();
      expect(p.colors).toHaveLength(3);
      expect(p.screens.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("each project has unique slug and id", () => {
    const slugs = projects.map((p) => p.slug);
    const ids = projects.map((p) => p.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each screen has a valid type", () => {
    const validTypes = new Set(["hero", "image", "details", "video", "bento"]);
    for (const p of projects) {
      for (const screen of p.screens) {
        expect(validTypes.has(screen.type)).toBe(true);
      }
    }
  });

  it("bento screens have images array", () => {
    for (const p of projects) {
      for (const screen of p.screens) {
        if (screen.type === "bento") {
          expect(screen.images).toBeDefined();
          expect(screen.images!.length).toBeGreaterThanOrEqual(1);
        }
      }
    }
  });

  it("each project has a coverImage or a screen with src", () => {
    for (const p of projects) {
      const hasCover = !!p.coverImage;
      const hasScreenImage = p.screens.some((s) => s.src);
      expect(hasCover || hasScreenImage).toBe(true);
    }
  });

  it("colors are valid hex values", () => {
    for (const p of projects) {
      for (const c of p.colors) {
        expect(c).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
  });
});
