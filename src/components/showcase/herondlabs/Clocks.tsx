"use client";
// StudioClocks, from herondlabs/herondlabs-website src/components/contact/SaigonClock.tsx, ported. The one module the
// site lets break its own rules: rounded corners and an ember wash as the artwork. The time is read per zone
// through Intl parts, numerals stacked HH over MM in extra-light Inter, the dial reduced to two hairline hands.
// One shared ticker; no live region, so a screen reader is not read the time every second.
import { useEffect, useState } from "react";
import "./herondlabs.css";

// the contact page's own copy (src/content/en/contact.ts)
const CITIES = [
  { heading: "Ho Chi Minh City", zone: "ICT (GMT+7)", tz: "Asia/Ho_Chi_Minh", open: "Studio open - Mon-Fri, 9:00-18:00", closed: "Studio closed - back Mon-Fri, 9:00-18:00" },
  { heading: "Singapore", zone: "SGT (GMT+8)", tz: "Asia/Singapore" },
];

function read(timeZone: string, at: number) {
  const when = new Date(at);
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).formatToParts(when);
  const v = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const h = Number(v("hour")), m = Number(v("minute")), s = Number(v("second"));
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(when);
  return { hh: v("hour"), mm: v("minute"), ss: v("second"), hourDeg: ((h % 12) + m / 60) * 30, minDeg: (m + s / 60) * 6, open: !["Sat", "Sun"].includes(weekday) && h >= 9 && h < 18 };
}

export default function Clocks() {
  // client-only piece (registry: ssr false), so the first render can read the clock and the preference directly
  const [now, setNow] = useState(() => Date.now());
  const [reduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), reduced ? 30_000 : 1000);
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <div className="hl-clocks">
      {CITIES.map((c) => {
        const t = read(c.tz, now);
        const sweep = reduced ? undefined : "transform 1s linear";
        return (
          <section key={c.tz} aria-label={`${c.heading} - ${c.zone}`} className="hl-clock">
            <p className="hl-micro">{c.heading} · {c.zone}</p>
            <div className="hl-clock-face">
              <div aria-hidden className="hl-hands">
                <span className="hl-hand is-hour" style={{ transform: `rotate(${t.hourDeg}deg)`, transition: sweep }} />
                <span className="hl-hand is-min" style={{ transform: `rotate(${t.minDeg}deg)`, transition: sweep }} />
                <span className="hl-pivot" />
              </div>
              <p className="hl-numerals">
                <span className="block">{t.hh}</span>
                <span className="block">{t.mm}<span className="hl-secs"> :{t.ss}</span></span>
              </p>
            </div>
            {c.open && <p className="hl-micro"><span className={t.open ? "is-open" : undefined}>{t.open ? c.open : c.closed}</span></p>}
          </section>
        );
      })}
    </div>
  );
}
