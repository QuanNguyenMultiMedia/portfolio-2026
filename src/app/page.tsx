// Home: the print run. Four frames (the name, the showreel, works & words, the manifesto & the way in)
// and their copy, printed as sheets of one riso job (docs/design.md) and stacked in depth; PrintRun floats the camera
// through them. Under reduced motion, on phones and on short screens the same sheets read top to bottom.
// Server component; client islands: PrintRun (camera, page-fountain scope), Fountain, PrintedVideo, ProofDrift, RegisterObserver.
import Link from "next/link";
import Fountain from "@/components/riso/Fountain";
import Plates from "@/components/riso/Plates";
import PrintedVideo from "@/components/riso/PrintedVideo";
import ProofDrift from "@/components/riso/ProofDrift";
import PrintRun from "@/components/riso/PrintRun";
import RegisterObserver from "@/components/riso/RegisterObserver";
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


const reg = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default function Home() {
  return (
    <main className="home">
      <PrintRun>
        {/* frame 1 · the name printed in the fountain ink, and the line */}
        <section className="sheet hero" aria-labelledby="hero-h">
          <h1 id="hero-h" className="hero-name t-italic">
            <Fountain className="ink-fill name-fill" clipText><span className="ink-knock" data-clip="">Minh Quân</span></Fountain>
          </h1>
          <p className="hero-line">
            loves <Plates over="ink-blue" under="ink-violet" i={1}>moving</Plates> things around.
          </p>
        </section>

        {/* frame 2 · showreel: the reel alone on its spread */}
        <section className="sheet reel" aria-label="Showreel">
          <div className="reel-frame">
            <PrintedVideo src="/media/showreel.mp4" poster="/media/showreel.jpg" label="Showreel 2026" aspect="1280 / 720" sound />
          </div>
        </section>

        {/* frame 3 · works & words: fragments of the case studies re-printing on their own clocks, the clients' words set among them */}
        <section className="sheet drift" aria-labelledby="drift-h">
          <h2 id="drift-h" className="sr-only">Works and words</h2>
          <ProofDrift quotes={TESTIMONIALS} />
        </section>

        {/* frame 4 · the statement and the way in: manifesto, the record, the collaborators, View Works */}
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
