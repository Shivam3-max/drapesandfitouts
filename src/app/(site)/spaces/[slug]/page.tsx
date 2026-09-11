import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COMMUNITIES, getCommunity } from "@/data/communities";
import { getSolution } from "@/lib/catalogue";
import { PROJECTS } from "@/data/projects";
import { ORIENTATIONS } from "@/lib/taxonomy";
import { Frame } from "@/components/media";
import { Reveal } from "@/components/reveal";

export function generateStaticParams() {
  return COMMUNITIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCommunity(slug);
  if (!c) return { title: "Area" };
  return { title: `Curtains, blinds & Smart Film in ${c.name}`, description: c.lead };
}

export default async function CommunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCommunity(slug);
  if (!c) notFound();

  const orientation = ORIENTATIONS.find((o) => o.id === c.hardestOrientation);
  const projects = PROJECTS.filter((p) => p.communitySlug === c.slug);

  return (
    <article>
      <section className="relative pt-10">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-[4px]">
            <Frame label={`${c.name} — typical property`} ratio="21/9" rounded={false} priority />
            <div className="absolute inset-0 flex items-end p-5 sm:p-8">
              <div className="glass-strong max-w-[44ch] rounded-[3px] px-7 py-7">
                <p className="eyebrow">{c.emirate}</p>
                <h1 className="display-md mt-3 text-[clamp(28px,4vw,50px)]">{c.name}</h1>
                <p className="mt-3 text-[15px] leading-snug text-ink-2">{c.lead}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-12">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <Reveal>
              <p className="label text-crit">The problem here</p>
              <p className="mt-4 text-[17px] leading-relaxed text-ink-2">{c.problem}</p>

              {orientation && (
                <div className="mt-8 glass rounded-[4px] px-6 py-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                    Hardest exposure
                  </p>
                  <p className="mt-1.5 font-display text-[30px] leading-none">{orientation.label}</p>
                  <p className="mt-2 text-[14px] text-ink-2">{orientation.note}.</p>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-2">
                {c.typology.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line bg-white/60 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-2"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <ul className="mt-8 space-y-3">
                {c.notes.map((n) => (
                  <li key={n} className="flex gap-3 text-[15px] leading-snug text-ink-2">
                    <span className="mt-2.5 h-px w-5 shrink-0 bg-brass" />
                    {n}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <div className="grid grid-cols-2 gap-3">
                <Frame label={`${c.name} · living space`} ratio="4/5" />
                <Frame label={`${c.name} · window detail`} ratio="4/5" tag="Detail" />
              </div>
              <p className="mt-6 label text-brass">Usually specified here</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {c.recommended.map((rs) => {
                  const sol = getSolution(rs);
                  if (!sol) return null;
                  return (
                    <Link key={rs} href={`/solutions/${rs}`} className="group block">
                      <Frame label={`${sol.name}`} ratio="1/1" tag="Fitted" />
                      <p className="mt-2 font-display text-[18px] leading-tight">{sol.name}</p>
                    </Link>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="relative py-12">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
            <Reveal>
              <p className="label">Projects here</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {projects.map((p) => (
                  <Link key={p.slug} href={`/projects/${p.slug}`} className="group block">
                    <Frame label={`${p.title}`} ratio="16/9" tag="Project" />
                    <p className="mt-3 font-display text-[21px] leading-tight">{p.title}</p>
                    <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">
                      {p.openings} openings · {p.year}
                    </p>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="relative pb-24 pt-8">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="glass flex flex-wrap items-center justify-between gap-6 rounded-[4px] px-8 py-9">
              <div>
                <h2 className="display-md text-[clamp(24px,3vw,36px)]">
                  We know {c.name}.
                </h2>
                <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
                  {c.serviceNote}
                </p>
              </div>
              <Link href={`/assess?community=${c.slug}`} className="btn btn-solid">
                Assess my space
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
