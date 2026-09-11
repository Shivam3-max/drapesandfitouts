import type { Metadata } from "next";
import Link from "next/link";
import { Frame } from "@/components/media";
import { Reveal } from "@/components/reveal";
import { SectionNav } from "@/components/section-nav";
import { RoomDemo } from "@/components/room-demo";
import { RUNGS } from "@/lib/taxonomy";
import { getSolution } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Automation & control",
  description: "Motors, tracks, switching and scenes — commissioned on site, recorded on your passport.",
};

const SCENES = [
  { name: "Good morning", lines: ["Sheer opens", "Sunscreen holds at 40%", "Blackout retracts"] },
  { name: "Work", lines: ["Sunscreen tracks the sun", "Meeting glass private", "Glare off the screens"] },
  { name: "Movie", lines: ["Blackout closes", "Sheer follows", "Film goes opaque"] },
  { name: "Away", lines: ["Curtains vary", "The house looks lived in", "Back to normal on arrival"] },
];

export default function TechnologyPage() {
  const motor = getSolution("motorisation")!;

  return (
    <>
      <section className="relative pb-8 pt-12 sm:pt-16">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 sm:px-8 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <Reveal selector=".h-el">
            <p className="eyebrow h-el">Automation</p>
            <h1 className="display h-el mt-5 text-[clamp(40px,6.4vw,80px)]">
              Twenty-five windows.
              <br />
              <span className="italic text-brass">One command.</span>
            </h1>
            <p className="lede h-el mt-6">Tap a state and watch the room answer.</p>
            <div className="h-el mt-8 flex flex-wrap gap-3">
              <Link href="/assess?problem=automation" className="btn btn-solid">
                Is it worth it here?
              </Link>
              <Link href="/solutions/motorisation" className="btn btn-ghost">
                Motorisation spec
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <RoomDemo />
          </Reveal>
        </div>
      </section>

      <SectionNav
        items={[
          { id: "ladder", label: "The ladder" },
          { id: "scenes", label: "Scenes" },
          { id: "spec", label: "What we support" },
          { id: "passport", label: "Passport" },
        ]}
        cta={{ href: "/book", label: "Book a visit" }}
      />

      <section id="ladder" className="relative py-14">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <h2 className="display-md text-[clamp(28px,3.8vw,46px)]">
              Four rungs. <span className="italic text-brass">Pay for the right one.</span>
            </h2>
          </Reveal>
          <Reveal selector=".rung" stagger={0.06} className="mt-8">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {RUNGS.map((r, i) => (
                <div key={r.id} className="rung">
                  <Frame label={`${r.label} control · detail`} ratio="4/5" tag={`0${i + 1}`} />
                  <p className="mt-3 font-display text-[22px] leading-none">{r.label}</p>
                  <p className="mt-1.5 text-[13px] text-ink-3">{r.line}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-brass">
                    {["Any single window", "3+ openings", "8+ openings", "Glass that changes state"][i]}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="scenes" className="relative py-14">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="glass rounded-[4px] p-7 sm:p-10">
              <h2 className="display-md text-[clamp(26px,3.4vw,42px)]">
                What the house <span className="italic text-brass">actually does.</span>
              </h2>
              <div className="mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {SCENES.map((s) => (
                  <div key={s.name}>
                    <p className="font-display text-[24px] leading-none">{s.name}</p>
                    <ul className="mt-4 space-y-2">
                      {s.lines.map((l) => (
                        <li key={l} className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="spec" className="relative py-14">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <Reveal>
              <p className="label">What we support</p>
              <dl className="mt-6">
                {motor.specs.map((s) => (
                  <div key={s.label} className="grid gap-1 border-t border-line py-4 sm:grid-cols-[140px_1fr] sm:gap-5">
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">{s.label}</dt>
                    <dd className="text-[14.5px] leading-snug text-ink-2">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="tnum mt-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-brass">
                AED 900–3,200 per motorised opening · electrical works separate
              </p>
            </Reveal>
            <Reveal>
              <div className="grid grid-cols-2 gap-3">
                <Frame label="Motor · tubular, in the tube" ratio="1/1" tag="Motor" />
                <Frame label="Track · recessed ceiling pelmet" ratio="1/1" tag="Track" />
                <Frame label="Wall switch and remote" ratio="1/1" tag="Control" />
                <Frame label="Commissioning on site" ratio="1/1" tag="Setup" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="passport" className="relative py-16">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="glass flex flex-wrap items-center justify-between gap-6 rounded-[4px] px-8 py-9">
              <div>
                <h2 className="display-md text-[clamp(24px,3vw,36px)]">
                  Every scene <span className="italic text-brass">written down.</span>
                </h2>
                <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
                  Motor models · channels · warranty dates · room by room
                </p>
              </div>
              <Link href="/care" className="btn btn-solid">
                Drapes Care
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
