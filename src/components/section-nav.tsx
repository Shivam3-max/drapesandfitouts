"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sticky in-page navigation. Sits under the header, highlights the section you
 * are in, and jumps without making anyone scroll to find a section.
 */
export function SectionNav({
  items,
  cta,
}: {
  items: { id: string; label: string }[];
  cta?: { href: string; label: string };
}) {
  const [active, setActive] = useState(items[0]?.id);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-24% 0px -62% 0px", threshold: 0 },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  // keep the active chip in view on narrow screens
  useEffect(() => {
    const bar = barRef.current;
    const chip = bar?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (bar && chip) {
      const left = chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2;
      bar.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
  }, [active]);

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  return (
    <div className="sticky top-[76px] z-40 mx-auto max-w-[1320px] px-5 sm:px-8">
      <div className="glass flex items-center gap-2 rounded-full px-2 py-2">
        <div ref={barRef} className="scrollbar-none flex flex-1 gap-1 overflow-x-auto scroll-smooth">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-chip={item.id}
              onClick={(e) => jump(e, item.id)}
              aria-current={active === item.id ? "true" : undefined}
              className={`whitespace-nowrap rounded-full px-4 py-2.5 text-[12.5px] transition-colors ${
                active === item.id ? "bg-ink text-white" : "text-ink-2 hover:bg-white/70 hover:text-ink"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
        {cta && (
          <a
            href={cta.href}
            className="hidden shrink-0 rounded-full border border-line px-5 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:border-ink sm:inline-block"
          >
            {cta.label}
          </a>
        )}
      </div>
    </div>
  );
}
