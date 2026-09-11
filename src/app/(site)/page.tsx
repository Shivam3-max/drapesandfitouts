import Link from "next/link";
import { CycleLine } from "@/components/cycle-line";
import { Doors, type Door } from "@/components/doors";

const DOORS: Door[] = [
  {
    href: "/visualiser",
    name: "See it in 3D",
    line: "One room, four treatments, three times of day. Drag it around and watch the light change.",
    tag: "Visualiser · live",
    kind: "3d",
  },
  {
    href: "/assess",
    name: "Assess my space",
    line: "Six questions and a photo. We score the room and prescribe three ways to fix it.",
    tag: "Start here",
    kind: "feature",
  },
  { href: "/solutions/wave-curtain", name: "Curtains", line: "Wave, pleated, sheer, blackout.", tag: "Softness" },
  { href: "/solutions/sunscreen-roller", name: "Blinds", line: "Sunscreen, blackout, Roman, Venetian.", tag: "Light" },
  { href: "/smart-film", name: "Smart Film", line: "Clear to private in a second.", tag: "Privacy" },
  { href: "/solutions/broadloom-carpet", name: "Carpets", line: "Broadloom, tile, prayer, rugs.", tag: "Surface" },
  { href: "/solutions/wallpaper", name: "Wallpaper", line: "Feature walls and murals.", tag: "Surface" },
  { href: "/technology", name: "Automation", line: "Motors, scenes, one command.", tag: "Control" },
];

const QUIET_LINKS = [
  { href: "/platform", label: "The platform" },
  { href: "/projects", label: "Projects" },
  { href: "/spaces", label: "Areas we cover" },
  { href: "/professionals", label: "For architects" },
  { href: "/care", label: "Drapes Care" },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-5 sm:px-6 sm:pt-7">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-5 sm:gap-5 sm:pb-8">
        <div>
          <p className="eyebrow">Curtains · Blinds · Smart Film · Carpets · Wallpaper · Automation</p>
          <CycleLine className="mt-3 text-[clamp(34px,5.4vw,66px)]" />
        </div>
        {/* phones get one clear action; wider screens get both */}
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Link href="/assess" className="btn btn-solid flex-1 justify-center sm:flex-none">
            Assess my space
          </Link>
          <Link href="/book" className="btn btn-ghost shrink-0">
            Book a visit
          </Link>
        </div>
      </div>

      <Doors doors={DOORS} />

      <div className="mt-7 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line pt-5">
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Elsewhere on the site">
          {QUIET_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-block py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3 transition-colors hover:text-brass"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
          Dubai · Sharjah ·{" "}
          <a href="https://wa.me/971559787259" className="link-underline text-ink-2">
            WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
