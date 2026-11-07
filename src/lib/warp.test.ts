import { describe, it, expect, vi } from "vitest";
import { heading, setWarp, clearWarp, destKey, DEST_KEYS } from "./warp";

describe("warp contract", () => {
  it("same destination has no heading", () => {
    expect(heading("/works", "/works/defrasoft")).toEqual({ x: 0, y: 0 });
  });
  it("heading is a unit vector", () => {
    const h = heading("/works", "/contacts");
    expect(Math.hypot(h.x, h.y)).toBeCloseTo(1);
  });
  it("unknown routes map to home", () => {
    expect(destKey("/nope")).toBe("");
    expect(DEST_KEYS[0]).toBe("");
  });
  it("setWarp stamps the root and fires an event; clearWarp removes it", () => {
    const fn = vi.fn();
    window.addEventListener("warp", fn);
    setWarp("back", { x: 1, y: 0 });
    expect(document.documentElement.dataset.warp).toBe("back");
    expect(fn).toHaveBeenCalledOnce();
    clearWarp();
    expect(document.documentElement.dataset.warp).toBeUndefined();
  });
});
