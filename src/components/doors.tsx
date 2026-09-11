"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";

/**
 * three.js is a third of the page weight, and the entry page has to feel
 * instant. The room loads after first paint and fades in over its own still.
 */
const Room3D = dynamic(() => import("@/components/room-3d").then((m) => m.Room3D), {
  ssr: false,
  loading: () => <RoomStill />,
});

function RoomStill() {
  return (
    <div
      className="h-full w-full"
      style={{
        background: "linear-gradient(168deg,#e8e4dc 0%,#d2cabb 46%,#b6ab97 100%)",
      }}
    />
  );
}

/**
 * The home page: eight doors, each one labelled in plain words.
 * Desktop lays them out as a bento; on a phone they stack in the order
 * someone actually needs them.
 */

export interface Door {
  href: string;
  name: string;
  line: string;
  tag: string;
  /** 3d = live room preview, feature = the assessment, plain = a product */
  kind?: "3d" | "feature" | "plain";
}

const WASH = [
  "linear-gradient(158deg,#e9e1d3 0%,#d3c6ae 55%,#b3a184 100%)",
  "linear-gradient(158deg,#dfe6e8 0%,#c2ced3 55%,#9aabb2 100%)",
  "linear-gradient(158deg,#eee5d7 0%,#dbccb0 55%,#bda882 100%)",
  "linear-gradient(158deg,#e5eaeb 0%,#cbd3d6 55%,#a6b2b7 100%)",
  "linear-gradient(158deg,#f0e8dc 0%,#ded0b9 55%,#c0ac8c 100%)",
  "linear-gradient(158deg,#e8e7e2 0%,#cecbc2 55%,#a9a69c 100%)",
];

export function Doors({ doors }: { doors: Door[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // gsap.from, so the doors are visible by default and only animate when
      // the script actually runs
      gsap.from(".door", { opacity: 0, y: 18, duration: 0.85, stagger: 0.05, ease: "power3.out" });
    },
    { scope: root },
  );

  const hero = doors.filter((d) => d.kind === "3d" || d.kind === "feature");
  const rest = doors.filter((d) => !d.kind || d.kind === "plain");

  return (
    <div ref={root} className="space-y-3 sm:space-y-4">
      {/* ---- the two big doors ---- */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        {hero.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className={`door group relative block overflow-hidden rounded-[5px] ${
              d.kind === "3d" ? "md:col-span-2" : ""
            }`}
          >
            <div className={d.kind === "3d" ? "h-[280px] sm:h-[340px] md:h-[380px] lg:h-[430px]" : "h-[200px] sm:h-[260px] md:h-[380px] lg:h-[430px]"}>
              {d.kind === "3d" ? (
                <Room3D state={{ layer: "sheer", time: "evening", floor: "carpet" }} interactive={false} />
              ) : (
                <div
                  className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                  style={{ background: "linear-gradient(158deg,#f2e9d6 0%,#e0cca4 52%,#c2a970 100%)" }}
                >
                  <span className="absolute inset-[18%] border border-white/60" aria-hidden="true" />
                </div>
              )}
            </div>
            <Overlay door={d} big />
          </Link>
        ))}
      </div>

      {/* ---- the product doors ---- */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {rest.map((d, i) => (
          <Link key={d.href} href={d.href} className="door group relative block overflow-hidden rounded-[5px]">
            <div className="h-[168px] sm:h-[200px] md:h-[220px] lg:h-[250px]">
              <div
                className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                style={{ background: WASH[i % WASH.length] }}
              />
              <span className="absolute inset-[16%] border border-white/55" aria-hidden="true">
                <span className="grid h-full grid-cols-3">
                  <i className="border-r border-white/45" />
                  <i className="border-r border-white/45" />
                  <i />
                </span>
              </span>
            </div>
            <Overlay door={d} />
          </Link>
        ))}
      </div>
    </div>
  );
}

function Overlay({ door, big = false }: { door: Door; big?: boolean }) {
  return (
    <>
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(16,18,20,.66) 0%, rgba(16,18,20,.14) 46%, transparent 72%)",
        }}
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <span className="block font-mono text-[8.5px] uppercase tracking-[0.2em] text-white/70 sm:text-[9.5px]">
          {door.tag}
        </span>
        <span
          className={`mt-1.5 block font-display leading-none text-white ${
            big ? "text-[clamp(28px,3.4vw,44px)]" : "text-[clamp(20px,2vw,26px)]"
          }`}
        >
          {door.name}
        </span>
        <span
          className={`mt-2 block text-white/75 ${
            big ? "max-w-[42ch] text-[14px] leading-snug" : "hidden text-[12.5px] leading-snug sm:block"
          }`}
        >
          {door.line}
        </span>
        <span className="mt-3 inline-flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white">
          Open
          <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
        </span>
      </span>
    </>
  );
}
