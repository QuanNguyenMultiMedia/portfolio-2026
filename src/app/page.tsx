// Home: the print run, opened by the cover (Book: 01.Title, opened on its spine). Four sheets: the hero (the name
// in the cover's mint fountain over the reel printed full-spread and pale, the line in black over the name's tail,
// the statement and the way in), the reel (the same footage drawn back to its own proportions, at full density,
// as large as the screen allows; scrolling on, it flies back into the distance and is gone),
// the works in rotation (one sheet that prints each case study in turn, in that project's own inks, its chapters opening the case page at each one), and the record with the clients'
// words and the way into Works. Printed as sheets of one riso job (docs/design.md) and stacked in depth;
// PrintRun floats the camera through them. Under reduced motion, on phones and on short screens they read top to bottom.
// Server component; client islands: Book (the cover), BleedName's plate, PrintRun (camera, the reel's own travel, page-fountain scope), PrintedVideo, WorkRotation, ClientWords, RegisterObserver.
import Image from "next/image";
import Link from "next/link";
import { preload } from "react-dom";
import BleedName from "@/components/riso/BleedName";
import Book from "@/components/riso/Book";
import ClientWords from "@/components/riso/ClientWords";
import Fountain from "@/components/riso/Fountain";
import PrintedVideo from "@/components/riso/PrintedVideo";
import Plates from "@/components/riso/Plates";
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
      {/* the front cover, first visit of a session (lib/cover): turned to open the first spread */}
      <Book poster={reel.coverImage ?? "/media/showreel.jpg"} />
      <PrintRun>
        {/* sheet 1 · the hero. The reel prints under the whole spread, pale (PrintRun scales the reel sheet's
            frame out to the screen's edges and lays a paper wash over it; in flow mode the poster stands in, .hero-bg).
            The cover's fountain prints over the footage at part density (.hero-plate), so the type always sits on ink.
            The name, in the cover's mint fountain across the measure, sits on the foot of the spread; the line, in
            black, rides the name's tail. The statement and the way in sit in the quiet zone above the name.
            Parts are cued (--o): the name, the line, the quiet zone (home.css, cues). Under the cover (Book) the
            cues hold until the cover is opened. */}
        <section className="sheet hero" aria-labelledby="hero-h">
          <div className="hero-bg" aria-hidden>
            <Image src={reel.coverImage ?? "/media/showreel.jpg"} alt="" fill sizes="100vw" loading="eager" />
            <Fountain className="hero-plate" params={{ phase: 2.4 }} />
          </div>
          <div className="hero-name" data-o="" style={cue(1)}>
            <BleedName id="hero-h" title="Minh Quân" print={{ fountain: "mint", deck: "ink-violet" }} params={{ cursor: 1 }} />
          </div>
          <p className="hero-line t-lead" data-o="" style={cue(2)}><span className="plate ink">loves moving things around.</span></p>
          <div className="hero-quiet" data-o="" style={cue(3)}>
            <p className="hero-statement">
              My craft is in making people stay and rewind. I believe motion and interaction is the{" "}
              <Plates over="ink-violet" under="ink-indigo" i={2}>soul</Plates> of each brand, product, and experience.
            </p>
            <Link href="/works" className="hero-cta">
              <span>View Works</span>
              <span className="view-arrow" aria-hidden>→</span>
            </Link>
          </div>
        </section>

        {/* sheet 2 · the reel, focused: its own proportions, as large as the screen takes it. In the run this one
            footage is also the hero's ground and leaves by flying back into the distance (PrintRun, data-reel):
            it never passes the camera as the other sheets do. */}
        <section className="sheet reel" data-reel="" aria-label="Showreel">
          <div className="reel-frame" data-o="" data-nolens="" style={cue(0)}>
            <div className="reel-scale cue-press">
              <PrintedVideo src={reel.coverVideo ?? "/media/showreel.mp4"} poster={reel.coverImage ?? "/media/showreel.jpg"} label="Showreel 2026" aspect="1280 / 720" sound />
              <div className="reel-wash" aria-hidden />
            </div>
          </div>
          {/* the hero's ground: the cover's fountain printed over the footage, so the type sits on ink, not on
              whatever frame the reel happens to show; it lifts as the reel comes into focus (--wash, PrintRun) */}
          <Fountain className="hero-plate reel-plate" params={{ phase: 2.4 }} />
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
