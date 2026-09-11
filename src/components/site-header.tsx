"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/visualiser", label: "3D room" },
  { href: "/solutions", label: "Solutions" },
  { href: "/platform", label: "Platform" },
  { href: "/smart-film", label: "Smart Film" },
  { href: "/projects", label: "Projects" },
  { href: "/spaces", label: "Areas" },
  { href: "/technology", label: "Automation" },
  { href: "/professionals", label: "Trade" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-[1320px] px-3 pt-3 sm:px-6 sm:pt-5">
        <div className="glass flex items-center gap-5 rounded-full px-5 py-2.5 sm:px-6">
          <Link href="/" className="-my-1 shrink-0 py-2 leading-none" aria-label="Drapes & Fitouts, home">
            <span className="block font-display text-[20px] leading-none tracking-tight text-ink">
              Drapes <span className="italic text-brass">&amp;</span> Fitouts
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3.5 py-2 text-[13.5px] transition-colors ${
                    active ? "text-brass" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Link
              href="/assess"
              className="hidden rounded-full bg-ink px-5 py-3 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-brass sm:inline-block"
            >
              Assess my space
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="rounded-full border border-line px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink lg:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {open && (
          <nav id="mobile-nav" aria-label="Main, mobile" className="glass-strong mt-2 rounded-[4px] p-4 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block border-b border-line-2 py-3 font-display text-[22px] text-ink last:border-b-0"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/assess"
              onClick={() => setOpen(false)}
              className="btn btn-solid mt-4 w-full justify-center"
            >
              Assess my space
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
