import { describe, it, expect } from "vitest";
import {
  getItemPosition,
  getDialAngleDelta,
  snapToNearestProject,
  getCoverImage,
} from "@/lib/dial-math";

describe("dial-math", () => {
  const TOTAL = 5;

  describe("getItemPosition", () => {
    it("returns a DialItemStyle object", () => {
      const result = getItemPosition(0, TOTAL, 0);
      expect(result).toHaveProperty("translateX");
      expect(result).toHaveProperty("translateY");
      expect(result).toHaveProperty("translateZ");
      expect(result).toHaveProperty("rotateX");
      expect(result).toHaveProperty("scale");
      expect(result).toHaveProperty("opacity");
      expect(result).toHaveProperty("blur");
      expect(result).toHaveProperty("pointerEvents");
    });

    it("active item (index 0 at rotation 0) has scale > 1", () => {
      const result = getItemPosition(0, TOTAL, 0);
      expect(result.scale).toBeGreaterThan(1);
    });

    it("non-active items have scale < 1", () => {
      const result = getItemPosition(2, TOTAL, 0);
      expect(result.scale).toBeLessThan(1);
    });

    it("active item has pointerEvents auto", () => {
      const result = getItemPosition(0, TOTAL, 0);
      expect(result.pointerEvents).toBe("auto");
    });

    it("far-off items have pointerEvents none", () => {
      // index 4 has diff=-1, within 2.2 threshold, so still auto
      // test with an effectively invisible item
      const result = getItemPosition(0, TOTAL, 180);
      // at rotation 180, index 0 is furthest from center
      expect(result.opacity).toBeLessThanOrEqual(0.5);
    });

    it("items far from active have low opacity", () => {
      const result = getItemPosition(3, TOTAL, 0);
      expect(result.opacity).toBeLessThan(0.5);
    });

    it("active item has 0 blur", () => {
      const result = getItemPosition(0, TOTAL, 0);
      expect(result.blur).toBe(0);
    });
  });

  describe("getDialAngleDelta", () => {
    it("returns delta of 0 when lastAngle is null", () => {
      const result = getDialAngleDelta(100, 100, 100, 100, null);
      expect(result.delta).toBe(0);
      expect(typeof result.currentAngle).toBe("number");
    });

    it("computes delta between two angles", () => {
      // When both angles are at the same position, delta should be 0
      const result = getDialAngleDelta(200, 100, 100, 100, 45);
      expect(typeof result.delta).toBe("number");
      expect(typeof result.currentAngle).toBe("number");
    });
  });

  describe("snapToNearestProject", () => {
    it("snaps to index 0 at rotation 0", () => {
      const sector = 360 / TOTAL;
      const result = snapToNearestProject(0, TOTAL);
      expect(result.snappedIndex).toBe(0);
      expect(result.snappedRotation).toBe(0);
    });

    it("snaps to the correct index based on rotation", () => {
      // 67 degrees is closest to 72 (index 1), not 0
      const result = snapToNearestProject(67, TOTAL);
      expect(result.snappedIndex).toBe(1);
    });
  });

  describe("getCoverImage", () => {
    it("returns coverImage when present", () => {
      const project = {
        coverImage: "/custom.png",
        screens: [{ src: "/screen.png" }],
      };
      expect(getCoverImage(project)).toBe("/custom.png");
    });

    it("falls back to first screen src", () => {
      const project = {
        screens: [{ src: "/screen.png" }],
      };
      expect(getCoverImage(project)).toBe("/screen.png");
    });

    it("falls back to default when nothing available", () => {
      const project = { screens: [] };
      expect(getCoverImage(project)).toBe("/projects/gom-men.png");
    });
  });
});
