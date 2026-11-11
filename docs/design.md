# Design System: Riso Run

Source of truth: the After Effects portfolio `2026_Port_Static/MainTitle.aep`, comps `01.Title`, `02. Intro`,
`03.DefrasoftTitle`, `04.Defrasoft_info`, `11.HerondLabs_End`, `12.End`. Read 2026-10-21 (layer data) and
2026-11-05 (rendered stills in `MainTitle.aep_AME/`). Supersedes the "Tech-Luxe Editorial" system.

Every board is a simulated **risograph print**. Colour is spot ink on paper, each ink is its own layer (a plate),
and the look comes from how those layers **overlap**: blend modes that overprint like ink, plates that sit slightly
out of register, every plate breaking into its own halftone and grain, and gradients rolled like a split-fountain
drum. Typography is printed through the same process. The site must be built as a print run, not as a screen
design with a texture laid on top.

## 1. Principles

1. **Riso is the medium.** Every coloured element is an ink plate. Nothing is a flat screen colour, a glow, or glass.
2. **Overlap makes the colour.** New colours appear where inks overprint (Multiply, Hard Light), never from a picked
   mixed swatch. Every overlap is placed on purpose: type over type, ink over photo, plate over plate.
3. **Imperfection is systematic.** Misregistration, uneven density, dot screens and paper tooth come from a fixed
   setup (per-ink offset, angle and density) shared by the whole page, so it reads as one print run.
4. **Two voices, both printed.** Junicode (big serif; Lastik on the AE boards) speaks; Product Sans explains. Display type gets full riso
   treatment; small body copy prints clean in ink black.
5. **Paper is the light.** Where there's no ink, there's paper. Light stock is the default; the dark theme is the
   same job on black board: charcoal paper, bone-white for the black plate, inks screened instead of multiplied
   (`--blend`), blue-violets mixed lighter for contrast. Tokens in `src/styles/riso.css` (`html.dark`).

## 2. The print model

### Paper

| Token | Hex | Source |
|---|---|---|
| `--paper` | `#F2F3F5` | sampled, `11`/`12` ground |
| `--paper-hi` | `#F5F7FA` | sampled, `04` left field |
| `--paper-tooth` | `Texturelabs_Grunge_305L.jpg` | locked on every comp |

The paper texture sits on every board. On the web it's a tiling paper texture plus fibre noise, and inks multiply
into it, so the tooth shows through every ink.

### Ink set

At most three inks per screen, as on a real riso job. Values are the AE fills; names are the closest riso stock.

| Token | Hex | Riso analogue | Plate role |
|---|---|---|---|
| `--ink-black` | `#000000` | Black | Body, rules (solid, as AE body layers print: measured core `#000`) |
| `--ink-display` | `#000` at 92% | Black | Display serif: AE display layers are `#000` at 80%, measured core `#131314` on paper |
| `--ink-blue` | `#00A8FF` | Aqua / Blue | Project lead (`11` "In-house, 2025–2026…") |
| `--ink-violet` | `#3A3EFA` | Medium Blue | Closing lines (`12` "Thanks for reaching the end.") |
| `--ink-indigo` | `#3000FF` | Purple | Under-plate for violet, set off register |
| `--ink-rose` | `#E07AB0` | Fluorescent Pink | Herond capitals, overprints blue |
| `--ink-mint` | `#2AEED4` | Mint | Split-fountain plate (blooms) |
| `--ink-coral` | `#FF5C36` | Fluorescent Orange | Reserve; present but hidden in `12` |
| `--ink-cream` | `#E5E6E1` | White (opaque) | Knock-out type on a saturated plate (`04` right column) |

### Overprint (blend modes)

The comps run coloured layers in **Multiply** and **Hard Light**, not Normal (`12.End`: the closing lines are
Multiply and Hard Light, with a duplicate plate parented underneath).

- Default for every ink plate: `multiply`. Two inks crossing make a third, darker colour, like real overprint.
- `hard-light` for the one plate that must hit harder than the rest: the sign-off word, or a display word over a photo.
- Opaque Normal is only for knock-out (cream type on a saturated plate) and paper.

### Register

Key elements print as two plates that don't line up:

- `01.Title`: the Lastik name over a serif copy of itself (`NGUYEN 3` parented to `NGUYEN 4`).
- `12.End`: the violet lines over an indigo copy (`… 3` parented to `… 4`).
- `11.HerondLabs_End`: the Herond capitals overprinting the blue sans lead.

Rule: each ink has a **fixed register offset** for the whole page (for example blue `(+1, 0)`, violet `(0, +1)`,
indigo `(-2, +1)` CSS px, scaled to about 1.5% of the font size on display type). Offsets are per ink, never per
element, so the misregistration is consistent the way a real misaligned drum is.

### Screens (halftone)

Each ink plate breaks into its own dot screen, at its own angle, as the dots inside the "See ya!" and Herond
letterforms show.

| Ink | Screen angle | Cell |
|---|---|---|
| Black | 45° | 3 px |
| Blue | 15° | 3.5 px |
| Violet / indigo | 75° | 3.5 px |
| Rose | 0° | 3.5 px |
| Mint (fountain) | 30° | 4 px |

Solid areas still show the screen faintly. Density varies ±8–12% across a shape through low-frequency noise, so the
ink looks rolled on by a drum.

### Split fountain (the gradients)

The mint–aqua blooms (`02` intro card, `04` right column, `01` field) and the rainbow bars behind `12.End` are
**split-fountain** prints: more than one ink loaded on one drum, blending across the sheet. Sampled ramp:

`#C2EEF7` → `#75E2F9` → `#2AEED4` → `#7DEBDA` → `#9AD6A4`

They are printed plates like any other: halftoned at the fountain angle, multiplied onto paper, with blurred,
fuzzy edges where ink feathers. `12.End` adds a pale, warm wash (`#F5EFC8`, `#F0E0E5`, `#E6E4F6`) at 30–50%.
`11` uses a blue→rose ramp inside letterforms: `#3A3EFA` → `#9B6FD0` → `#E07AB0`.

### What stays clean

Small Product Sans body copy prints in solid `--ink-black` with no screen and no offset. That keeps AA contrast and
reading comfort, and real riso small text is solid too.

## 3. Typography

| Role | Family | AE source | Notes |
|---|---|---|---|
| Display | **Junicode 2** (SIL OFL, open-foundry.com; variable wght 300–700, Vietnamese + true italics) on the web; Lastik on the AE boards | `Lastik-Free`, `LastikTest-Regular` (AE only) | High-contrast serif. Roman for titles, italic for exclamations ("Hello!", "See ya!", the name lockup). Always printed as an ink plate. |
| Text | **Product Sans** Regular / Bold / Italic | `ProductSans-*` | Body, leads, captions. Italic only for asides ("Beautiful UIs created by a teammate, I just did the motion.") |

**Licensing (blocker before shipping):** the display face is solved: the web uses Junicode (SIL OFL), and the Lastik trial stays AE-only.
Product Sans is still Google's proprietary face; pick a licensed geometric sans as its stand-in. Check current licence terms before building.

### Scale

The boards are 2800 px wide; sizes convert to viewport-relative `clamp()` from their share of board width.

| Role | AE size / 2800 | Token | Value |
|---|---|---|---|
| Display XL ("See ya!", title words) | 420–656 px | `--t-display-xl` | `clamp(4.5rem, 19vw, 22rem)` |
| Display ("Hello!", "Contents") | 220–320 px | `--t-display` | `clamp(3rem, 10vw, 11rem)` |
| Column display (`04` right column) | 172–203 px | `--t-display-col` | `clamp(2.25rem, 6.5vw, 7rem)` |
| Lead (sans headlines `04`/`11`/`12`) | 128–137 px | `--t-lead` | `clamp(1.75rem, 4.8vw, 5rem)` |
| Contents list (serif) | 90 px | `--t-list` | `clamp(1.25rem, 3.2vw, 3rem)` |
| Body | 36 px | `--t-body` | `clamp(0.95rem, 1.25vw, 1.25rem)` |

Display serif at 0.85–0.95 leading. Lead sans at 1.0 leading, −0.02em. Body at 1.35 leading, 38–48ch measure.

### Type behaviours

- **Every letter holds the baseline.** No per-letter baseline stepping, jitter or scattered glyphs, anywhere: the
  wobble read as broken type. Roughen and compound blur stay light enough that Junicode keeps its drawn shape
  (BlurMap: border 0.8, σ 2.4 comp px), legibility before AE fidelity.
- **No eyebrows or counters.** No index numerals (01, 02 / 04), kicker labels over headings, or category lines under
  titles. Type size, rules and position carry the order.
- **Double-plate lockups.** Display words print twice in two inks, off register (see Register).
- **Overprinted stacks.** Project names run as stacked serif capitals (`11` "HEROND / BROWSER") printed over the
  sans lead, so the overlap creates a third colour.
- **Staggered indents.** One sentence steps in and out line by line (`12` "Thanks for / reaching the end."). Set the
  indents per line in the markup (`margin-inline-start` in `ch`).
- **Defocused plate.** "Hello!" prints big and soft behind crisp text, like a plate printed slightly out of
  focus. Blur only the display plate.

## 4. Layout

- Board margin is about 155 px of 2800 (5.5%). Web: `--margin: clamp(1.25rem, 5.5vw, 7rem)`.
- A single full-width hairline rule in ink black opens a section (`04`, `02` Contents). Rules never box content.
- Narrow text measures, with large empty paper fields left for ink to land in.
- Two zones on `11`/`12`: an expressive left side (display plates, imagery) and a quiet right side of small body
  columns starting partway down. Grid: 12 columns, expressive 1–6, text 8–12.
- Imagery is straight-edged and printed: duotoned into one or two inks, screened, multiplied onto paper, and
  overlapped by display type (`12` portrait under "See ya!").

## 5. The AE effect stacks (read from MainTitle.aep, 2026-11-05)

Read offline from the .aep binary. These are the stacks the web layers replay.

**Bloom layers** (`Shape Layer 4/12/2/5` in `01`/`02`, `Shape Layer 9` in `03`): a star-shaped radial G-Fill, then

1. Gaussian Blur 189
2. Wave Warp: direction 230.7°, width 518, self-animating
3. Gaussian Blur 189
4. Colorama: phase −43°, phase keyframed in `03`
5. Gaussian Blur 189
6. GGGlasswork ribs, angle 45°
7. CC Radial Blur: zoom 153 from centre (0.52, 0.99)
8. AGP Retro Dither: ordered dither, 14 levels, 4 px
9. PEDG2

Motion comes from four sources: Rotate Z keyframed on the blooms, Wave Warp running on its own, Colorama phase cycling, and blob Position drifting in `03`.

**Type**: every text layer carries Roughen Edges (border 2.4, complexity 11). In `12` the parameters are linked to one master on `Adjustment Layer 7`, so the ink bleed is global. Display words add Compound Blur driven by a `BlurMap` layer (Fractal Noise, contrast 546, scale 507), so the defocus varies across the word. `03` keys the roughen border. Title lockups use a text animator with Skew 24 and opacity 80%.

**Paper**: the Texturelabs grunge plate sits on top via Tile and Levels.

**Print screen**: dither is ordered (Bayer), not round halftone. §2 "Screens" is the CSS approximation for type; the blooms use the ordered dither.

## 6. Web implementation

**One WebGL compositor (OGL) prints the page.** Each plate is a mask (display text rendered to canvas or as SDF
text, shapes, duotoned images). The compositor:

1. colourises each mask with its ink;
2. applies that ink's screen (angle, cell) and density noise;
3. offsets it by that ink's register vector;
4. multiplies it onto the paper texture (Hard Light where the plate is flagged);
5. adds grain on top (hash noise at 12 fps, 6–9%).

Split-fountain plates are generated in the same pass: a domain-warped field mapped through the fountain ramp,
drifting slowly (periods of 40–90 s), leaning 3–5% toward the pointer on a spring.

**CSS fallback** (no WebGL, reduced data, and all body copy): `mix-blend-mode: multiply` per plate, a duplicate
`::before` plate offset by `--register-*`, an SVG halftone mask, and an SVG `feTurbulence` grain tile.

Tokens: `--ink-*`, `--register-{ink}-x/y`, `--screen-angle-{ink}`, `--screen-cell-{ink}`, `--ink-density`,
`--paper*`.

Performance: render plates at 0.5–0.75× resolution where the screen hides it; one context; pause offscreen.

## 7. Motion

There is no keyframe audit yet (a read-only `ae_motion_graph` pass per comp is pending), so motion is provisional
and stays inside the print metaphor:

- Plates register in: they enter off register and settle into the page's fixed offsets, 700–900 ms,
  `cubic-bezier(0.16, 1, 0.3, 1)`, with inks staggered 60–90 ms apart (one drum after another).
- Fountain plates drift slowly and continuously; they don't react to scroll speed.
- Grain animates at 12 fps, never 60.
- The home run: only the camera moves sheets; nothing inside a sheet is displaced by the travel. Each part of a sheet
  is cued instead: printing in, in reading order, on `--ease-print` over `--t-register`, `--t-ink-stagger` apart;
  lifting off quicker on `--ease-lift`; media print in under a paper wipe. One rule set for every sheet (home.css, cues).
- Reduced motion: plates appear already in register with a 200 ms fade; fountains and grain hold a single frame.
  Screens and offsets stay, since they're static print properties.

## 8. Components

| Component | Spec |
|---|---|
| Section opener | Hairline rule, then the sans lead in one ink |
| Display plate | Lastik in two inks, off register, multiplied; may bleed off the frame |
| Fountain card | Rectangle of split-fountain ink with black body text on it (`02` intro card) |
| Fountain column | Full-height fountain plate with knock-out cream serif list (`04` right column) |
| Overprint stack | Stacked serif capitals in a ramp ink over a sans lead (`11`) |
| Contents list | Serif list, centred, under a hairline rule (`02`) |
| Aside | Product Sans italic, body size, in an empty field beside imagery |
| Printed photo | Duotone, screened, multiplied, overlapped by a display plate |
| Sign-off | Lastik italic "See ya!" in Hard Light over a printed portrait |

## 9. Retired from the old system

Dark ground, tech-blue `#0029FF` HUD accents, JetBrains Mono, Plus Jakarta and Inter, glass blur cards, corner
brackets, `SYS_` labels, the starfield, the globe, and any texture applied as a flat overlay.
