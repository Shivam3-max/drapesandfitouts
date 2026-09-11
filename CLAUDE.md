# Drapes Space Intelligence (DSI)

Digital platform for **Drapes & Fitouts** — a UAE supplier of curtains, blinds, Smart Film,
carpets, wallpaper and motorised shading (registered at SRTIP, Sharjah; sells into Dubai).

The product principle, from the strategy work: **do not build a catalogue website.** Build the
layer that diagnoses a space, prescribes a solution, prices it as a range, and hands the customer
an explained recommendation before anyone tries to sell them anything.

Dev server: `npm run dev` → http://localhost:3720
Engine tests: `npm run test:engine`

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · GSAP · three.js · no database yet.
Assessments persist in the browser (`localStorage`) behind one replaceable module.

## Architecture

```
src/lib/taxonomy.ts        Shared vocabulary: contexts, problems, rooms, orientations,
                           glazing, scores, tiers. Ids are contracts — add, never rename.
src/lib/catalogue.ts       17 solution families. Each carries what it is WRONG for, the
                           survey checklist, indicative price basis and FAQs.
src/lib/space-dna.ts       The recommendation engine. Deterministic, versioned, explainable.
src/lib/pricing.ts         Estimator. Separate lifecycle from the rules on purpose.
src/lib/assessment-store.ts  Browser persistence + image downscaling. Swap this for the API.
src/data/communities.ts    12 Dubai communities/districts with their real glazing problem.
src/data/projects.ts       Case studies (illustrative photography, flagged as such).
```

### Rules that must not be broken

1. **No LLM in the pricing or specification path.** The engine recommends only from the
   catalogue. Generated text may explain a rule output; it may never select a product,
   compute a price, or state a technical fact the rule output does not contain.
2. **Customer-facing prices are always ranges**, and Smart Film and skylight blinds are never
   given a customer-facing figure at all — they return a survey (`SURVEY_ONLY` in pricing.ts).
3. **Every measurement is unverified until a surveyor records it.** The copy says so and the
   estimator flags it. Nothing is manufactured from a customer estimate.
4. **The customer's stated problem outranks any derived score.** `runSpaceDna` applies stated
   problems after the derived base, and the Essential tier picks the strictest need — an
   engine test guards this (a bedroom asking for darkness must not get a sunscreen blind).
5. **Room photographs stay on the device** until the customer sends them. PDPL consent is
   explicit, unbundled and logged with a timestamp; `/privacy` lets a visitor delete local data.

### The engine, in short

`runSpaceDna(input)` → six scores (solar, glare, privacy, blackout, automation, completion),
a confidence level, a headline, three tiers (Essential / Signature / Intelligent), the survey
checklist, and the list of rules that fired with plain-English explanations. `RULESET_VERSION`
is stamped on every result so an old recommendation can be reproduced.

Rule weights (`ROOM_WEIGHTS`, `CONTEXT_PRIVACY_FLOOR`, `ORIENTATIONS[].solarLoad`) are product
knowledge, not code. They are written out longhand so the Drapes product expert can review them.

## Design system

**Pure white ground.** `body` is `#ffffff`. Depth comes from one fixed, heavily blurred ambient
field (`.ambient` in globals.css — soft brass/grey washes at 42px blur) and from glass panels
(`.glass`, `.glass-strong`) floating over it. No beige page backgrounds, no bordered "document"
blocks.

**Type.** Cormorant Garamond for display (`.display`, `.display-md`) — light weight, italic for
the accent word — Archivo for UI and body, IBM Plex Mono for micro-labels (`.eyebrow`). Accent
brass `#9a7526`, usually as one italic phrase per heading.

**Copy is short by rule.** Headlines are 2–5 words. Supporting lines are one sentence. Anything
longer belongs on a solution or project page, not on a landing section. If a section needs a
paragraph to make sense, the image is doing too little.

**Images carry the page.** Every image goes through `<Frame>` (`src/components/media.tsx`). With
no `src` it renders a designed, *labelled* placeholder — the label is the shot direction for the
photographer. Pass `src` later and the crop, ratio and caption stay identical. Collages use mixed
ratios (`4/5`, `3/4`, `16/9`, `21/9`) in a bento grid, not a uniform tile grid.

**Motion.** GSAP + ScrollTrigger via `<Reveal>` and `<Parallax>` (`src/components/reveal.tsx`).
GSAP sets the start state, never CSS, so content is visible if the script fails. The hero runs a
typographic cycle — *Your space. / Your light. / Your privacy.* — with per-character masking.

**WebGL.** `src/components/light-field.tsx` — a single full-bleed shader plane (raw three.js, no
scene graph, so it can never deadlock on measurement). It renders sheer fabric catching afternoon
light. It pauses when hidden or off-screen, and a CSS gradient sits underneath, so the hero reads
correctly without WebGL.

**In-page navigation.** Long pages carry `<SectionNav>` (sticky pill bar under the header, active
section tracked by IntersectionObserver). Anchors clear the header via `scroll-margin-top: 148px`.
Used on `/solutions`, `/solutions/[slug]`, `/smart-film`, `/technology`, `/care`, `/professionals`.

**Interactive set pieces.** `<RoomDemo>` (five states of one room, on `/technology`) and
`<FilmSwitch>` (clear ↔ private, on `/` and `/smart-film`) are drawn in CSS — no photography, no
WebGL, transitions on interaction only.

## The 3D room

`src/components/room-3d.tsx` builds a real room in three.js — window wall, mullions, sky and
skyline outside, sofa, rug, console — and layers the products onto the glass: sheer, blackout,
sunscreen roller and Smart Film, at morning, midday or 4 pm west sun. Drag to look around.

Rules learned the hard way, both of which are real-user bugs and not just test problems:

- **Draw a first frame immediately** (`frame(true)`) and again on state change while the tab is
  hidden. A tab opened in the background reports `document.hidden`, rAF is paused, and a loop that
  only renders inside rAF shows an empty canvas.
- **Never gate the render loop on `document.hidden`** — rAF is already throttled in background
  tabs. Gate on the IntersectionObserver instead.
- Camera framing adapts to aspect ratio in `resize()`: a phone in portrait needs a wider FOV and a
  further camera, or the window fills the frame and the room disappears.
- `preserveDrawingBuffer: true` so the view can be captured or saved.

`<Visualiser>` wraps it with controls at `/visualiser`; the home page uses it non-interactively as
the first door.

## Home is eight doors

`/` is one screen: a live 3D room, "Assess my space", and six product doors, each labelled in plain
words (`src/components/doors.tsx`). No long marketing page — everything it used to say lives on the
page it links to. `/platform` is where the differentiating features are shown, each labelled
**Live now / In build / Next**; never present an unbuilt feature as live.

## Responsive

Audited at 320, 360, 390, 768, 820 and 1024: no horizontal overflow on any route, no clipped text,
tap targets ≥ ~40px. Doors go 1 → 3 columns at `md`; products 2 → 3 → 6. The flow chrome and the
visualiser controls are built mobile-first (horizontal chip scrollers, full-width primary action).

## Forms are flows, never pages of fields

Every form runs through `<Flow>` (`src/components/flow.tsx`): **one question per screen**, on its
own page, with no site header or footer to distract. Choosing a single answer advances by itself
after ~260ms; multi-select, text and photo steps have one Continue. Optional steps show Skip.
Back works, and so does the browser's own back button (each step pushes history). Number keys
1–9 pick an option, Enter continues.

Steps are declared as data, not JSX — `single`, `multi`, `counter`, `compass`, `fields`,
`textarea`, `photo`, `consent`. Add a flow by writing a step list, not by building a form.

| Flow | Route | Steps |
| --- | --- | --- |
| Space assessment | `/assess` | 15 |
| Book a visit | `/book` | 8 |
| Register a project | `/professionals/register` | 9 |
| Smart Film glass check | `/smart-film/check` | 5 + verdict |

Route groups keep the two worlds apart: `src/app/(site)/*` gets the header and footer,
`src/app/(flow)/*` gets the minimal flow chrome (`(flow)/layout.tsx` — name and a Close link).

## Not built yet (in build-plan order)

Admin + lead pipeline · survey workflow and measurement capture · quote builder and versioned
proposal page · project milestones · installer PWA · digital project passport · designer portal ·
Arabic RTL mirror · WhatsApp Business API notifications · room visualizer (buy the vision API,
own the comparison UI).
