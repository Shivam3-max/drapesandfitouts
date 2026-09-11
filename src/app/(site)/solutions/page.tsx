import type { Metadata } from "next";
import Link from "next/link";
import { SOLUTIONS } from "@/lib/catalogue";
import { GROUP_META, RUNGS, type Group } from "@/lib/taxonomy";
import { Frame } from "@/components/media";
import { Reveal } from "@/components/reveal";
import { formatAed } from "@/lib/pricing";
import { SectionNav } from "@/components/section-nav";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Curtains, blinds, Smart Film, carpets, wallpaper and automation — 17 families, each with what it is right for and what it is wrong for.",
};

const ORDER: Group[] = ["light", "softness", "privacy", "surface", "intelligence"];

export default function SolutionsPage() {
  return (
    <>
      <section className="relative pb-10 pt-14 sm:pt-20">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal selector=".h-el">
            <p className="eyebrow h-el">Solutions</p>
            <h1 className="display h-el mt-5 max-w-[14ch] text-[clamp(42px,7vw,86px)]">
              Everything <span className="italic text-brass">we fit.</span>
            </h1>
            <p className="lede h-el mt-6">Seventeen families. One of them is right for your window.</p>
          </Reveal>

          <Reveal className="mt-12">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {RUNGS.map((r, i) => (
                <div key={r.id}>
                  <Frame label={`${r.label} control`} ratio="4/3" tag={`0${i + 1}`} />
                  <p className="mt-3 font-display text-[22px] leading-none">{r.label}</p>
                  <p className="mt-1.5 text-[13px] text-ink-3">{r.line}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <SectionNav
        items={ORDER.map((g) => ({ id: g, label: GROUP_META[g].label }))}
        cta={{ href: "/assess", label: "Assess my space" }}
      />

      {ORDER.map((group) => {
        const items = SOLUTIONS.filter((s) => s.group === group);
        return (
          <section key={group} id={group} className="relative py-14">
            <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
              <Reveal>
                <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
                  <h2 className="display-md text-[clamp(26px,3.4vw,42px)]">
                    {GROUP_META[group].label}
                  </h2>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
                    {GROUP_META[group].line}
                  </p>
                </div>
              </Reveal>

              <Reveal selector=".sol" stagger={0.05} className="mt-8">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                  {items.map((s) => (
                    <Link key={s.slug} href={`/solutions/${s.slug}`} className="sol group block">
                      <Frame label={`${s.name} — installed`} ratio="4/5" tag={s.rungs[0]} />
                      <p className="mt-3 font-display text-[21px] leading-tight">{s.name}</p>
                      <p className="mt-1 text-[13px] leading-snug text-ink-3">{s.tagline}</p>
                      <p className="tnum mt-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-brass">
                        from AED {formatAed(s.price.low)}
                      </p>
                    </Link>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}

      <section className="relative py-20">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[4px]">
              <Frame label="Full-bleed · fabric library, sample books" ratio="21/9" rounded={false} />
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="glass-strong max-w-[40ch] rounded-[3px] px-8 py-9 text-center">
                  <h2 className="display-md text-[clamp(24px,3.2vw,38px)]">Not sure which?</h2>
                  <p className="mt-3 text-[15px] text-ink-2">Five minutes. We&apos;ll tell you.</p>
                  <Link href="/assess" className="btn btn-solid mt-6">
                    Assess my space
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
