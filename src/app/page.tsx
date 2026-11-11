// Home: the print run, led by the work. Six frames: the showreel under a one-line masthead (the name and the line,
// set small), one frame per case study (its cover, its name as the display type, the way into it), then the
// manifesto and the record. Printed as sheets of one riso job (docs/design.md) and stacked in depth; PrintRun
// floats the camera through them. Under reduced motion, on phones and on short screens the same sheets read top to bottom.
// Server component; client islands: PrintRun (camera, page-fountain scope), PrintedVideo, WorkPlate, ClientWords, RegisterObserver.
import Link from "next/link";
import { preload } from "react-dom";
import ClientWords from "@/components/riso/ClientWords";
import Plates from "@/components/riso/Plates";
import PrintedVideo from "@/components/riso/PrintedVideo";
import PrintRun from "@/components/riso/PrintRun";
import RegisterObserver from "@/components/riso/RegisterObserver";
import WorkPlate from "@/components/riso/WorkPlate";
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

// What a project's frame prints when its listing cover alone would not carry the sheet: portrait ads hang as a
// set, and the freelance frame takes the full-size commission reel over its small listing thumb.
const PLATES: Record<string, string[]> = {
  defrasoft: [
    "/works/defrasoft/x-apppub-gifs-ex-dedup-recover.mp4",
    "/works/defrasoft/ugc.mp4",
    "/works/defrasoft/cover.mp4",
  ],
  "select-freelance-work": ["/works/select-freelance-work/cover.mp4"],
};
// the clients quoted are freelance clients: their words print on that frame
const WORDS_ON = "select-freelance-work";

const [reel, ...cases] = projects;
const reg = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default function Home() {
  // the reel poster is the first screen's largest paint: fetch it ahead of the scripts
  preload(reel.coverImage ?? "/media/showreel.jpg", { as: "image", fetchPriority: "high" });
  return (
    <main className="home">
      <PrintRun>
        {/* frame 1 · the reel, under the masthead: the name and the line read as one sentence */}
        <section className="sheet cover" aria-labelledby="hero-h">
          <div className="cover-mast">
            <h1 id="hero-h" className="cover-name t-italic cover-in" style={reg(0)}>Minh Quân</h1>
            <p className="cover-line cover-in" style={reg(1)}>
              loves <Plates over="ink-blue" under="ink-violet" i={1}>moving</Plates> things around.
            </p>
          </div>
          <div className="reel-frame">
            <PrintedVideo className="cover-in" src={reel.coverVideo ?? "/media/showreel.mp4"} poster={reel.coverImage ?? "/media/showreel.jpg"} label="Showreel 2026" aspect="1280 / 720" sound />
          </div>
          <p className="cover-cap">
            <Link href={`/works/${reel.slug}`} className="cover-in" style={reg(3)}>
              <span>{reel.title}</span>
              <span className="view-arrow" aria-hidden>→</span>
            </Link>
            <span className="cover-in" style={reg(4)}>{reel.category}, {reel.year}</span>
          </p>
        </section>

        {/* frames 2–5 · one case study each: the cover, what it was, and its name as the way in */}
        {cases.map((p) => {
          const plates = PLATES[p.slug] ?? [p.coverVideo ?? p.coverImage ?? ""];
          const words = p.slug === WORDS_ON;
          return (
            <section key={p.slug} className={`sheet work${words ? " work-words" : ""}`} aria-labelledby={`work-${p.slug}`}>
              {/* the cover is a second, pointer-only way in; the title link is the one keyboards and readers get */}
              <Link href={`/works/${p.slug}`} className="work-media" tabIndex={-1} aria-hidden style={{ "--n": plates.length } as React.CSSProperties}>
                {plates.map((src) => (
                  <WorkPlate key={src} src={src} poster={src === p.coverVideo ? p.coverImage : undefined} />
                ))}
              </Link>
              <div className="work-side">
                <p className="work-kind">{p.category}<br />{p.year}</p>
                <p className="work-desc">{p.description}</p>
                {words ? <ClientWords quotes={TESTIMONIALS} /> : null}
              </div>
              <h2 id={`work-${p.slug}`} className="work-title" data-blurmap="">
                <Link href={`/works/${p.slug}`}>
                  <span>{p.title}</span>
                  <span className="view-arrow" aria-hidden>→</span>
                </Link>
              </h2>
            </section>
          );
        })}

        {/* last frame · the statement and the way in: manifesto, the record, the collaborators, View Works */}
        <section className="sheet close" aria-label="Manifesto">
          <p className="manifesto-text reg-fade" data-reg="" style={reg(0)}>
            My craft is in making people stay and rewind. I believe motion and interaction is the soul of each brand, product, and experience.
          </p>
          <dl className="ledger">
            {STATS.map((s) => (
              <div key={s.label}><dd>{s.value}</dd><dt>{s.label}</dt></div>
            ))}
          </dl>
          <div className="collab">
            <p>Trusted Collaborators</p>
            <ul className="client-list">
              {BRANDS.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
          <div className="view-works" data-blurmap="">
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
