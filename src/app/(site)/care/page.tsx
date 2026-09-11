import type { Metadata } from "next";
import Link from "next/link";
import { Frame } from "@/components/media";
import { Reveal } from "@/components/reveal";
import { SectionNav } from "@/components/section-nav";

export const metadata: Metadata = {
  title: "Drapes Care",
  description: "An annual service membership, and the digital passport of what is installed in every room.",
};

const INCLUDED = [
  ["Motor inspection", "Checked, recalibrated, re-tensioned yearly."],
  ["Fabric servicing", "Cleaning cycle around your household."],
  ["Film diagnostics", "Switching and edges checked early."],
  ["Automation check", "Scenes rebuilt after phone or router changes."],
  ["Carpet care", "Deep clean and repair from attic stock."],
  ["Priority repair", "Members go to the front of the queue."],
];

const PASSPORT = [
  ["Living room", "Sunscreen 3% charcoal · motorised · 4 openings", "Warranty to Mar 2031"],
  ["Living room", "Wave curtain, lined · motorised track", "Warranty to Mar 2031"],
  ["Master bedroom", "Blackout roller, side channels · 2 openings", "Warranty to Mar 2031"],
  ["Media room", "Blackout, sealed cassette · acoustic carpet", "Warranty to Mar 2031"],
  ["Stairwell", "Motorised sunscreen · 5.4 m drop", "Warranty to Mar 2031"],
];

export default function CarePage() {
  return (
    <>
      <section className="relative pb-8 pt-12 sm:pt-16">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal selector=".h-el">
            <p className="eyebrow h-el">After the installation</p>
            <h1 className="display h-el mt-5 text-[clamp(38px,6vw,74px)]">
              We keep <span className="italic text-brass">the record.</span>
            </h1>
            <p className="lede h-el mt-6">Every room, every motor, every warranty date.</p>
            <div className="h-el mt-8">
              <Link href="/book?context=care" className="btn btn-solid">
                Ask about Drapes Care
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <div className="grid grid-cols-2 gap-3">
              <Frame label="Service visit · motor inspection" ratio="4/5" tag="Service" />
              <Frame label="Fabric care · curtain cleaning" ratio="4/5" tag="Care" />
            </div>
          </Reveal>
        </div>
      </section>

      <SectionNav
        items={[
          { id: "passport", label: "Project passport" },
          { id: "included", label: "What's included" },
        ]}
        cta={{ href: "/book?context=care", label: "Ask about Care" }}
      />

      <section id="passport" className="relative py-14">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="glass overflow-hidden rounded-[4px]">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-7 py-5">
                <p className="font-display text-[24px]">Passport · Villa, Dubai Hills</p>
                <p className="eyebrow">Issued at handover</p>
              </div>
              {PASSPORT.map(([room, spec, warranty]) => (
                <div
                  key={room + spec}
                  className="grid gap-1 border-b border-line px-7 py-4 last:border-b-0 sm:grid-cols-[140px_1fr_auto] sm:gap-5"
                >
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">{room}</p>
                  <p className="text-[14.5px] text-ink-2">{spec}</p>
                  <p className="font-mono text-[10.5px] text-ink-3">{warranty}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="included" className="relative py-14">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <h2 className="display-md text-[clamp(26px,3.4vw,42px)]">
              What a year <span className="italic text-brass">includes.</span>
            </h2>
          </Reveal>
          <Reveal selector=".inc" stagger={0.05} className="mt-8">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {INCLUDED.map(([t, b]) => (
                <div key={t} className="inc">
                  <Frame label={`${t} — service image`} ratio="4/3" tag="Care" />
                  <p className="mt-3 font-display text-[21px] leading-tight">{t}</p>
                  <p className="mt-1.5 text-[13px] leading-snug text-ink-3">{b}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="mt-10">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
              Quoted per property · renewable annually · cancellable
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
