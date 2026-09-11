import type { Metadata } from "next";
import Link from "next/link";
import { Frame } from "@/components/media";
import { Reveal } from "@/components/reveal";
import { SectionNav } from "@/components/section-nav";

export const metadata: Metadata = {
  title: "The platform",
  description:
    "The system behind the fabric: a space assessment that prescribes, honest ranges, a record of every installed asset, and the field tools that make delivery provable.",
};

type Status = "live" | "building" | "next";

interface Feature {
  name: string;
  line: string;
  detail: string;
  status: Status;
  href?: string;
  shot: string;
}

const STATUS_META: Record<Status, { label: string; cls: string }> = {
  live: { label: "Live now", cls: "border-good text-good" },
  building: { label: "In build", cls: "border-warn text-warn" },
  next: { label: "Next", cls: "border-line text-ink-3" },
};

const LIVE: Feature[] = [
  {
    name: "3D visualiser",
    line: "Four answers, one window.",
    detail: "Sheer, blackout, sunscreen and Smart Film on the same glass, at the time of day that causes the problem.",
    status: "live",
    href: "/visualiser",
    shot: "3D room with treatments switching",
  },
  {
    name: "Space DNA",
    line: "Your room, scored.",
    detail: "Heat, glare, privacy, blackout, automation and completion — six scores from your answers and your photo.",
    status: "live",
    href: "/assess",
    shot: "Space DNA score card on a phone",
  },
  {
    name: "Three prescriptions",
    line: "Essential, Signature, Intelligent.",
    detail: "Same room, three levels of intervention, each item carrying the reason it is there.",
    status: "live",
    href: "/assess",
    shot: "Three tiers side by side",
  },
  {
    name: "Honest ranges",
    line: "A band, not a fake price.",
    detail: "Nothing is priced firm before a survey, and Smart Film is never priced from a photograph at all.",
    status: "live",
    shot: "Price range with the working shown",
  },
  {
    name: "Glass check",
    line: "Five taps, one straight answer.",
    detail: "Tells you when Smart Film suits your glass — and when it does not, which is more often than anyone admits.",
    status: "live",
    href: "/smart-film/check",
    shot: "Glass check verdict screen",
  },
  {
    name: "Project registration",
    line: "Attribution that holds.",
    detail: "Architects and fit-out firms register a project and keep it through survey, quotation and installation.",
    status: "live",
    href: "/professionals/register",
    shot: "Designer registering a project",
  },
];

const BUILDING: Feature[] = [
  {
    name: "Digital Project Passport",
    line: "Every room, on the record.",
    detail: "Fabric, motor, dimensions, install date, warranty and photographs — kept for as long as you own the property.",
    status: "building",
    shot: "Passport, room by room",
  },
  {
    name: "Versioned proposals",
    line: "Approve, revise, or ask.",
    detail: "A proposal page per project. Every version frozen, every approval timestamped.",
    status: "building",
    shot: "Proposal with options A/B/C",
  },
  {
    name: "Survey capture",
    line: "Measured, not estimated.",
    detail: "Room-by-room measurements recorded on site, flowing into the quote without anyone re-typing them.",
    status: "building",
    shot: "Surveyor measuring a reveal",
  },
  {
    name: "Installer field app",
    line: "Proof, not promises.",
    detail: "Work orders, fitting checklists, before and after photographs and your sign-off — offline, on site.",
    status: "building",
    shot: "Installer closing a work order",
  },
];

const NEXT: Feature[] = [
  {
    name: "Your own room",
    line: "The visualiser, on your photograph.",
    detail: "The same four comparisons, rendered onto the room you actually live in rather than our model.",
    status: "next",
    shot: "Customer photo with treatments applied",
  },
  {
    name: "Scene designer",
    line: "Morning. Work. Movie. Away.",
    detail: "Build the scenes with us at commissioning, then keep them on your passport so they survive a new phone.",
    status: "next",
    shot: "Scene editor with room layers",
  },
  {
    name: "Drapes Care",
    line: "A year of looking after it.",
    detail: "Motor inspection, fabric servicing, film diagnostics and priority repair, priced against what is actually installed.",
    status: "next",
    href: "/care",
    shot: "Service visit, motor inspection",
  },
  {
    name: "Specification library",
    line: "Built for specifiers.",
    detail: "Performance data, dimensional limits and sample kits sent to the studio rather than a showroom.",
    status: "next",
    href: "/professionals",
    shot: "Sample kit on a studio desk",
  },
  {
    name: "Arabic, properly",
    line: "Not a translated afterthought.",
    detail: "The whole site mirrored right-to-left, with Arabic typography chosen rather than defaulted to.",
    status: "next",
    shot: "Arabic assessment screen",
  },
];

export default function PlatformPage() {
  return (
    <>
      <section className="relative pb-10 pt-14 sm:pt-20">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal selector=".h-el">
            <p className="eyebrow h-el">The platform</p>
            <h1 className="display h-el mt-5 max-w-[15ch] text-[clamp(40px,6.6vw,82px)]">
              Anyone can sell fabric. <span className="italic text-brass">We own the decision.</span>
            </h1>
            <p className="lede h-el mt-7">
              Fifteen things no other window company in this market has put in one place.
            </p>
          </Reveal>
        </div>
      </section>

      <SectionNav
        items={[
          { id: "live", label: "Live now" },
          { id: "building", label: "In build" },
          { id: "next", label: "Next" },
        ]}
        cta={{ href: "/assess", label: "Try the live one" }}
      />

      <Group id="live" title="Live now" note="Use these today." items={LIVE} />
      <Group id="building" title="In build" note="Running in the business before it runs on the site." items={BUILDING} />
      <Group id="next" title="Next" note="Designed, not yet shipped." items={NEXT} />

      <section className="relative pb-24 pt-8">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="glass grid gap-8 rounded-[4px] p-8 sm:p-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
              <div>
                <p className="eyebrow text-brass">Why we label this</p>
                <h2 className="display-md mt-4 text-[clamp(24px,3.2vw,38px)]">
                  We don&apos;t show you screens that <span className="italic text-brass">don&apos;t exist yet</span> and
                  call them live.
                </h2>
                <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">
                  Everything above says exactly where it stands. The same habit applies to a
                  measurement, a price and a delivery date.
                </p>
              </div>
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
    </>
  );
}

function Group({
  id,
  title,
  note,
  items,
}: {
  id: string;
  title: string;
  note: string;
  items: Feature[];
}) {
  return (
    <section id={id} className="relative py-12">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
            <h2 className="display-md text-[clamp(26px,3.4vw,42px)]">{title}</h2>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">{note}</p>
          </div>
        </Reveal>

        <Reveal selector=".feat" stagger={0.05} className="mt-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {items.map((f) => {
              const status = STATUS_META[f.status];
              const body = (
                <>
                  <Frame label={f.shot} ratio="4/3" tag={status.label} />
                  <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                    <p className="min-w-0 font-display text-[clamp(20px,4.4vw,24px)] leading-none">{f.name}</p>
                    <span
                      className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${status.cls}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-2 font-display text-[17px] italic text-brass">{f.line}</p>
                  <p className="mt-2 text-[13.5px] leading-snug text-ink-3">{f.detail}</p>
                </>
              );
              return f.href ? (
                <Link key={f.name} href={f.href} className="feat group block">
                  {body}
                </Link>
              ) : (
                <div key={f.name} className="feat">
                  {body}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
