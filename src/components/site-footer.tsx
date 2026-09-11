import Link from "next/link";
import { Frame } from "@/components/media";

const COLS = [
  {
    title: "Solutions",
    links: [
      ["Curtains", "/solutions/wave-curtain"],
      ["Blinds", "/solutions/sunscreen-roller"],
      ["Smart Film", "/smart-film"],
      ["Carpets", "/solutions/broadloom-carpet"],
      ["Wallpaper", "/solutions/wallpaper"],
      ["Automation", "/technology"],
    ],
  },
  {
    title: "Company",
    links: [
      ["The platform", "/platform"],
      ["Projects", "/projects"],
      ["Areas we cover", "/spaces"],
      ["For architects", "/professionals"],
      ["Drapes Care", "/care"],
      ["Book a visit", "/book"],
      ["Privacy", "/privacy"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-10 border-t border-line pt-16">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_.7fr_.7fr_1fr]">
          <div>
            <p className="font-display text-[30px] leading-none tracking-tight">
              Drapes <span className="italic text-brass">&amp;</span> Fitouts
            </p>
            <p className="mt-5 max-w-[30ch] text-[15px] text-ink-2">
              Light, privacy and comfort — measured, made and fitted across the UAE.
            </p>
            <Link href="/assess" className="btn btn-solid mt-7">
              Assess my space
            </Link>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow">{col.title}</p>
              <ul className="mt-4 space-y-0.5">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="inline-block py-2.5 text-[14.5px] text-ink-2 transition-colors hover:text-brass">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <Frame label="Showroom · Sharjah" ratio="4/3" tag="Studio" />
            <div className="mt-5 space-y-1 font-mono text-[11px] leading-relaxed text-ink-3">
              <p className="text-ink-2">Office B40-003, Block B, SRTIP, Sharjah</p>
              <p>
                <a className="link-underline text-ink-2" href="https://wa.me/971559787259">
                  +971 55 978 7259
                </a>
              </p>
              <p>
                <a className="link-underline text-ink-2" href="mailto:info@drapesandfitouts.ae">
                  info@drapesandfitouts.ae
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line py-7 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
          <span>Dubai · Sharjah · Abu Dhabi · Northern Emirates</span>
          <span>Prices shown are indicative ranges · firm after survey</span>
        </div>
      </div>
    </footer>
  );
}
