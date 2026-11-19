// Server component: a CSS-only marquee on the viewport's top edge (styles in globals.css, .construction-marquee)
const PHRASE = "Under construction";
const REPEAT = 12;

export default function ConstructionMarquee() {
  const run = Array.from({ length: REPEAT }, (_, i) => (
    <span key={i} className="construction-marquee__item">{PHRASE}</span>
  ));
  return (
    <div className="construction-marquee" role="status">
      <span className="sr-only">{PHRASE}</span>
      <div className="construction-marquee__track" aria-hidden>
        <div className="construction-marquee__run">{run}</div>
        <div className="construction-marquee__run">{run}</div>
      </div>
    </div>
  );
}
