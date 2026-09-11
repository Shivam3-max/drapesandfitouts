"use client";

import { useMemo, useState } from "react";
import { forgetEverything, listAssessments } from "@/lib/assessment-store";
import { useHydrated } from "@/lib/use-hydrated";

export function DataControls() {
  const hydrated = useHydrated();
  const [cleared, setCleared] = useState(false);
  const stored = useMemo(() => (hydrated ? listAssessments().length : null), [hydrated]);
  const count = cleared ? 0 : stored;

  if (count === null) return null;

  return (
    <div className="border border-rule-soft bg-stone p-6">
      <p className="font-mono text-[12px] text-ink-2">
        {cleared
          ? "Cleared. Nothing from this site is left in this browser."
          : count === 0
            ? "No assessments are stored in this browser."
            : `${count} assessment${count === 1 ? "" : "s"} stored in this browser.`}
      </p>
      {count > 0 && !cleared && (
        <button
          type="button"
          onClick={() => {
            forgetEverything();
            setCleared(true);
          }}
          className="mt-4 rounded-sm border border-rule px-5 py-2.5 font-display text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-2 transition-colors hover:border-crit hover:text-crit"
        >
          Delete them from this browser
        </button>
      )}
    </div>
  );
}
