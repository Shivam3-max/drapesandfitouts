"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { loadAssessment, type StoredAssessment } from "@/lib/assessment-store";
import { runSpaceDna, type SpaceDna } from "@/lib/space-dna";
import { formatRange, formatAed } from "@/lib/pricing";
import { getSolution } from "@/lib/catalogue";
import {
  SCORE_META,
  TIER_META,
  orientationLabel,
  roomLabel,
  type ScoreId,
} from "@/lib/taxonomy";
import { getCommunity } from "@/data/communities";
import { ScoreBar, Pill, Note, PrimaryLink, GhostLink } from "@/components/ui";

export function AssessmentResult({ token }: { token: string }) {
  const hydrated = useHydrated();
  const [showWorking, setShowWorking] = useState(false);

  const record: StoredAssessment | null | "loading" = useMemo(
    () => (hydrated ? loadAssessment(token) : "loading"),
    [hydrated, token],
  );
  const dna: SpaceDna | null = useMemo(
    () => (record && record !== "loading" ? runSpaceDna(record.input) : null),
    [record],
  );

  if (record === "loading") {
    return (
      <div className="mx-auto max-w-[900px] px-5 py-24 sm:px-8">
        <p className="eyebrow">Space DNA</p>
        <p className="mt-4 font-display text-[22px]">Reading your assessment…</p>
      </div>
    );
  }

  if (!record || !dna) {
    return (
      <div className="mx-auto max-w-[640px] px-5 py-24 sm:px-8">
        <p className="eyebrow">Space DNA</p>
        <h1 className="h-sec mt-4 text-[32px]">We can&apos;t find this assessment.</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-ink-2">
          Results are held in the browser they were created in, and this one isn&apos;t here. That
          usually means a different device, a private window, or cleared site data.
        </p>
        <div className="mt-8">
          <PrimaryLink href="/assess">Start a new assessment</PrimaryLink>
        </div>
      </div>
    );
  }

  const { input } = record;
  const community = input.community ? getCommunity(input.community) : undefined;
  const waText = encodeURIComponent(
    `Hello Drapes & Fitouts — here is my Space Assessment (ref ${token.slice(0, 6).toUpperCase()}). ` +
      `${roomLabel(input.room)}, ${orientationLabel(input.orientation)}-facing, ${input.openings} opening(s)` +
      `${community ? `, ${community.name}` : ""}. I'd like to book a site visit.`,
  );

  return (
    <article className="pb-24">
      {/* ---------- header ---------- */}
      <header className="border-b border-line">
        <div className="mx-auto max-w-[1080px] px-5 py-14 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">Space DNA</p>
            <Pill tone="brass">Ref {token.slice(0, 6).toUpperCase()}</Pill>
            <Pill tone={dna.confidence === "high" ? "good" : dna.confidence === "medium" ? "brass" : "warn"}>
              {dna.confidence} confidence
            </Pill>
          </div>

          <h1 className="display mt-6 max-w-[20ch] text-[clamp(34px,5.6vw,64px)]">{dna.headline}</h1>
          <p className="mt-6 max-w-[62ch] text-[18px] leading-relaxed text-ink-2">{dna.summary}</p>

          <dl className="mt-10 grid gap-6 border-t border-line pt-6 font-mono text-[11px] sm:grid-cols-4">
            <Meta label="Space">{roomLabel(input.room)}</Meta>
            <Meta label="Facing">{orientationLabel(input.orientation)}</Meta>
            <Meta label="Openings">{String(input.openings)}</Meta>
            <Meta label="Where">{community?.name ?? "Not specified"}</Meta>
          </dl>
          <p className="mt-4 font-mono text-[11.5px] text-ink-3">{dna.confidenceNote}</p>
        </div>
      </header>

      {/* ---------- scores ---------- */}
      <section className="mx-auto max-w-[1080px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <h2 className="label text-brass">What your space scored</h2>
            <div className="mt-7 grid gap-7 sm:grid-cols-2">
              {(Object.keys(dna.scores) as ScoreId[]).map((id) => (
                <ScoreBar
                  key={id}
                  label={SCORE_META[id].label}
                  value={dna.scores[id]}
                  description={SCORE_META[id].description}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {record.thumbnails.length > 0 && (
              <div>
                <h2 className="label text-brass">Your space</h2>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {record.thumbnails.map((t, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={t} alt={`Your room, photo ${i + 1}`} className="h-36 w-full object-cover" />
                  ))}
                </div>
                <p className="mt-3 font-mono text-[11px] text-ink-3">
                  Held in this browser only. Nothing has been uploaded.
                </p>
              </div>
            )}

            {dna.drivers.length > 0 && (
              <div>
                <h2 className="label text-brass">What drove this</h2>
                <ul className="mt-4 space-y-3">
                  {dna.drivers.map((d) => (
                    <li key={d.score + d.reason} className="border-l-2 border-brass pl-4 text-[15.5px] leading-relaxed text-ink-2">
                      {d.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- tiers ---------- */}
      <section className="border-y border-line">
        <div className="mx-auto max-w-[1080px] px-5 py-16 sm:px-8">
          <h2 className="display-md text-[clamp(28px,3.8vw,46px)]">Three ways to solve it.</h2>
          <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-ink-2">
            Same space, three different levels of intervention. Every item says why it is there —
            and the ranges are ranges for a reason, because nothing has been measured yet.
          </p>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {dna.tiers.map((tier) => (
              <div
                key={tier.tier}
                className={`rounded-[4px] p-7 ${tier.tier === "signature" ? "glass-strong" : "glass"}`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-brass">
                    {TIER_META[tier.tier].label}
                  </h3>
                  {tier.tier === "signature" && <Pill tone="brass">Most chosen</Pill>}
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{TIER_META[tier.tier].promise}</p>

                <ul className="mt-6 space-y-5 border-t border-line pt-6">
                  {tier.items.map((item) => {
                    const sol = getSolution(item.slug);
                    return (
                      <li key={item.slug}>
                        <div className="flex items-baseline justify-between gap-2">
                          <Link href={`/solutions/${item.slug}`} className="brass-link font-display text-[15.5px] font-semibold">
                            {sol?.name ?? item.slug}
                          </Link>
                          {item.motorised && <Pill>Motorised</Pill>}
                        </div>
                        <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-3">
                          {item.role}
                        </p>
                        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{item.reason}</p>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-7 border-t border-line pt-5">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">
                    Typical range
                  </p>
                  <p className="tnum mt-1 font-display text-[30px] leading-none">
                    {formatRange(tier.estimate)}
                  </p>
                  {tier.estimate?.surveyOnly.map((note) => (
                    <p key={note} className="mt-3 text-[13.5px] leading-snug text-warn">
                      {note}
                    </p>
                  ))}
                  {tier.estimate && tier.estimate.lines.length > 0 && (
                    <details className="mt-4">
                      <summary className="cursor-pointer font-mono text-[11.5px] text-ink-3 hover:text-brass">
                        What&apos;s in the range
                      </summary>
                      <p className="mt-3 font-mono text-[11px] leading-relaxed text-ink-3">
                        Full spread if every choice went the same way:{" "}
                        <span className="tnum">
                          {formatAed(tier.estimate.absoluteLow)}–{formatAed(tier.estimate.absoluteHigh)}
                        </span>
                        . The band above is where most projects of this shape land.
                      </p>
                      <ul className="mt-3 space-y-1.5">
                        {tier.estimate.lines.map((line) => (
                          <li key={line.slug} className="flex justify-between gap-3 font-mono text-[11.5px] text-ink-3">
                            <span>
                              {line.name} · {line.quantity} {line.unit}
                            </span>
                            <span className="tnum whitespace-nowrap">
                              {formatAed(line.low)}–{formatAed(line.high)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 font-mono text-[11.5px] leading-relaxed text-ink-3">
            Ranges are for supply and installation, exclude electrical works and VAT, and assume{" "}
            {dna.tiers[0].estimate?.fromCustomerDimensions
              ? "the size you gave us for the main opening, with the remaining openings costed at a typical size for the room — all unverified until the survey."
              : "a typical opening for this room type, because no sizes were given."}
          </p>
        </div>
      </section>

      {/* ---------- film + verify ---------- */}
      <section className="mx-auto max-w-[1080px] px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {dna.filmNote && (
            <Note title={dna.filmEligible ? "Smart Film — candidate" : "Smart Film — not recommended here"}>
              <p>{dna.filmNote}</p>
              <p className="mt-3">
                <Link href="/smart-film" className="brass-link text-ink">
                  How Smart Film actually works
                </Link>
              </p>
            </Note>
          )}

          <div>
            <h2 className="label text-brass">What we verify on site</h2>
            <ul className="mt-5 space-y-3">
              {dna.verify.map((v) => (
                <li key={v} className="flex gap-3 text-[15.5px] leading-relaxed text-ink-2">
                  <span className="mt-2 h-1 w-4 shrink-0 bg-brass" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* working */}
        <div className="mt-14 border-t border-line pt-8">
          <button
            type="button"
            onClick={() => setShowWorking((v) => !v)}
            className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-2 hover:text-brass"
          >
            {showWorking ? "Hide" : "Show"} how we reached this ({dna.firedRules.length} rules)
          </button>

          {showWorking && (
            <div className="mt-6">
              <ul className="space-y-3">
                {dna.firedRules.map((r) => (
                  <li key={r.id} className="grid gap-2 border-b border-line pb-3 sm:grid-cols-[220px_1fr]">
                    <code className="font-mono text-[11.5px] text-brass">{r.id}</code>
                    <span className="text-[15px] leading-relaxed text-ink-2">{r.explanation}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 font-mono text-[11px] text-ink-3">
                Ruleset {dna.rulesetVersion} · assessment generated{" "}
                {new Date(dna.generatedAt).toLocaleString("en-AE")}. Recommendations come from a
                reviewed rule catalogue, not from a language model.
              </p>
              <div className="mt-6">
                <h3 className="label text-ink">Assumptions</h3>
                <ul className="mt-3 space-y-2">
                  {dna.tiers[0].assumptions.map((a) => (
                    <li key={a} className="font-mono text-[12px] leading-relaxed text-ink-3">
                      — {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ---------- next steps ---------- */}
      <section className="mx-auto max-w-[1320px] px-5 sm:px-8"><div className="rounded-[4px] bg-ink">
        <div className="mx-auto max-w-[1080px] px-5 py-16 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow text-brass-light">Next step</p>
              <h2 className="display-md mt-4 text-[clamp(28px,3.8vw,44px)] text-white">
                A surveyor measures it, and the range becomes a price.
              </h2>
              <p className="mt-5 max-w-[54ch] text-[17px] leading-relaxed text-stone/70">
                The visit takes about 45 minutes. We measure every opening, check the things listed
                above, and bring the fabrics that suit what your space scored — not the whole library.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PrimaryLink href={`/book?ref=${token}`} invert>
                Book the site visit
              </PrimaryLink>
              <GhostLink href={`https://wa.me/971559787259?text=${waText}`} invert>
                Send this on WhatsApp
              </GhostLink>
            </div>
          </div>
        </div>
      </div></section>
    </article>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="uppercase tracking-[0.12em] text-ink-3">{label}</dt>
      <dd className="mt-1.5 font-display text-[15px] text-ink">{children}</dd>
    </div>
  );
}
