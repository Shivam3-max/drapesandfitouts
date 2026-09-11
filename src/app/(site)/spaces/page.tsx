import type { Metadata } from "next";
import Link from "next/link";
import { COMMUNITIES } from "@/data/communities";
import { ORIENTATIONS } from "@/lib/taxonomy";
import { Frame } from "@/components/media";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Areas we cover",
  description: "Specification notes for the Dubai communities and business districts we work in.",
};

export default function SpacesPage() {
  const residential = COMMUNITIES.filter((c) => c.kind === "residential");
  const commercial = COMMUNITIES.filter((c) => c.kind === "commercial");

  return (
    <>
      <section className="relative pb-8 pt-14 sm:pt-20">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal selector=".h-el">
            <p className="eyebrow h-el">Areas we cover</p>
            <h1 className="display h-el mt-5 max-w-[15ch] text-[clamp(42px,7vw,86px)]">
              Every community, <span className="italic text-brass">its own sun.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <Group title="Residential" items={residential} />
      <Group title="Business districts" items={commercial} />

      <section className="relative py-20">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="glass flex flex-wrap items-center justify-between gap-6 rounded-[4px] px-8 py-9">
              <h2 className="display-md text-[clamp(24px,3vw,36px)]">
                Somewhere else? <span className="italic text-brass">We still come.</span>
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

function Group({ title, items }: { title: string; items: typeof COMMUNITIES }) {
  return (
    <section className="relative py-10">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-5">
            <h2 className="display-md text-[clamp(24px,3vw,38px)]">{title}</h2>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
              {items.length} areas
            </p>
          </div>
        </Reveal>

        <Reveal selector=".area" stagger={0.05} className="mt-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {items.map((c) => {
              const o = ORIENTATIONS.find((x) => x.id === c.hardestOrientation);
              return (
                <Link key={c.slug} href={`/spaces/${c.slug}`} className="area group block">
                  <Frame label={`${c.name} — typical elevation`} ratio="4/5" tag={o?.label ?? ""} />
                  <p className="mt-3 font-display text-[21px] leading-tight">{c.name}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                    {c.emirate} · worst exposure {o?.label.toLowerCase()}
                  </p>
                </Link>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
