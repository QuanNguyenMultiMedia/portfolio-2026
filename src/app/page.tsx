// Home: the print run. The frames (showreel with the name strip, three featured works, manifesto & the way in)
// and their copy, printed as sheets of one riso job (docs/design.md) and stacked in depth; PrintRun floats the camera
// through them. Under reduced motion, on phones and on short screens the same sheets read top to bottom.
// Server component; client islands: PrintRun (camera, page-fountain scope), Fountain, PrintedVideo, RegisterObserver.
import Image from "next/image";
import Link from "next/link";
import Fountain from "@/components/riso/Fountain";
import Plates from "@/components/riso/Plates";
import PrintedVideo from "@/components/riso/PrintedVideo";
import PrintRun from "@/components/riso/PrintRun";
import RegisterObserver from "@/components/riso/RegisterObserver";
import { projects } from "@/data/projects";
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

const FEATURED = ["herond-browser", "defrasoft", "z-cung-viet"].map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);

const reg = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default function Home() {
  return (
    <main className="home">
      <PrintRun>
        {/* frame 1 · showreel: the reel on its spread, the name and the line in a strip under it */}
        <section className="sheet reel" aria-labelledby="hero-h">
          <div className="reel-frame">
            <PrintedVideo src="/media/showreel.mp4" poster="/media/showreel.jpg" label="Showreel 2026" aspect="1280 / 720" sound />
          </div>
          <div className="hud-strip">
            <h1 id="hero-h" className="hud-name">Minh Quân</h1>
            <p className="hero-line">loves <Plates over="ink-blue" under="ink-violet" i={1}>moving</Plates> things around.</p>
          </div>
        </section>

        {/* frames 2–4 · featured works: one case study per sheet */}
        {FEATURED.map((p, i) => (
          <section key={p.slug} className="sheet featured" aria-labelledby={`f-${p.slug}`}>
            <Link href={`/works/${p.slug}`} className="featured-media" aria-labelledby={`f-${p.slug}`}>
              {p.coverVideo
                ? <PrintedVideo src={p.coverVideo} poster={p.coverImage ?? ""} label={p.title} aspect="16 / 9" />
                : p.coverImage && <Image src={p.coverImage} alt="" fill sizes="(max-width: 768px) 100vw, 66vw" />}
            </Link>
            <div className="featured-meta">
              <span className="featured-index">{String(i + 1).padStart(2, "0")} / {String(FEATURED.length).padStart(2, "0")}</span>
              <h2 id={`f-${p.slug}`} className="featured-title">{p.title}</h2>
              <p className="featured-sub">{p.category} · {p.year}</p>
            </div>
          </section>
        ))}

        {/* frame 5 · the statement and the way in: manifesto, the record, the collaborators, View Works */}
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
            <Link href="/works">
              <Fountain className="ink-fill" clipText>
                <span className="ink-knock" data-clip="">View Works</span>
                <span className="view-arrow ink-knock" data-clip="" aria-hidden>→</span>
              </Fountain>
            </Link>
          </div>
        </section>
      </PrintRun>
      <RegisterObserver />
    </main>
  );
}
