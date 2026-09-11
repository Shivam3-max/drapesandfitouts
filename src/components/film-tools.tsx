"use client";

import { useState } from "react";

/* ---------------- the clear / private demonstration ---------------- */

export function FilmSwitch() {
  const [private_, setPrivate] = useState(false);

  return (
    <div>
      <div className="glass relative aspect-[16/10] overflow-hidden rounded-[3px] p-0">
        {/* the room behind the glass */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#e8e4db,#d7d2c6)" }}>
          <div className="absolute bottom-0 left-0 right-0 h-[34%]" style={{ background: "#cfc8b9" }} />
          {/* a meeting table and chairs, abstracted */}
          <div
            className="absolute bottom-[26%] left-1/2 h-[16%] w-[46%] -translate-x-1/2 rounded-[4px]"
            style={{ background: "#8d8474", boxShadow: "0 10px 22px -14px rgba(20,22,26,.8)" }}
          />
          {[22, 34, 58, 70].map((left) => (
            <span
              key={left}
              className="absolute bottom-[24%] block h-[14%] w-[7%] rounded-t-[4px]"
              style={{ left: `${left}%`, background: "#6f6a60" }}
            />
          ))}
          <div
            className="absolute right-[8%] top-[14%] h-[30%] w-[22%] rounded-[2px]"
            style={{ background: "#b9b2a3" }}
          />
        </div>

        {/* the switchable layer */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: private_ ? "rgba(233,236,235,.78)" : "rgba(233,236,235,0)",
            backdropFilter: private_ ? "blur(14px) saturate(.5)" : "blur(0px)",
            WebkitBackdropFilter: private_ ? "blur(14px) saturate(.5)" : "blur(0px)",
          }}
        />

        {/* frame and mullions */}
        <div className="pointer-events-none absolute inset-0 grid grid-cols-3 border-[6px] border-[#2a2d31]">
          <span className="border-r-[6px] border-[#2a2d31]" />
          <span className="border-r-[6px] border-[#2a2d31]" />
          <span />
        </div>

        <div className="absolute left-4 top-4 rounded-sm bg-ink/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
          {private_ ? "Power off · opaque" : "Power on · clear"}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3">
          Glass state · <span className="text-brass">{private_ ? "private" : "clear"}</span>
        </p>
        <button
          type="button"
          onClick={() => setPrivate((v) => !v)}
          className="btn btn-solid"
        >
          {private_ ? "Make it clear" : "Make it private"}
        </button>
      </div>
    </div>
  );
}
