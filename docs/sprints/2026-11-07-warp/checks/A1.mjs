// A1 gate: reel is the first section, no individual works items, no face, no testimonials.
import { readFileSync } from "node:fs";
const s = readFileSync("src/app/page.tsx", "utf8");
const i = s.indexOf("<section");
const fails = [];
if (!s.slice(i, i + 80).includes("sheet reel")) fails.push("first section is not the reel");
if (/FEATURED|featured/.test(s)) fails.push("works items on home");
if (/portrait_standing|ProofDrift|TESTIMONIALS/.test(s)) fails.push("face or testimonials remain");
if (fails.length) { console.log("FAIL " + fails.join("; ")); process.exit(1); }
console.log("PASS A1");
