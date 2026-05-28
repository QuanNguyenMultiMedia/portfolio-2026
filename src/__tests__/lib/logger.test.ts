import { describe, it, expect, vi, beforeEach } from "vitest";
import { Logger, setLogLevel, resetLogLevel } from "@/lib/logger";

describe("Logger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetLogLevel();
  });

  it("creates an instance with namespace and logs prefixed messages", () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const log = new Logger("TestNamespace");
    log.info("hello world");
    expect(consoleSpy).toHaveBeenCalledWith("[TestNamespace]", "hello world");
  });

  it("logs at different levels (info, warn, error)", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const log = new Logger("Multi");
    log.info("info msg");
    log.warn("warn msg");
    log.error("error msg");
    expect(infoSpy).toHaveBeenCalledWith("[Multi]", "info msg");
    expect(warnSpy).toHaveBeenCalledWith("[Multi]", "warn msg");
    expect(errorSpy).toHaveBeenCalledWith("[Multi]", "error msg");
  });

  it("filters by log level", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    setLogLevel("warn");
    const log = new Logger("FilterTest");
    log.info("should not appear");
    log.warn("should appear");
    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith("[FilterTest]", "should appear");
  });

  it("time() returns a stop function that logs duration", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const log = new Logger("Timed");
    const stop = log.time("render");
    expect(typeof stop).toBe("function");
    stop();
    expect(infoSpy).toHaveBeenCalled();
    const call = infoSpy.mock.calls[0];
    expect(call[0]).toBe("[Timed]");
    expect(call[1]).toContain("render");
    expect(call[1]).toMatch(/\d+(\.\d+)?ms/);
  });

  it("child logger inherits namespace with separator", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const parent = new Logger("Parent");
    const child = parent.child("Child");
    child.info("nested");
    expect(infoSpy).toHaveBeenCalledWith("[Parent:Child]", "nested");
  });

  it("debug is silent by default (not in production mode)", () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const log = new Logger("Safe");
    log.debug("silent");
    expect(debugSpy).not.toHaveBeenCalled();
  });
});
