// Route plate energy (Works): the page fountain prints in full on arrival, then recedes (in the shader: the thin
// washes dry first and the ink pulls back into its cores) until the paper is bare. Spinning the work wheel charges it back like a flywheel: the faster the spin, the faster it fills; it
// lingers a moment when the wheel stops, then ebbs. The spin also stirs the ink (Fountain reads plateSpin()).
// One rAF loop eases the level and sleeps once everything settles; Fountain reads plateLevel() each frame.
// Below FAINT the type over it goes back to the stock's own ink (the print-black override is for type over ink).
const HOLD = 1.6; // s at full density after arrival
const RAMP = 1.2; // s: arrival fade-in, the plate's old CSS transition
const TAU = 2.4; // s: ebb time constant
const LINGER = 0.7; // s the charge holds after the wheel stops, before it ebbs
const V_FULL = 720; // deg/s: a spin this fast fills the plate in 1 / GAIN s
const GAIN = 2.2;
const EASE = 0.14; // per-frame approach of the shown density to the charge: swells, never pops
const SPIN_TAU = 0.45; // s: how long the ink keeps stirring after the wheel stops
const FAINT = 0.45; // below this the type leaves the print-black override (the dark-stock plate density)

let charge = 0, shown = 0, spin = 0, level = 1, reset = 0, t0 = 0, last = 0, lastKick = -1e9, raf = 0, on = false;

const write = (v: number) => {
  level = v;
  document.documentElement.classList.toggle("plate-faint", v < FAINT);
};

const frame = (now: number) => {
  raf = 0;
  if (!on) return;
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  const age = (now - t0) / 1000;
  if (age > HOLD && (now - lastKick) / 1000 > LINGER) charge *= Math.exp(-dt / TAU);
  spin *= Math.exp(-dt / SPIN_TAU);
  shown += (charge - shown) * (1 - Math.pow(1 - EASE, dt * 60));
  const v = shown * (1 - (1 - Math.min(1, age / RAMP)) ** 3);
  const live = v > 0.002 || charge > 0.002 || Math.abs(spin) > 0.01 || age < HOLD;
  write(live ? v : 0); // settles on exactly 0: the fountain stops drawing a bare plate
  if (live) raf = requestAnimationFrame(frame);
  else spin = 0;
};

const wake = () => { if (on && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };

export function plateIn() {
  clearTimeout(reset);
  on = true; charge = shown = 1; spin = 0; t0 = performance.now(); lastKick = -1e9;
  write(0);
  wake();
  window.dispatchEvent(new Event("plate-stir")); // phones print the arrival and recession live, then hold still
}

export function plateOut() {
  on = false; spin = 0;
  cancelAnimationFrame(raf); raf = 0;
  // the plate leaves through its CSS fade (riso.css, 1200 ms) as it stands, then other routes print it in full
  reset = window.setTimeout(() => { level = 1; }, 1300);
  document.documentElement.classList.remove("plate-faint");
}

/** The wheel turned at `degPerSec` (signed) over the last `dtMs`: charge the plate and stir the ink. */
export function plateKick(degPerSec: number, dtMs: number) {
  if (!on) return;
  const k = Math.min(2, Math.abs(degPerSec) / V_FULL);
  charge = Math.min(1, charge + k * GAIN * Math.min(0.05, dtMs / 1000));
  // reduced motion: the plate still answers in density, the ink itself never stirs
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) spin += (Math.max(-2, Math.min(2, degPerSec / V_FULL)) - spin) * 0.3;
  lastKick = performance.now();
  window.dispatchEvent(new Event("plate-stir"));
  wake();
}

/** The route plate's ink level, 0..1. */
export const plateLevel = () => level;
/** True while the level or the spin is still easing. */
export const plateMoving = () => raf !== 0;

/** Signed spin of the wheel, ~-2..2 (1 = V_FULL), easing to 0 once it stops. */
export const plateSpin = () => spin;
