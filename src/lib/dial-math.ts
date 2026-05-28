export interface DialItemStyle {
  translateX: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  scale: number;
  opacity: number;
  blur: number;
  pointerEvents: "auto" | "none";
  visibility: boolean;
}

export function getItemPosition(
  index: number,
  total: number,
  rotationAngle: number,
  radius = 360,
  curveAmount = 140
): DialItemStyle {
  const sectorSize = 360 / total;
  let diff = index - rotationAngle / sectorSize;
  diff = ((((diff + total / 2) % total) + total) % total) - total / 2;

  const angle = diff * 28;
  const rad = (angle * Math.PI) / 180;

  const translateY = Math.sin(rad) * radius;
  const translateZ = (Math.cos(rad) - 1) * radius;
  const rotateX = -angle;
  const translateX = (1 - Math.cos(rad)) * curveAmount;

  const isActive = Math.abs(diff) < 0.5;
  const scale = isActive ? 1.02 : 1 - Math.min(Math.abs(diff) * 0.08, 0.3);
  const opacity = isActive ? 1 : Math.max(0.12, 1 - Math.abs(diff) * 0.3);
  const blur = isActive ? 0 : Math.min(Math.abs(diff) * 1.5, 4);

  const isVisible = Math.abs(diff) <= 2.2;

  return {
    translateX,
    translateY,
    translateZ,
    rotateX,
    scale,
    opacity: isVisible ? opacity : 0,
    blur,
    pointerEvents: isVisible ? "auto" : "none",
    visibility: isVisible,
  };
}

export function getDialAngleDelta(
  clientX: number,
  clientY: number,
  centerX: number,
  centerY: number,
  lastAngle: number | null
): { currentAngle: number; delta: number } {
  const dx = clientX - centerX;
  const dy = clientY - centerY;
  const currentAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

  if (lastAngle === null) {
    return { currentAngle, delta: 0 };
  }

  let delta = currentAngle - lastAngle;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;

  return { currentAngle, delta };
}

export function snapToNearestProject(
  rotation: number,
  total: number
): { snappedRotation: number; snappedIndex: number } {
  const sectorSize = 360 / total;
  const snappedIndex = Math.round(rotation / sectorSize) % total;
  const snappedRotation = snappedIndex * sectorSize;
  return { snappedRotation, snappedIndex };
}

export function getCoverImage(
  project: { coverImage?: string; screens: { src?: string }[] },
  fallback = "/projects/gom-men.png"
): string {
  return project.coverImage || project.screens[0]?.src || fallback;
}
