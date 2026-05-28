import "@testing-library/jest-dom/vitest";

window.AudioContext = window.AudioContext ?? (class MockAudioContext {
  currentTime = 0;
  sampleRate = 44100;
  state: AudioContextState = "running";
  onstatechange: ((this: AudioContext, ev: Event) => void) | null = null;
  createOscillator() {
    return {
      type: "triangle" as OscillatorType,
      frequency: { value: 440, setValueAtTime: () => {} },
      connect: () => {},
      start: () => {},
      stop: () => {},
      disconnect: () => {},
    } as unknown as OscillatorNode;
  }
  createGain() {
    return {
      gain: { value: 1, setValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
      connect: () => {},
      disconnect: () => {},
    } as unknown as GainNode;
  }
  createConstantSource() {
    return {
      offset: { value: 0 },
      connect: () => {},
      start: () => {},
      stop: () => {},
    } as unknown as ConstantSourceNode;
  }
  resume() { return Promise.resolve(); }
  close() { return Promise.resolve(); }
} as unknown as AudioContextConstructor);

Object.defineProperty(navigator, "vibrate", {
  value: () => true,
  writable: true,
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

const noopRAF = (() => 0) as typeof requestAnimationFrame;
window.requestAnimationFrame = window.requestAnimationFrame ?? noopRAF;
window.cancelAnimationFrame = window.cancelAnimationFrame ?? (() => {});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = window.ResizeObserver ?? ResizeObserverMock as unknown as typeof ResizeObserver;

performance.mark = performance.mark ?? (() => undefined as unknown as PerformanceMark);
performance.measure = performance.measure ?? (() => undefined as unknown as PerformanceMeasure);
performance.clearMarks = performance.clearMarks ?? (() => {});
performance.clearMeasures = performance.clearMeasures ?? (() => {});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
    resolvedTheme: "light",
    themes: ["light", "dark"],
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));
