"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Your space. → Your light. → Your privacy.
 * One line, three states, masked per character.
 */
export function CycleLine({
  lead = "Your",
  words = ["space.", "light.", "privacy."],
  className = "",
}: {
  lead?: string;
  words?: string[];
  className?: string;
}) {
  const root = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const items = gsap.utils.toArray<HTMLElement>(".cyc-word", root.current);
      const chars = (el: HTMLElement) => el.querySelectorAll<HTMLElement>(".cyc-char");
      if (items.length < 2) return;

      items.forEach((w, i) => {
        gsap.set(chars(w), { yPercent: i === 0 ? 0 : 120 });
        gsap.set(w, { autoAlpha: 1 });
      });

      const tl = gsap.timeline({ repeat: -1, delay: 1.4 });
      items.forEach((w, i) => {
        const next = items[(i + 1) % items.length];
        tl.to(chars(w), { yPercent: -120, duration: 0.5, stagger: 0.024, ease: "power3.in" })
          .fromTo(
            chars(next),
            { yPercent: 120 },
            { yPercent: 0, duration: 0.62, stagger: 0.028, ease: "power3.out" },
            "-=0.2",
          )
          .to({}, { duration: 1.8 });
      });
    },
    { scope: root },
  );

  return (
    <p ref={root} className={`display flex flex-wrap items-baseline gap-x-[0.28em] ${className}`}>
      <span>{lead}</span>
      <span className="relative inline-block h-[1.05em] overflow-hidden align-baseline">
        {/* the widest word sets the box so nothing jumps */}
        <span className="invisible" aria-hidden="true">
          {words.reduce((a, b) => (a.length >= b.length ? a : b))}
        </span>
        {words.map((word, i) => (
          <span
            key={word}
            className="cyc-word absolute left-0 top-0 flex h-[1.05em] items-start overflow-hidden italic text-brass"
            style={{ visibility: i === 0 ? "visible" : "hidden" }}
          >
            {word.split("").map((c, j) => (
              <span key={j} className="cyc-char inline-block">
                {c}
              </span>
            ))}
          </span>
        ))}
      </span>
    </p>
  );
}
