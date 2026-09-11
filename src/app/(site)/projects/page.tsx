import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS, SECTOR_LABEL } from "@/data/projects";
import { Frame } from "@/components/media";
import { Reveal, Parallax } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Projects",
  description: "Villas, offices, clinics and hotels across the UAE.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="relative pb-10 pt-14 sm:pt-20">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal selector=".h-el">
            <p className="eyebrow h-el">Projects</p>
            <h1 className="display h-el mt-5 max-w-[13ch] text-[clamp(42px,7vw,86px)]">
              Rooms we <span className="italic text-brass">finished.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      {PROJECTS.map((p, i) => (
        <section key={p.slug} className="relative py-8">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
            <Reveal>
              <Link href={`/projects/${p.slug}`} className="group block">
                <div
                  className={`grid gap-3 sm:gap-4 lg:grid-cols-12 lg:items-end ${
                    i % 2 ? "lg:[direction:rtl]" : ""
                  }`}
                >
                  <div className="lg:col-span-8 lg:[direction:ltr]">
                    <Frame
                      label={`${p.community} · ${p.states[1].label.toLowerCase()}`}
                      ratio="16/9"
                      tag={SECTOR_LABEL[p.sector]}
                    />
                  </div>
                  <div className="lg:col-span-4 lg:[direction:ltr]">
                    <Parallax distance={14}>
                      <Frame label={`${p.title} · detail`} ratio="4/5" tag="Detail" />
                    </Parallax>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-line pt-5">
                  <h2 className="display-md text-[clamp(24px,3vw,38px)]">{p.title}</h2>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
                    {p.community} · {p.openings} openings · {p.year}
                  </p>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="relative py-20">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="glass flex flex-wrap items-center justify-between gap-6 rounded-[4px] px-8 py-9">
              <h2 className="display-md text-[clamp(24px,3vw,36px)]">
                Your room <span className="italic text-brass">next.</span>
              </h2>
              <Link href="/assess" className="btn btn-solid">
                Assess my space
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
