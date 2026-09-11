"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { Floor, Layer, RoomState, TimeOfDay } from "@/components/room-3d";

// loaded after first paint: the controls and copy render immediately
const Room3D = dynamic(() => import("@/components/room-3d").then((m) => m.Room3D), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full"
      style={{ background: "linear-gradient(168deg,#e8e4dc 0%,#d2cabb 46%,#b6ab97 100%)" }}
    />
  ),
});

const LAYERS: { id: Layer; label: string; note: string }[] = [
  { id: "none", label: "Bare glass", note: "How the room was handed over. Full sun, full exposure." },
  { id: "sheer", label: "Sheer", note: "Daytime privacy and softened light. Not a heat product, and not private after dark." },
  { id: "blackout", label: "Blackout", note: "Near dark. The fabric is easy — the edges are what actually decide it." },
  { id: "roller", label: "Sunscreen roller", note: "Cuts the solar load and the glare while you keep the view out." },
  { id: "film", label: "Smart Film", note: "Privacy on the glass itself, in under a second. It does not control heat." },
];

const TIMES: { id: TimeOfDay; label: string }[] = [
  { id: "morning", label: "Morning" },
  { id: "noon", label: "Midday" },
  { id: "evening", label: "4 pm, west" },
];

const FLOORS: { id: Floor; label: string }[] = [
  { id: "tile", label: "Tile" },
  { id: "carpet", label: "Rug" },
];

export function Visualiser({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<RoomState>({ layer: "none", time: "evening", floor: "tile" });
  const active = LAYERS.find((l) => l.id === state.layer)!;

  return (
    <div className={compact ? "" : "mx-auto max-w-[1400px] px-4 sm:px-6"}>
      <div className="relative overflow-hidden rounded-[4px] border border-line">
        <div className={compact ? "h-[52vh] min-h-[320px]" : "h-[58vh] min-h-[340px] sm:h-[68vh]"}>
          <Room3D state={state} />
        </div>

        {/* drag hint */}
        <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/70 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-2 backdrop-blur">
          Drag to look around
        </div>

        {/* what you're seeing */}
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-[38ch]">
          <div className="glass-strong rounded-[3px] px-5 py-4">
            <p className="font-display text-[22px] leading-none">{active.label}</p>
            <p className="mt-2 text-[13px] leading-snug text-ink-2">{active.note}</p>
          </div>
        </div>
      </div>

      {/* ---- controls: a sheet on mobile, a row on desktop ---- */}
      <div className="glass mt-3 rounded-[4px] p-3 sm:p-4">
        <Control label="Treatment">
          <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1">
            {LAYERS.map((l) => (
              <Chip
                key={l.id}
                active={state.layer === l.id}
                onClick={() => setState((s) => ({ ...s, layer: l.id }))}
              >
                {l.label}
              </Chip>
            ))}
          </div>
        </Control>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Control label="Time of day">
            <div className="flex gap-2">
              {TIMES.map((t) => (
                <Chip
                  key={t.id}
                  active={state.time === t.id}
                  onClick={() => setState((s) => ({ ...s, time: t.id }))}
                >
                  {t.label}
                </Chip>
              ))}
            </div>
          </Control>
          <Control label="Floor">
            <div className="flex gap-2">
              {FLOORS.map((f) => (
                <Chip
                  key={f.id}
                  active={state.floor === f.id}
                  onClick={() => setState((s) => ({ ...s, floor: f.id }))}
                >
                  {f.label}
                </Chip>
              ))}
            </div>
          </Control>
        </div>

        {!compact && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
              A model, not your room — yet. Send a photo and we score the real one.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/assess" className="btn btn-solid">
                Assess my space
              </Link>
              <Link href="/book" className="btn btn-ghost">
                Book a visit
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-3">{label}</p>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-4 py-2.5 text-[13px] transition-colors ${
        active ? "border-ink bg-ink text-white" : "border-line bg-white/70 text-ink-2 hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
