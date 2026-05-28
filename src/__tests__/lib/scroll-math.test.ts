import { describe, it, expect } from "vitest";
import {
  getZPosition,
  getOverscrollTail,
  getFrameVisibility,
  getActiveFrameIndex,
  getPerspective,
  getParallaxMultiplier,
  getSineWavePosition,
  DESKTOP_DEPTHS,
  interpolateDepth,
} from "@/lib/scroll-math";

describe("scroll-math", () => {
  describe("getZPosition", () => {
    it("returns 0 at progress 0", () => {
      expect(getZPosition(0)).toBe(0);
    });

    it("returns max depth at progress 1", () => {
      expect(getZPosition(1)).toBe(6200);
    });

    it("linearly interpolates", () => {
      expect(getZPosition(0.5)).toBe(3100);
    });

    it("uses mobile depths when isMobile is true", () => {
      expect(getZPosition(1, true)).toBe(4200);
    });
  });

  describe("getOverscrollTail", () => {
    it("returns 0 before 0.97 progress", () => {
      expect(getOverscrollTail(0.5)).toBe(0);
      expect(getOverscrollTail(0.96)).toBe(0);
    });

    it("returns positive value at 0.98", () => {
      const val = getOverscrollTail(0.98);
      expect(val).toBeGreaterThan(0);
      expect(val).toBeLessThan(120);
    });

    it("returns max offset at progress 1", () => {
      expect(getOverscrollTail(1)).toBe(120);
    });

    it("returns max offset beyond progress 1", () => {
      expect(getOverscrollTail(1.1)).toBe(120);
    });
  });

  describe("getFrameVisibility", () => {
    it("returns full opacity and 0 blur at exact frame Z", () => {
      const result = getFrameVisibility(1800, 1800, DESKTOP_DEPTHS);
      expect(result.opacity).toBe(1);
      expect(result.blur).toBe(0);
    });

    it("returns 0 opacity and 8 blur far from frame", () => {
      const result = getFrameVisibility(0, 5000, DESKTOP_DEPTHS);
      expect(result.opacity).toBe(0);
      expect(result.blur).toBe(8);
    });
  });

  describe("getActiveFrameIndex", () => {
    it("returns 0 before first frame", () => {
      expect(getActiveFrameIndex(0, DESKTOP_DEPTHS)).toBe(0);
    });

    it("returns correct frame index at depth", () => {
      expect(getActiveFrameIndex(1800, DESKTOP_DEPTHS)).toBe(1);
      expect(getActiveFrameIndex(3500, DESKTOP_DEPTHS)).toBe(2);
    });

    it("returns last index beyond max depth", () => {
      expect(getActiveFrameIndex(9999, DESKTOP_DEPTHS)).toBe(4);
    });
  });

  describe("getPerspective", () => {
    it("returns desktop start at 0", () => {
      expect(getPerspective(0)).toBe(1400);
    });

    it("returns desktop end at 1", () => {
      expect(getPerspective(1)).toBe(950);
    });

    it("returns mobile values when isMobile is true", () => {
      expect(getPerspective(0, true)).toBe(1200);
      expect(getPerspective(1, true)).toBe(850);
    });
  });

  describe("getParallaxMultiplier", () => {
    it("returns 0 before 15% scroll", () => {
      expect(getParallaxMultiplier(0.1)).toBe(0);
    });

    it("returns 1 after 25% scroll", () => {
      expect(getParallaxMultiplier(0.3)).toBe(1);
    });

    it("linearly interpolates between 15% and 25%", () => {
      expect(getParallaxMultiplier(0.2)).toBeCloseTo(0.5, 2);
    });
  });

  describe("getSineWavePosition", () => {
    it("returns object with x, y, scale, zIndex", () => {
      const result = getSineWavePosition(0, 6, 0);
      expect(result).toHaveProperty("x");
      expect(result).toHaveProperty("y");
      expect(result).toHaveProperty("scale");
      expect(result).toHaveProperty("zIndex");
    });

    it("center item has highest scale", () => {
      const center = getSineWavePosition(3, 6, 0);
      const edge = getSineWavePosition(0, 6, 0);
      expect(center.scale).toBeGreaterThan(edge.scale);
    });
  });

  describe("interpolateDepth", () => {
    it("returns first output for value below input range", () => {
      const result = interpolateDepth(-100, DESKTOP_DEPTHS, [0, 1, 2, 3, 4]);
      expect(result).toBe(0);
    });

    it("returns last output for value above input range", () => {
      const result = interpolateDepth(9999, DESKTOP_DEPTHS, [0, 1, 2, 3, 4]);
      expect(result).toBe(4);
    });

    it("linearly interpolates within range", () => {
      const result = interpolateDepth(900, [0, 1800], [0, 1]);
      expect(result).toBeCloseTo(0.5, 2);
    });
  });
});
