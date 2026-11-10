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
    // mirrors the screen type union in src/data/projects.ts
    const validTypes = new Set(["video", "zine-cover", "editorial-text", "interactive-preview", "deliverable-breakdown", "zine-outro", "process", "loops", "evolution", "library", "matrix", "feed", "store", "roster", "ledger", "timeline", "variants"]);
    for (const p of projects) {
      for (const screen of p.screens) {
        expect(validTypes.has(screen.type)).toBe(true);
      }
    }
  });

  it("every media src a section names exists in the media index", async () => {
    const { mediaMeta } = await import("@/data/workMedia");
    for (const p of projects) {
      for (const s of p.screens) {
        const srcs = [
          s.src,
          ...(s.images ?? []),
          ...(s.items ?? []).flatMap((x) => [x.src, x.variant]),
          ...(s.extras ?? []).map((x) => x.src),
          ...(s.groups ?? []).flatMap((g) => g.items.map((x) => x.src)),
          ...(s.tables ?? []).flatMap((tb) => tb.lines.flatMap((l) => l.cells)),
        ].filter((x): x is string => !!x && x.startsWith("/"));
        for (const src of srcs) expect(mediaMeta(src), `${p.slug}: ${src}`).toBeDefined();
      }
    }
  });

  it("matrix lines carry one cell per axis entry", () => {
    for (const p of projects)
      for (const s of p.screens)
        for (const tb of s.tables ?? []) for (const l of tb.lines) expect(l.cells).toHaveLength(tb.axis.length);
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
