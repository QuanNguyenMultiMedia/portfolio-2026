// Uploads every heavy media file under public/ (video, 3D models) to a Cloudflare R2 bucket, keyed by its
// public path, so NEXT_PUBLIC_MEDIA_BASE=<bucket public URL> serves the same URLs src/lib/media.ts builds.
// Needs `npx wrangler login` once.
//   node scripts/upload-media.mjs <bucket>
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { execFileSync } from "node:child_process";

const bucket = process.argv[2];
if (!bucket) { console.error("usage: node scripts/upload-media.mjs <bucket>"); process.exit(1); }
const HEAVY = /\.(mp4|webm|mov|glb|gltf)$/i;
const TYPES = { mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime", glb: "model/gltf-binary", gltf: "model/gltf+json" };
const files = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const f = join(d, e.name);
    if (e.isDirectory()) { if (e.name !== "play-static") walk(f); } // static demos load their own relative paths
    else if (HEAVY.test(e.name)) files.push(f);
  }
})("public");

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
let mb = 0;
for (const f of files) {
  const key = relative("public", f).split(sep).join("/");
  const type = TYPES[f.split(".").pop().toLowerCase()];
  execFileSync(npx, ["wrangler@4", "r2", "object", "put", `${bucket}/${key}`, "--file", f, "--content-type", type,
    "--cache-control", "public, max-age=31536000, immutable", "--remote"], { stdio: "inherit", shell: process.platform === "win32" });
  mb += statSync(f).size / 1e6;
}
console.log(`uploaded ${files.length} files, ${mb.toFixed(0)}MB`);
