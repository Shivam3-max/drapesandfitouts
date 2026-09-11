import type { Metadata } from "next";
import Link from "next/link";
import { Frame } from "@/components/media";
import { Reveal } from "@/components/reveal";
import { SectionNav } from "@/components/section-nav";
import { SOLUTIONS } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "For architects & designers",
  description: "Specification support, sample kits, project registration with attribution, protected pricing.",
};

const OFFER = [
  ["Specification support", "Performance data and buildable details, during design."],
  ["Sample kits to the studio", "Curated to the brief, not the whole library."],
  ["Project registration", "Attribution holds, even if the client calls us direct."],
  ["Protected pricing", "Held for the project, not requoted every time dates move."],
  ["Programme coordination", "Building approvals and access permits handled by us."],
  ["One accountable partner", "Window, surface and control in one package."],
];

const NEED = [
  "Elevations or a window schedule",
  "The ceiling detail — pelmet or not",
  "Power at the head, if motorised",
  "The dates that cannot move",
];

export default function ProfessionalsPage() {
  return (
    <>
      <section className="relative pt-10">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-[4px]">
            <Frame label="Designer studio · sample books and drawings" ratio="21/9" rounded={false} priority />
            <div className="absolute inset-0 flex items-end p-5 sm:p-8">
              <div className="glass-strong max-w-[44ch] rounded-[3px] px-7 py-7">
                <p className="eyebrow">Designer Club</p>
                <h1 className="display-md mt-3 text-[clamp(28px,4vw,52px)]">
                  From concept to <span className="italic text-brass">commissioning.</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionNav
        items={[
          { id: "offer", label: "What you get" },
          { id: "need", label: "What we need" },
          { id: "library", label: "Spec library" },
        ]}
        cta={{ href: "/professionals/register", label: "Register a project" }}
      />

      <section id="offer" className="relative py-14">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal selector=".off" stagger={0.05}>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {OFFER.map(([t, b]) => (
                <div key={t} className="off">
                  <Frame label={`${t} — supporting image`} ratio="4/3" tag="Trade" />
                  <p className="mt-3 font-display text-[22px] leading-tight">{t}</p>
                  <p className="mt-1.5 text-[13.5px] leading-snug text-ink-3">{b}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="need" className="relative py-14">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="glass grid gap-8 rounded-[4px] p-7 sm:p-10 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <h2 className="display-md text-[clamp(26px,3.4vw,40px)]">
                  Send four things. <span className="italic text-brass">We spec it right first time.</span>
                </h2>
                <ul className="mt-7 space-y-3">
                  {NEED.map((n) => (
                    <li key={n} className="flex items-center gap-3 text-[15px] text-ink-2">
                      <span className="h-px w-6 bg-brass" />
                      {n}
                    </li>
                  ))}
                </ul>
                <Link href="/professionals/register" className="btn btn-solid mt-8">
                  Register a project
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Frame label="Window schedule mark-up" ratio="1/1" tag="Drawing" />
                <Frame label="Fabric samples on a desk" ratio="1/1" tag="Samples" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="library" className="relative py-14">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <p className="label">Specification library</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SOLUTIONS.map((s) => (
                <Link
                  key={s.slug}
                  href={`/solutions/${s.slug}`}
                  className="rounded-full border border-line bg-white/70 px-4 py-2.5 text-[13px] text-ink-2 transition-colors hover:border-ink hover:text-ink"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
