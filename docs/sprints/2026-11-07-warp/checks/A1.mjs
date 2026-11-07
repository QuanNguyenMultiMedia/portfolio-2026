// A1 gate: reel is the first section, exactly 3 featured case links, no face, no testimonials.
import { readFileSync } from "node:fs";
const s = readFileSync("src/app/page.tsx", "utf8");
const i = s.indexOf("<section");
const fails = [];
if (!s.slice(i, i + 80).includes("sheet reel")) fails.push("first section is not the reel");
const m = s.match(/FEATURED = \[([^\]]*)\]/);
if (!m || m[1].split(",").length !== 3 || !s.includes("/works/${")) fails.push("featured != 3");
if (/portrait_standing|ProofDrift|TESTIMONIALS/.test(s)) fails.push("face or testimonials remain");
if (fails.length) { console.log("FAIL " + fails.join("; ")); process.exit(1); }
console.log("PASS A1");
