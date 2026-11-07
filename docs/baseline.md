# Phase 0 Baseline

Measured 2026-10-21 on `master` @ 07fbdfc plus the Phase 0 guard fix. Production build (`next build`,
Turbopack, Next 16.2.9) served with `next start`. Lighthouse 12, mobile form factor, simulated throttling.

| Route | Perf | A11y | Best pr. | SEO | LCP | TBT | CLS | FCP | Transfer |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 49 | 100 | 79 | 100 | 5.2 s | 4,010 ms | 0 | 1.6 s | 1,479 KB |
| `/works` | 64 | 95 | 96 | 100 | 5.4 s | 560 ms | 0 | 1.2 s | 1,329 KB |
| `/contacts` | 70 | 100 | 96 | 100 | 4.8 s | 370 ms | 0 | 1.2 s | 1,260 KB |

Budget (AGENTS.md §4): LCP < 2.5 s, TBT < 200 ms, CLS < 0.1. Every route currently misses LCP; the
home page misses TBT by 20×.

## Home page findings

- **LCP element** is the hero portrait `<img>` (`/assets/portrait_standing.jpg`). It sits inside a
  Framer entrance that starts at `opacity: 0` with `blur(8px)`, so LCP waits for hydration plus the
  animation.
- **Main-thread boot**: one 69 KB chunk costs 4.8 s of script evaluation under throttling, and the
  document itself costs 2.7 s. This is the single client component in `page.tsx` with its motion-value
  graph, plus StarField.
- **Largest script**: 203 KB (framework + Framer Motion).
- **Best-practices fails**: `is-on-https` (expected locally), `errors-in-console`, `valid-source-maps`.

## Phase 0 changes

- Dev-only routes: the webpack alias in `next.config.ts` was dead under Turbopack and has been removed,
  along with both `page.dummy.tsx` files. `/design-system` and `/works/builder` now have server
  `page.tsx` guards (`notFound()` outside development); the builder UI moved to `BuilderClient.tsx`, so
  its guard no longer sits ahead of a hook. Verified: both return 404 from `next start`, `/works` 200.
- Removed ignored build output: `out/` (267 MB), `test-results/`, `tsconfig.tsbuildinfo`.
- Left in place, pending owner call: `dev-server.ps1`, `start-server.ps1` (tracked, referenced
  nowhere), `GEMINI.md` (agent pointer file).
