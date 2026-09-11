import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SOLUTIONS, getSolution, PRICE_BASIS_LABEL } from "@/lib/catalogue";
import { GROUP_META } from "@/lib/taxonomy";
import { PROJECTS } from "@/data/projects";
import { formatAed } from "@/lib/pricing";
import { Frame } from "@/components/media";
import { Reveal } from "@/components/reveal";
import { FaqSchema } from "@/components/schema";
import { SectionNav } from "@/components/section-nav";

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return { title: "Solution" };
  return { title: s.name, description: s.summary };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) notFound();

  const related = PROJECTS.filter((p) => p.specified.some((x) => x.solution === s.slug));
  const pairs = s.pairsWith.map(getSolution).filter(Boolean);

  return (
    <article>
      <FaqSchema faqs={s.faqs} />

      {/* ---- hero ---- */}
      <section className="relative pt-10">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-[4px]">
            <Frame label={`${s.name} — hero, installed`} ratio="21/9" rounded={false} priority />
            <div className="absolute inset-0 flex items-end p-5 sm:p-8">
              <div className="glass-strong max-w-[46ch] rounded-[3px] px-7 py-7">
                <p className="eyebrow">{GROUP_META[s.group].label}</p>
                <h1 className="display-md mt-3 text-[clamp(30px,4.4vw,54px)]">{s.name}</h1>
                <p className="mt-3 font-display text-[20px] italic text-brass">{s.tagline}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-3 border-b border-line pb-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
            <span className="tnum text-ink-2">
              AED {formatAed(s.price.low)}–{formatAed(s.price.high)} {PRICE_BASIS_LABEL[s.price.basis]}
            </span>
            <span className="tnum">
              {s.leadTimeDays[0]}–{s.leadTimeDays[1]} days
            </span>
            <span>{s.rungs.join(" · ")}</span>
            <Link href="/assess" className="btn btn-solid ml-auto">
              Is this right for me?
            </Link>
          </div>
        </div>
      </section>

      <SectionNav
        items={[
          { id: "gallery", label: "Gallery" },
          { id: "fit", label: "Right / wrong for" },
          { id: "spec", label: "Specification" },
          { id: "faq", label: "Questions" },
          ...(pairs.length ? [{ id: "pairs", label: "Layer with" }] : []),
          ...(related.length ? [{ id: "projects", label: "Projects" }] : []),
        ]}
        cta={{ href: "/assess", label: "Assess my space" }}
      />

      {/* ---- gallery ---- */}
      <section id="gallery" className="relative py-12">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal selector=".g" stagger={0.06}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <div className="g lg:col-span-2">
                <Frame label={`${s.name} · in a finished room`} ratio="4/3" />
              </div>
              <div className="g">
                <Frame label={`${s.name} · close detail`} ratio="3/4" tag="Detail" />
              </div>
              <div className="g">
                <Frame label={`${s.name} · fabric / material`} ratio="3/4" tag="Material" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- right for / wrong for ---- */}
      <section id="fit" className="relative py-10">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="glass grid gap-8 rounded-[4px] p-7 sm:p-10 lg:grid-cols-2">
              <div>
                <p className="label text-good">Right for</p>
                <ul className="mt-5 space-y-3">
                  {s.winsWhen.slice(0, 4).map((w) => (
                    <li key={w} className="flex gap-3 text-[15px] leading-snug text-ink-2">
                      <span className="mt-2.5 h-px w-5 shrink-0 bg-good" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="label text-crit">Wrong for</p>
                <ul className="mt-5 space-y-3">
                  {s.notFor.map((w) => (
                    <li key={w} className="flex gap-3 text-[15px] leading-snug text-ink-2">
                      <span className="mt-2.5 h-px w-5 shrink-0 bg-crit" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- specs + survey ---- */}
      <section id="spec" className="relative py-12">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
            <Reveal>
              <p className="label">Specification</p>
              <dl className="mt-6">
                {s.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="grid gap-1 border-t border-line py-4 sm:grid-cols-[150px_1fr] sm:gap-5"
                  >
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">
                      {spec.label}
                    </dt>
                    <dd className="text-[14.5px] leading-snug text-ink-2">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                {s.materials.map((m) => (
                  <span
                    key={m}
                    className="rounded-full border border-line bg-white/60 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-2"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <div className="glass rounded-[4px] p-7">
                <p className="label text-brass">Confirmed on site</p>
                <ul className="mt-5 space-y-3">
                  {s.verify.slice(0, 4).map((v) => (
                    <li key={v} className="text-[14.5px] leading-snug text-ink-2">
                      {v}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <Frame label={`${s.name} · installation in progress`} ratio="4/3" tag="Fitting" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- faq ---- */}
      <section id="faq" className="relative py-12">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-2">
              {s.faqs.map((f) => (
                <div key={f.q} className="border-t border-line pt-6">
                  <h3 className="display-md text-[24px]">{f.q}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{f.a}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- pairs + projects ---- */}
      {(pairs.length > 0 || related.length > 0) && (
        <section className="relative py-12">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
            {pairs.length > 0 && (
              <Reveal>
                <p id="pairs" className="label">Usually layered with</p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                  {pairs.map((p) => (
                    <Link key={p!.slug} href={`/solutions/${p!.slug}`} className="group block">
                      <Frame label={`${p!.name} — installed`} ratio="4/5" />
                      <p className="mt-3 font-display text-[20px] leading-tight">{p!.name}</p>
                    </Link>
                  ))}
                </div>
              </Reveal>
            )}

            {related.length > 0 && (
              <Reveal className="mt-14">
                <p id="projects" className="label">Specified on</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((p) => (
                    <Link key={p.slug} href={`/projects/${p.slug}`} className="group block">
                      <Frame label={`${p.community} · ${p.title}`} ratio="4/3" tag="Project" />
                      <p className="mt-3 font-display text-[19px] leading-tight">{p.title}</p>
                      <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">
                        {p.specified.find((x) => x.solution === s.slug)?.detail}
                      </p>
                    </Link>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      <section className="relative pb-24 pt-8">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="glass flex flex-wrap items-center justify-between gap-6 rounded-[4px] px-8 py-9">
              <h2 className="display-md text-[clamp(24px,3vw,36px)]">
                Right product, <span className="italic text-brass">wrong window?</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                <Link href="/assess" className="btn btn-solid">
                  Assess my space
                </Link>
                <Link href="/book" className="btn btn-ghost">
                  Book a visit
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
