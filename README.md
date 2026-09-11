# Drapes Space Intelligence

Front end for **Drapes & Fitouts** — curtains, blinds, Smart Film, carpets, wallpaper and
motorised shading across the UAE.

Not a catalogue website. The site diagnoses a space, prescribes a solution, prices it as a range
and explains its reasoning — before anyone is sold anything.

```bash
npm install
npm run dev          # http://localhost:3720
npm run test:engine  # rule-engine checks
npm run build        # production build
```

## What's in it

| Area | Route | Notes |
| --- | --- | --- |
| Entry | `/` | Eight doors on one screen, including a live 3D room |
| 3D visualiser | `/visualiser` | three.js room: sheer, blackout, sunscreen, Smart Film × time of day |
| Space assessment | `/assess` | 15-step flow → a scored Space DNA and three prescriptions |
| Result | `/assessment/[token]` | Scores, tiers, indicative ranges, the rules that fired |
| Solutions | `/solutions`, `/solutions/[slug]` | 17 families, each with what it is *wrong* for |
| Smart Film | `/smart-film`, `/smart-film/check` | Category page plus a glass-suitability screening flow |
| Platform | `/platform` | The differentiating features, labelled Live now / In build / Next |
| Projects, Areas | `/projects`, `/spaces` | Case studies and per-community specification notes |
| Trade | `/professionals`, `/professionals/register` | Designer Club and project registration flow |
| Booking | `/book` | 8-step site-visit flow, handed off to WhatsApp |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · GSAP · three.js.
No database yet — assessments persist in the browser behind one replaceable module
(`src/lib/assessment-store.ts`).

## Before this goes to a real audience

- Photography: every image is a labelled `<Frame>` placeholder; the label is the shot direction.
- Project case studies are illustrative and flagged as such in `src/data/projects.ts`.
- Rule weights in `src/lib/space-dna.ts` need a review session with the Drapes product expert.
- Prices in `src/lib/catalogue.ts` are indicative market ranges, not the company's price list.

Engineering conventions and the rules that must not be broken are in [CLAUDE.md](CLAUDE.md).
