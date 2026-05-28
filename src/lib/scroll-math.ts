export const DESKTOP_DEPTHS = [0, 1800, 3500, 5000, 6200];
export const MOBILE_DEPTHS = [0, 1000, 2000, 3000, 4200];

export interface FrameInfo {
  index: number;
  z: number;
  opacity: number;
  blur: number;
  pointerEvents: "auto" | "none";
}

export function interpolateDepth(
  z: number,
  input: number[],
  output: number[]
): number {
  if (z <= input[0]) return output[0];
  if (z >= input[input.length - 1]) return output[output.length - 1];
  for (let i = 0; i < input.length - 1; i++) {
    if (z >= input[i] && z < input[i + 1]) {
      const t = (z - input[i]) / (input[i + 1] - input[i]);
      return output[i] + t * (output[i + 1] - output[i]);
    }
  }
  return output[output.length - 1];
}

export function getZPosition(progress: number, isMobile = false): number {
  const depths = isMobile ? MOBILE_DEPTHS : DESKTOP_DEPTHS;
  const maxZ = depths[depths.length - 1];
  return progress * maxZ;
}

export function getOverscrollTail(progress: number): number {
  const tailStart = 0.97;
  const tailEnd = 1.0;
  const maxOffset = 120;

  if (progress < tailStart) return 0;
  if (progress >= tailEnd) return maxOffset;

  const t = (progress - tailStart) / (tailEnd - tailStart);
  return maxOffset * (1 - Math.pow(1 - t, 3));
}

export function getFrameVisibility(
  z: number,
  frameZ: number,
  depths: number[]
): { opacity: number; blur: number } {
  const frameIndex = depths.indexOf(frameZ);
  const prevZ = frameIndex > 0 ? depths[frameIndex - 1] : 0;
  const nextZ =
    frameIndex < depths.length - 1 ? depths[frameIndex + 1] : depths[depths.length - 1];

  const fadeInStart = prevZ > 0 ? prevZ - (frameZ - prevZ) * 0.5 : 0;
  const fadeInEnd = frameZ - (frameZ - prevZ) * 0.15;
  const fadeOutStart = frameZ + (nextZ - frameZ) * 0.15;
  const fadeOutEnd = nextZ;

  if (z < fadeInStart || z > fadeOutEnd) return { opacity: 0, blur: 8 };
  if (z >= fadeInEnd && z <= fadeOutStart) return { opacity: 1, blur: 0 };

  if (z < fadeInEnd) {
    const t = (z - fadeInStart) / (fadeInEnd - fadeInStart);
    return { opacity: t, blur: 8 * (1 - t) };
  }

  const t = (z - fadeOutStart) / (fadeOutEnd - fadeOutStart);
  return { opacity: 1 - t, blur: 8 * t };
}

export function getActiveFrameIndex(z: number, depths: number[]): number {
  for (let i = depths.length - 1; i >= 0; i--) {
    if (z >= depths[i]) return i;
  }
  return 0;
}

export function getPerspective(progress: number, isMobile = false): number {
  const start = isMobile ? 1200 : 1400;
  const end = isMobile ? 850 : 950;
  return start + (end - start) * progress;
}

export function getParallaxMultiplier(progress: number): number {
  if (progress < 0.15) return 0;
  if (progress > 0.25) return 1;
  return (progress - 0.15) / 0.1;
}

export function getSineWavePosition(
  index: number,
  total: number,
  smoothOffset: number
): { x: number; y: number; scale: number; zIndex: number } {
  const pos = ((index / total + smoothOffset * 0.05) % 1 + 1) % 1;
  const x = (pos - 0.5) * 2400;
  const y = Math.sin(pos * Math.PI * 2) * 200;
  const proximity = 1 - Math.abs(pos - 0.5) * 2;
  const scale = 0.35 + proximity * 0.45;
  const zIndex = Math.round(100 - proximity * 180);
  return { x, y, scale, zIndex };
}
