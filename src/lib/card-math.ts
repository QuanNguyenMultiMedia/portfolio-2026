export interface PivotOrigin {
  x: number;
  y: number;
}

/**
 * Calculate the flip pivot origin as a percentage of the element's dimensions
 * based on the click position relative to the element's bounding rect.
 */
export function getPivotOrigin(
  clickX: number,
  clickY: number,
  rect: DOMRect
): PivotOrigin {
  const x = ((clickX - rect.left) / rect.width) * 100;
  const y = ((clickY - rect.top) / rect.height) * 100;
  return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
}

/**
 * Calculate the tilt intensity based on mouse position relative to element center.
 * Returns rotateX and rotateY values in degrees.
 */
export function getTiltValues(
  mouseX: number,
  mouseY: number,
  centerX: number,
  centerY: number,
  intensity = 40
): { tiltX: number; tiltY: number } {
  return {
    tiltX: (mouseY - centerY) / -intensity,
    tiltY: (mouseX - centerX) / intensity,
  };
}

/**
 * Calculate the translate offset for parallax effect.
 */
export function getParallaxOffset(
  mouseX: number,
  mouseY: number,
  centerX: number,
  centerY: number,
  factor = 0.08
): { offsetX: number; offsetY: number } {
  return {
    offsetX: (mouseX - centerX) * factor,
    offsetY: (mouseY - centerY) * factor,
  };
}

/**
 * Check if a re-click is allowed based on the animation guard timer.
 */
export function isFlipAllowed(
  lastFlipTime: number,
  cooldownMs = 2000
): boolean {
  return Date.now() - lastFlipTime >= cooldownMs;
}

/**
 * Generate a CSS transform-origin string from pivot percentages.
 */
export function formatTransformOrigin(pivot: PivotOrigin): string {
  return `${pivot.x}% ${pivot.y}%`;
}
