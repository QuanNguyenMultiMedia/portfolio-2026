// Home: the print run, led by the work. Three sheets: the showreel under a one-line masthead (the name and the line,
// set small) with the manifesto beside it, the works in rotation (one sheet that prints each case study in turn,
// in that project's own inks, its chapters opening the case page at each one), and the record with the clients'
// words and the way into Works. Printed as sheets of one riso job (docs/design.md) and stacked in depth;
// PrintRun floats the camera through them. Under reduced motion, on phones and on short screens they read top to bottom.
// Server component; client islands: PrintRun (camera, page-fountain scope), PrintedVideo, WorkRotation, ClientWords, RegisterObserver.
import Link from "next/link";
import { preload } from "react-dom";
import ClientWords from "@/components/riso/ClientWords";
import Plates from "@/components/riso/Plates";
import PrintedVideo from "@/components/riso/PrintedVideo";
import PrintRun from "@/components/riso/PrintRun";
import RegisterObserver from "@/components/riso/RegisterObserver";
import WorkRotation, { type RotationWork } from "@/components/riso/WorkRotation";
import { chapterId } from "@/lib/chapters";
import { mediaMeta } from "@/data/workMedia";
import { projects } from "@/data/projects";
import { TESTIMONIALS } from "@/data/testimonials";
import "./home.css";

const BRANDS = [
  "Freightos", "Storyflow", "WonderMill", "Savannah Bee",
  "Upwork (VIP)", "Dobeedo", "Z Cung Viet", "Viettel Digital",
];

const STATS = [
  { value: "50+", label: "Projects Completed" },
  { value: "100%", label: "Client Rating" },
  { value: "04+", label: "Years of Experience" },
  { value: "HCMC", label: "Global Base" },
];

// What a project's turn prints when its listing cover alone would not carry the sheet: portrait ads hang as a
// set, and the freelance turn takes the full-size commission reel over its small listing thumb.
const PLATES: Record<string, string[]> = {
  defrasoft: [
    "/works/defrasoft/x-apppub-gifs-ex-dedup-recover.mp4",
    "/works/defrasoft/ugc.mp4",
    "/works/defrasoft/cover.mp4",
  ],
  "select-freelance-work": ["/works/select-freelance-work/cover.mp4"],
};

const [reel, ...cases] = projects;
// a part's place in its sheet's choreography
const cue = (o: number) => ({ "--o": o }) as React.CSSProperties;

// each case as the rotation prints it: its credits, its pressed cover, and its contents, read off the case page
// itself (the Info board's chapters, each an address on that page; a ledger's clients where it has no chapters)
const ROTATION: RotationWork[] = cases.map((p) => {
  const chapters = p.screens.find((s) => s.chapters?.length)?.chapters;
  const contents = chapters
    ? chapters.map((c) => ({ label: c, href: `/works/${p.slug}#${chapterId(c)}` }))
    : (p.screens.find((s) => s.type === "ledger")?.groups ?? []).map((g) => ({ label: g.label }));
  return {
    slug: p.slug, title: p.title, category: p.category, year: p.year,
    client: p.client ?? "", role: p.role ?? "", description: p.description,
    print: p.print ?? { fountain: "mint", deck: "ink-violet" },
    plates: (PLATES[p.slug] ?? [p.coverVideo ?? p.coverImage ?? ""]).map((src) => {
      const m = mediaMeta(src);
      return { src, poster: src === p.coverVideo ? p.coverImage : m?.poster, w: m?.w ?? 16, h: m?.h ?? 9, video: m?.video ?? src.endsWith(".mp4") };
    }),
    contents,
  };
});

export default function Home() {
  // the reel poster is the first screen's largest paint: fetch it ahead of the scripts
  preload(reel.coverImage ?? "/media/showreel.jpg", { as: "image", fetchPriority: "high" });
  return (
    <main className="home">
      <PrintRun>
        {/* sheet 1 · the masthead, the reel and the statement beside it. Parts are cued in reading order (--o):
            the camera prints them in and lifts them off (home.css, cues) */}
        <section className="sheet cover" aria-labelledby="hero-h">
          <div className="cover-mast" data-o="" style={cue(0)}>
            <h1 id="hero-h" className="cover-name t-italic">Minh Quân</h1>
            <p className="cover-line">
              loves <Plates over="ink-blue" under="ink-violet" i={1}>moving</Plates> things around.
            </p>
          </div>
          <div className="reel-frame cue-press" data-o="" style={cue(1)}>
            <PrintedVideo src={reel.coverVideo ?? "/media/showreel.mp4"} poster={reel.coverImage ?? "/media/showreel.jpg"} label="Showreel 2026" aspect="1280 / 720" sound />
          </div>
          <p className="cover-cap" data-o="" style={cue(2)}>
            <Link href={`/works/${reel.slug}`}>
              <span>{reel.title}</span>
              <span className="view-arrow" aria-hidden>→</span>
            </Link>
            <span>{reel.category}, {reel.year}</span>
          </p>
          <p className="manifesto-text" data-o="" style={cue(3)}>
            My craft is in making people stay and rewind. I believe motion and interaction is the{" "}
            <Plates over="ink-violet" under="ink-indigo" i={2}>soul</Plates> of each brand, product, and experience.
          </p>
        </section>

        {/* sheet 2 · the works in rotation: every case study, one turn each */}
        <section className="sheet rotation" aria-label="Selected work">
          <WorkRotation works={ROTATION} />
        </section>

        {/* last sheet · the record, the clients' words, and the way in */}
        <section className="sheet close" aria-label="Record">
          <dl className="ledger" data-o="" style={cue(0)}>
            {STATS.map((s) => (
              <div key={s.label}><dd>{s.value}</dd><dt>{s.label}</dt></div>
            ))}
          </dl>
          <div className="close-words" data-o="" style={cue(1)}>
            <ClientWords quotes={TESTIMONIALS} />
          </div>
          <div className="collab" data-o="" style={cue(2)}>
            <p>Trusted Collaborators</p>
            <ul className="client-list">
              {BRANDS.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
          <div className="view-works" data-blurmap="" data-o="" style={cue(3)}>
            {/* the sign-off word, printed as 12.End prints "See ya!": black display ink, roughened, compound blur */}
            <Link href="/works">
              <span>View Works</span>
              <span className="view-arrow" aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </PrintRun>
      <RegisterObserver />
    </main>
  );
}
