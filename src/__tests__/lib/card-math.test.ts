import { describe, it, expect } from "vitest";
import {
  getPivotOrigin,
  getTiltValues,
  getParallaxOffset,
  isFlipAllowed,
  formatTransformOrigin,
} from "@/lib/card-math";

describe("card-math", () => {
  describe("getPivotOrigin", () => {
    it("returns 50,50 for center click", () => {
      const rect = { left: 0, top: 0, width: 400, height: 300 } as DOMRect;
      const result = getPivotOrigin(200, 150, rect);
      expect(result.x).toBeCloseTo(50, 1);
      expect(result.y).toBeCloseTo(50, 1);
    });

    it("returns 0,0 for top-left click", () => {
      const rect = { left: 0, top: 0, width: 400, height: 300 } as DOMRect;
      const result = getPivotOrigin(0, 0, rect);
      expect(result.x).toBeCloseTo(0, 1);
      expect(result.y).toBeCloseTo(0, 1);
    });

    it("returns 100,100 for bottom-right click", () => {
      const rect = { left: 0, top: 0, width: 400, height: 300 } as DOMRect;
      const result = getPivotOrigin(400, 300, rect);
      expect(result.x).toBeCloseTo(100, 1);
      expect(result.y).toBeCloseTo(100, 1);
    });

    it("handles offset element position", () => {
      const rect = { left: 100, top: 50, width: 200, height: 200 } as DOMRect;
      const result = getPivotOrigin(150, 100, rect);
      expect(result.x).toBeCloseTo(25, 1);
      expect(result.y).toBeCloseTo(25, 1);
    });
  });

  describe("getTiltValues", () => {
    it("returns 0 tilt when mouse is at center", () => {
      const result = getTiltValues(200, 150, 200, 150);
      expect(Math.abs(result.tiltX)).toBe(0);
      expect(Math.abs(result.tiltY)).toBe(0);
    });

    it("returns positive tiltY when mouse is right of center", () => {
      const result = getTiltValues(240, 150, 200, 150);
      expect(result.tiltY).toBeGreaterThan(0);
    });

    it("negative tiltX when mouse is below center", () => {
      const result = getTiltValues(200, 190, 200, 150);
      expect(result.tiltX).toBeLessThan(0);
    });
  });

  describe("getParallaxOffset", () => {
    it("returns 0 offset when mouse is at center", () => {
      const result = getParallaxOffset(200, 150, 200, 150);
      expect(result.offsetX).toBe(0);
      expect(result.offsetY).toBe(0);
    });

    it("returns positive offsetX when mouse is right of center", () => {
      const result = getParallaxOffset(300, 150, 200, 150);
      expect(result.offsetX).toBeGreaterThan(0);
    });
  });

  describe("isFlipAllowed", () => {
    it("allows flip when cooldown has passed", () => {
      const result = isFlipAllowed(Date.now() - 3000, 2000);
      expect(result).toBe(true);
    });

    it("blocks flip when within cooldown", () => {
      const result = isFlipAllowed(Date.now(), 2000);
      expect(result).toBe(false);
    });
  });

  describe("formatTransformOrigin", () => {
    it("formats pivot as percentage string", () => {
      const result = formatTransformOrigin({ x: 50, y: 75 });
      expect(result).toBe("50% 75%");
    });

    it("handles decimal values", () => {
      const result = formatTransformOrigin({ x: 33.33, y: 66.67 });
      expect(result).toBe("33.33% 66.67%");
    });
  });
});
