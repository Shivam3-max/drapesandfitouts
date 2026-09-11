import type { Metadata } from "next";
import Link from "next/link";
import { FilmSwitch } from "@/components/film-tools";
import { Frame } from "@/components/media";
import { Reveal } from "@/components/reveal";
import { SectionNav } from "@/components/section-nav";
import { FaqSchema } from "@/components/schema";
import { getSolution } from "@/lib/catalogue";
import { PROJECTS } from "@/data/projects";

export const metadata: Metadata = {
  title: "Smart Film",
  description:
    "Switchable PDLC film for offices, clinics, boardrooms and homes in the UAE. Clear to private in under a second.",
};

const SECTORS = [
  { name: "Boardrooms", line: "Private for the meeting. Clear the rest of the week." },
  { name: "Clinics", line: "Private the moment the patient sits down." },
  { name: "Bathrooms", line: "Internal glazing, opaque on a switch." },
  { name: "Retail", line: "Display by day, private after hours." },
];

const TRUTHS = [
  ["It does not control heat.", "Film switches privacy. Hot glass still needs shading."],
  ["It goes opaque if power fails.", "That is the fail-safe. Worth knowing before you specify."],
  ["Not all glass can take it.", "Curved, textured or damaged glass rules it out."],
];

export default function SmartFilmPage() {
  const film = getSolution("smart-film")!;
  const filmProjects = PROJECTS.filter((p) => p.specified.some((s) => s.solution === "smart-film"));

  return (
    <>
      <FaqSchema faqs={film.faqs} />

      {/* hero */}
      <section className="relative pb-8 pt-12 sm:pt-16">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 sm:px-8 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <Reveal selector=".h-el">
            <p className="eyebrow h-el text-brass">Smart Film</p>
            <h1 className="display h-el mt-5 text-[clamp(40px,6.4vw,80px)]">
              Clear glass.
              <br />
              <span className="italic text-brass">Private in a second.</span>
            </h1>
            <p className="lede h-el mt-6">Switchable film on the glass you already have.</p>
            <div className="h-el mt-8 flex flex-wrap gap-3">
              <Link href="#suitability" className="btn btn-solid">
                Check your glass
              </Link>
              <Link href="/book" className="btn btn-ghost">
                Book a survey
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <FilmSwitch />
          </Reveal>
        </div>
      </section>

      <SectionNav
        items={[
          { id: "where", label: "Where it fits" },
          { id: "truths", label: "Straight answers" },
          { id: "suitability", label: "Check your glass" },
          { id: "spec", label: "Specification" },
          { id: "faq", label: "Questions" },
          ...(filmProjects.length ? [{ id: "projects", label: "Projects" }] : []),
        ]}
        cta={{ href: "/book", label: "Book a survey" }}
      />

      {/* where it fits */}
      <section id="where" className="relative py-14">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <h2 className="display-md text-[clamp(28px,3.8vw,46px)]">
              Where it beats <span className="italic text-brass">a blind.</span>
            </h2>
          </Reveal>
          <Reveal selector=".sec" stagger={0.06} className="mt-8">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {SECTORS.map((s) => (
                <div key={s.name} className="sec">
                  <Frame label={`${s.name} · film switched private`} ratio="4/5" tag="Film" />
                  <p className="mt-3 font-display text-[22px] leading-none">{s.name}</p>
                  <p className="mt-1.5 text-[13px] leading-snug text-ink-3">{s.line}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* straight answers */}
      <section id="truths" className="relative py-14">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="glass grid gap-8 rounded-[4px] p-7 sm:p-10 lg:grid-cols-3">
              {TRUTHS.map(([t, b]) => (
                <div key={t}>
                  <h3 className="display-md text-[24px]">{t}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{b}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* checker */}
      <section id="suitability" className="relative py-14">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="glass grid gap-8 rounded-[4px] p-7 sm:p-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
              <div>
                <p className="eyebrow">Screening tool · five questions</p>
                <h2 className="display-md mt-4 text-[clamp(28px,3.8vw,46px)]">
                  Is your glass <span className="italic text-brass">suitable?</span>
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-ink-2">
                  One question at a time. You&apos;ll get a straight answer — including the answers
                  that send you to a blind instead.
                </p>
                <Link href="/smart-film/check" className="btn btn-solid mt-8">
                  Check my glass
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Frame label="Glass · flat partition pane" ratio="1/1" tag="Suitable" />
                <Frame label="Glass · textured, film will not bond" ratio="1/1" tag="Not suitable" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* spec */}
      <section id="spec" className="relative py-14">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
            <Reveal>
              <p className="label">Specification</p>
              <dl className="mt-6">
                {film.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="grid gap-1 border-t border-line py-4 sm:grid-cols-[140px_1fr] sm:gap-5"
                  >
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">
                      {spec.label}
                    </dt>
                    <dd className="text-[14.5px] leading-snug text-ink-2">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="tnum mt-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-brass">
                AED 650–1,400 per m² · 15–30 days · quoted after survey
              </p>
            </Reveal>
            <Reveal>
              <div className="grid grid-cols-2 gap-3">
                <Frame label="Film · edge and busbar detail" ratio="1/1" tag="Detail" />
                <Frame label="Film · application on site" ratio="1/1" tag="Fitting" />
              </div>
              <div className="glass mt-4 rounded-[4px] p-6">
                <p className="label text-brass">Confirmed on site</p>
                <ul className="mt-4 space-y-2.5">
                  {film.verify.slice(0, 4).map((v) => (
                    <li key={v} className="text-[14px] leading-snug text-ink-2">
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* faq */}
      <section id="faq" className="relative py-14">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-3">
              {film.faqs.map((f) => (
                <div key={f.q} className="border-t border-line pt-6">
                  <h3 className="display-md text-[23px]">{f.q}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{f.a}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {filmProjects.length > 0 && (
        <section id="projects" className="relative py-14">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
            <Reveal>
              <p className="label">Film projects</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {filmProjects.map((p) => (
                  <Link key={p.slug} href={`/projects/${p.slug}`} className="group block">
                    <Frame label={`${p.community} · ${p.title}`} ratio="16/9" tag="Project" />
                    <p className="mt-3 font-display text-[21px] leading-tight">{p.title}</p>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
