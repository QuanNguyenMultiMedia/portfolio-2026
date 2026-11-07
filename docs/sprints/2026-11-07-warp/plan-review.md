# Plan review (Plan agent, 2026-11-07), all 12 findings folded

1. Wrong line refs (page.tsx testimonials 54-58, eye 61-64; PrintRun onFocus 106-112; MobileNavbar fallback 214, nav at 118). → packets re-anchor with quoted snippets.
2. Done-whens already true today (A5 grid exists home.css:14; Navbar has no hex; "sheet reel" exists; "tick" exists). → A5 dropped; checks now prove the change (checks/A1.mjs, hudKey, TICK_DEG).
3. `perspective` on `::view-transition` doesn't reach image-pair children; old snapshot near-empty after exit fade. → transform-perspective in keyframes; old warp only on Back.
4. translateZ(600px) at perspective 1400 ≈ 1.75× zoom flash. → capped 120px.
5. popstate fires for Back and Forward; location already updated; data-warp never cleared; React may skip VT. → history.state index, lastPath, clearWarp, manual V1.
6. translate Z without perspective parent is flat outside home. → scale + opacity.
7. data-warp-next had no reader; StarField + WarpField double on contacts. → E2 dropped; StarField deleted in H3.
8. designSystem.ts shared B1/D3; H1 cross-lane dependency; P2/P3 overlap. → warp.ts in W0; D3 owns designSystem.ts; P2 after P3.
9. E3 allowlist couldn't reach the files it needed. → reduced motion moved into each owning task.
10. Each Fountain has its own renderer; layout already mounts page-plate. → aurora mode on the existing page-plate.
11. Durability: idle streaks, dither in aurora, grain/misregister at rest. → all gated to motion.
12. Haiku can't do A1-A4 rewriting the same lines, H2 large rewrite, D2 missing index source. → one A1 skeleton task; H1 anchored on handleEnd; PrintRun emits "run-index".
