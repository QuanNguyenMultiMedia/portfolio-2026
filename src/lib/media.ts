// Heavy media (video, 3D models) is served from an object store when NEXT_PUBLIC_MEDIA_BASE is set
// (e.g. https://media.example.com, a public Cloudflare R2 bucket), so it never ships in the deploy.
// Unset (local dev) it resolves to the same file under /public. Upload with scripts/upload-media.mjs.
const BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE ?? "").replace(/\/$/, "");
const HEAVY = /\.(mp4|webm|mov|glb|gltf)$/i;

export function media(src: string): string;
export function media(src: string | undefined): string | undefined;
export function media(src: string | undefined) {
  return BASE && src && src.startsWith("/") && HEAVY.test(src) ? BASE + src : src;
}
