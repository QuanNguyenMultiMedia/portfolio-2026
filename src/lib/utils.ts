export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function createAudioContext(): AudioContext | null {
  const Ctx = window.AudioContext || (window as any).webkitAudioContext;
  return Ctx ? new Ctx() : null;
}
