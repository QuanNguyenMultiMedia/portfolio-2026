# Handoff — Homepage Overscroll & Camera Smoothness

## Project State
Homepage scroll-to-camera-Z mapping is functional. Overscroll snap-back works but has a timing issue where the tail extension gets overridden by subsequent scroll-progress events.

## Active Work
**Goal:** Seamless overscroll — user scrolls to end in one gesture → tail extends 120px → holds 200ms → snaps back automatically. No second scroll needed. Scroll-back must release immediately.

**Current approach (`src/app/page.tsx:189-209`):**
- `baseZ` capped at 6200 (line 159-167)
- `tailTarget`/`tailOffset` spring (ζ≈1.15, ~100ms settle) extends 0→120px as progress goes 0.97→1.0 (lines 190-193, guarded by `!timerFired`)
- Snap-back timer starts at `progress >= 0.999` (line 195) — fires `tailTarget.set(0)` + sets `timerFired = true` after 200ms
- `timerFired` guard (line 191) prevents progress handler from re-extending after snap-back
- `progress < 0.95` resets everything (lines 202-208)
- Wheel handler (lines 171-188) re-extends and resets timer when user wheels at limit

**Current issues:**
1. Timer at `progress >= 0.99` was too early — fired mid-scroll, snap-back got overridden. Changed to `>0.999` but may still need tuning
2. `timerFired` guard may cause stale-state issues on scroll-back + re-scroll cycles
3. First-frame overscroll bug (suspected: NaN progress from `0/limit` early Lenis events not hitting `<0.95` reset)

## Key Files Changed
- `src/app/page.tsx:68-95` — Lenis scroll handler (sets `scrollProgress`)
- `src/app/page.tsx:159-167` — `baseZ` capped at 6200
- `src/app/page.tsx:168-209` — Entire overscroll mechanism (spring, wheel handler, progress handler, timer, guard)
- `src/app/page.tsx:80` — Lenis easing changed from linear to cubic ease-out `1-(1-t)³`
- `src/app/page.tsx:79` — `wheelMultiplier` set to `0.8`

## Current Issues (Unresolved)

### P0 — Overscroll snap-back timing fragile
`progress > 0.999` trigger might still fire while Lenis has one more event queued, undoing the snap-back. The `timerFired` guard prevents re-extension but introduces complexity.

**Suspected root cause:** Lenis scroll events and the 200ms timer race. If a Lenis event arrives after the timer fires, tail gets re-extended.

**Suspected fix:** Increase timer delay (400ms) or use Lenis's `velocity` to detect settled state (but velocity is 0 at limit).

### P1 — First-frame overscroll activation
On initial page load, the overscroll sometimes activates at the hero frame. Suspected cause: `0 / limit.y = NaN` on early Lenis frames — `NaN > 0.97` is false but `NaN < 0.95` is ALSO false, so the reset branch never fires.

**Suspected fix:** Ensure `timerFired = false` and `tailTarget.set(0)` at mount, or add a `useRef(true)` that disables overscroll until first user scroll.

### P2 — Wheel handler relies on `animatedScroll` lagging reality
Wheel handler (line 177) checks `lenis.animatedScroll >= limit.y - 2`. But `animatedScroll` updates AFTER Lenis processes the event — the handler reads the PREVIOUS frame's value. This is why overscroll often needs 2 scrolls to trigger.

**Suspected fix:** Check `lenis.target` instead of `lenis.animatedScroll` if available in Lenis v1.3.

## Architecture Decisions
- **No smoothing on baseZ** — User rejected spring smoothing on main Z (felt like "inertia")
- **Spring only on tail offset** — ζ≈1.15 (slightly overdamped) for smooth extension/retraction without bounce
- **Position-mapped tail** — Tail extends as function of scroll progress (0→120px over last 3%), giving natural-feeling seamless overscroll. Combined with wheel handler for re-trigger
- **Raw wheel events** for overscroll detection at limit (bypass Lenis which caps velocity to 0 at limit)

## Next Steps
1. Fix the P0 timing issue — increase timer delay or use a Lenis scroll-end detection
2. Fix P1 first-frame bug — add mount guard or ensure NaN progress doesn't skip the `<0.95` reset
3. Test the overscroll flow end-to-end: scroll to end (1 gesture), hold 200ms, snap, scroll back, scroll forward again

## Quick Reference
```bash
npm run dev    # Dev server (Turbopack)
npm run build  # Production build (13.8s)
npm run start  # Production server
```
