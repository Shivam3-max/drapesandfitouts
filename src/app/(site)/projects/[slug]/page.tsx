import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, getProject, SECTOR_LABEL } from "@/data/projects";
import { getSolution } from "@/lib/catalogue";
import { getCommunity } from "@/data/communities";
import { Frame } from "@/components/media";
import { Reveal } from "@/components/reveal";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Project" };
  return { title: p.title, description: p.brief };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const community = p.communitySlug ? getCommunity(p.communitySlug) : undefined;
  const others = PROJECTS.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <article>
      <section className="relative pt-10">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-[4px]">
            <Frame label={`${p.title} · ${p.states[1].label.toLowerCase()}`} ratio="21/9" rounded={false} priority />
            <div className="absolute inset-0 flex items-end p-5 sm:p-8">
              <div className="glass-strong max-w-[48ch] rounded-[3px] px-7 py-7">
                <p className="eyebrow">
                  {SECTOR_LABEL[p.sector]} · {p.community}
                </p>
                <h1 className="display-md mt-3 text-[clamp(28px,4vw,50px)]">{p.title}</h1>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-2 border-b border-line pb-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
            {p.illustrative && <span className="text-warn">Worked example</span>}
            <span className="tnum">{p.openings} openings</span>
            <span>{p.year}</span>
            {community && (
              <Link href={`/spaces/${community.slug}`} className="link-underline text-ink-2">
                {community.name}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* before / after */}
      <section className="relative py-12">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal selector=".st" stagger={0.08}>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {p.states.map((state, i) => (
                <div key={state.label} className="st">
                  <Frame label={state.note} ratio="4/3" tag={state.label} />
                  <p className="mt-3 font-display text-[22px]">{i === 0 ? "Before" : "After"}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* story, kept short */}
      <section className="relative py-8">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <Reveal>
              <div className="space-y-8">
                <div>
                  <p className="label text-brass">The brief</p>
                  <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{p.brief}</p>
                </div>
                <div>
                  <p className="label text-brass">What we found</p>
                  <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{p.diagnosis}</p>
                </div>
                <div>
                  <p className="label text-brass">The outcome</p>
                  <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{p.outcome}</p>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="glass rounded-[4px] p-7">
                <p className="label">Specified</p>
                <ul className="mt-5">
                  {p.specified.map((sp) => {
                    const sol = getSolution(sp.solution);
                    return (
                      <li key={sp.solution} className="border-t border-line py-4 first:border-t-0 first:pt-0">
                        <Link href={`/solutions/${sp.solution}`} className="link-underline font-display text-[21px]">
                          {sol?.name ?? sp.solution}
                        </Link>
                        <p className="mt-1 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.1em] text-ink-3">
                          {sp.detail}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Frame label={`${p.title} · installation detail`} ratio="1/1" tag="Fitting" />
                <Frame label={`${p.title} · finished room`} ratio="1/1" tag="Finish" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative py-16">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <p className="label">More projects</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {others.map((o) => (
                <Link key={o.slug} href={`/projects/${o.slug}`} className="group block">
                  <Frame label={`${o.community} · ${o.title}`} ratio="4/3" tag={SECTOR_LABEL[o.sector]} />
                  <p className="mt-3 font-display text-[20px] leading-tight">{o.title}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
