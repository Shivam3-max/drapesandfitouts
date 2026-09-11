"use client";

import { useState } from "react";

type StateId = "bare" | "light" | "privacy" | "blackout" | "automation" | "finish";

const STATES: {
  id: StateId;
  label: string;
  headline: string;
  body: string;
  spec: string;
}[] = [
  {
    id: "bare",
    label: "The problem",
    headline: "West-facing glass, 3 pm",
    body: "Nothing between the room and the sun. This is the condition most UAE living rooms are handed over in.",
    spec: "Diagnosis first — orientation, glass area, room use.",
  },
  {
    id: "light",
    label: "Light",
    headline: "Solar-control layer",
    body: "A technical mesh cuts the solar energy and the glare at the glass, and you keep the view you paid for.",
    spec: "Sunscreen roller · 3% openness · charcoal",
  },
  {
    id: "privacy",
    label: "Privacy",
    headline: "Daytime privacy layer",
    body: "A sheer softens the light and stops the room being looked into during the day, without shutting it off.",
    spec: "Wide-width sheer · 2.5× fullness · weighted hem",
  },
  {
    id: "blackout",
    label: "Blackout",
    headline: "Darkness, sealed at the edges",
    body: "The fabric is the easy part. Real darkness comes from the side channels and the seal — which is what most quotes leave out.",
    spec: "Blackout roller · side channels · sealed cassette",
  },
  {
    id: "automation",
    label: "Automation",
    headline: "One command, every layer",
    body: "Morning opens the sheer and holds the mesh. Evening closes the curtain. Away makes the house look lived in.",
    spec: "Motorised track + scene control · commissioned on site",
  },
  {
    id: "finish",
    label: "Finish",
    headline: "The room, completed",
    body: "The window was never the whole problem. The floor and the wall are doing as much work here as the glass.",
    spec: "Wave curtain + wool carpet + feature wall",
  },
];

export function RoomDemo() {
  const [state, setState] = useState<StateId>("bare");
  const active = STATES.find((s) => s.id === state)!;

  const meshOn = state === "light" || state === "automation" || state === "finish";
  const sheerOn = state === "privacy" || state === "automation" || state === "finish";
  const blackoutOn = state === "blackout";
  const curtainsOn = state === "automation" || state === "finish";
  const finishOn = state === "finish";

  return (
    <div>
      <div className="glass overflow-hidden rounded-[3px]">
        {/* ---- the room ---- */}
        <div
          className="relative aspect-[4/3] w-full overflow-hidden transition-colors duration-700"
          style={{ background: finishOn ? "#e6e0d4" : "#eceae4" }}
        >
          {/* feature wall */}
          <div
            className="absolute inset-y-0 left-0 w-[16%] transition-opacity duration-700"
            style={{
              opacity: finishOn ? 1 : 0,
              backgroundImage:
                "repeating-linear-gradient(115deg, rgba(154,117,38,.16) 0 2px, transparent 2px 13px), linear-gradient(180deg,#e9e2d3,#ded5c3)",
            }}
          />

          {/* window opening */}
          <div className="absolute left-[20%] right-[8%] top-[10%] h-[62%] overflow-hidden border border-ink/15 bg-[#7f979f]">
            {/* sky */}
            <div
              className="absolute inset-0 transition-all duration-700"
              style={{
                background:
                  "linear-gradient(185deg,#cdd9dd 0%,#a9bcc2 42%,#8ba0a7 68%,#6d848c 100%)",
                filter: meshOn ? "saturate(.82) brightness(.9)" : "none",
              }}
            />
            {/* sun */}
            <div
              className="absolute right-[16%] top-[12%] h-[34%] w-[24%] rounded-full transition-opacity duration-700"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,246,222,.98) 0%, rgba(255,231,166,.45) 45%, rgba(255,231,166,0) 72%)",
                opacity: meshOn ? 0.35 : 1,
              }}
            />
            {/* skyline */}
            <div className="absolute inset-x-0 bottom-0 h-[46%]">
              {[
                [4, 11, 52],
                [16, 7, 74],
                [25, 13, 40],
                [40, 9, 88],
                [51, 15, 58],
                [68, 8, 70],
                [78, 17, 46],
              ].map(([left, w, h]) => (
                <span
                  key={left}
                  className="absolute bottom-0 block bg-[rgba(28,38,44,.36)]"
                  style={{ left: `${left}%`, width: `${w}%`, height: `${h}%` }}
                />
              ))}
            </div>

            {/* sunscreen mesh */}
            <div
              className="absolute inset-x-0 top-0 transition-[height] duration-700 ease-out"
              style={{
                height: meshOn ? "100%" : "0%",
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(40,44,48,.55) 0 1px, rgba(60,66,70,.2) 1px 3px), repeating-linear-gradient(90deg, rgba(40,44,48,.5) 0 1px, transparent 1px 3px)",
              }}
            />

            {/* sheer */}
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                opacity: sheerOn ? 1 : 0,
                background: "rgba(246,244,238,.55)",
                backdropFilter: "blur(3px)",
                WebkitBackdropFilter: "blur(3px)",
              }}
            />

            {/* blackout panel */}
            <div
              className="absolute inset-x-0 top-0 transition-[height] duration-[900ms] ease-in-out"
              style={{
                height: blackoutOn ? "100%" : "0%",
                background: "linear-gradient(180deg,#23262a,#15171a)",
              }}
            />
            {blackoutOn && (
              <>
                <span className="absolute inset-y-0 left-0 w-[3px] bg-[rgba(255,240,200,.35)]" />
                <span className="absolute inset-y-0 right-0 w-[3px] bg-[rgba(255,240,200,.35)]" />
              </>
            )}

            {/* mullions */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3">
              <span className="border-r-4 border-[#f2f0ea]" />
              <span className="border-r-4 border-[#f2f0ea]" />
              <span />
            </div>
          </div>

          {/* curtains */}
          <div
            className="absolute left-[17%] top-[7%] h-[70%] transition-[width] duration-[900ms] ease-out"
            style={{
              width: curtainsOn ? "13%" : "3%",
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(198,186,164,1) 0 6px, rgba(224,215,198,1) 6px 14px)",
              boxShadow: "2px 0 10px -4px rgba(20,22,26,.35)",
            }}
          />
          <div
            className="absolute right-[5%] top-[7%] h-[70%] transition-[width] duration-[900ms] ease-out"
            style={{
              width: curtainsOn ? "13%" : "3%",
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(224,215,198,1) 0 6px, rgba(198,186,164,1) 6px 14px)",
              boxShadow: "-2px 0 10px -4px rgba(20,22,26,.35)",
            }}
          />

          {/* floor */}
          <div className="absolute inset-x-0 bottom-0 h-[24%] bg-[#ddd8cd]">
            <div
              className="absolute bottom-[14%] left-[12%] right-[12%] h-[62%] rounded-[2px] transition-opacity duration-700"
              style={{
                opacity: finishOn ? 1 : 0,
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(154,117,38,.1) 0 3px, transparent 3px 9px), linear-gradient(180deg,#cfc5b1,#bdb19a)",
                boxShadow: "0 6px 18px -12px rgba(20,22,26,.6)",
              }}
            />
          </div>

          {/* scene chip */}
          <div
            className="absolute left-4 top-4 rounded-sm bg-ink/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-stone transition-opacity duration-500"
            style={{ opacity: state === "automation" ? 1 : 0 }}
          >
            Scene · Good morning
          </div>
        </div>

        {/* ---- controls ---- */}
        <div className="grid grid-cols-3 gap-px border-t border-line bg-line sm:grid-cols-6">
          {STATES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setState(s.id)}
              aria-pressed={state === s.id}
              className={`px-2 py-3 text-[10.5px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                state === s.id ? "bg-ink text-white" : "bg-white/70 text-ink-2 hover:bg-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---- readout ---- */}
      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <p className="font-display text-[22px] leading-none">{active.headline}</p>
          <p className="mt-1.5 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">{active.body}</p>
        </div>
        <p className="font-mono text-[11.5px] leading-relaxed text-brass sm:max-w-[22ch] sm:text-right">
          {active.spec}
        </p>
      </div>
    </div>
  );
}
