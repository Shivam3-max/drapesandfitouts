"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Flow, FlowDone, type Answers, type FlowStep } from "@/components/flow";

/**
 * Smart Film screening. Five taps and a straight answer — including the
 * answers that send someone to a blind instead of a film quote.
 */

type Verdict = {
  status: "eligible" | "survey" | "unsuitable";
  headline: string;
  body: string;
  next: string[];
};

const STEPS: FlowStep[] = [
  {
    step: {
      kind: "single",
      id: "surface",
      question: "What is the glass like?",
      choices: [
        { value: "flat", label: "Flat and smooth" },
        { value: "textured", label: "Textured or frosted" },
        { value: "curved", label: "Curved" },
        { value: "unknown", label: "I'm not sure" },
      ],
    },
  },
  {
    step: {
      kind: "single",
      id: "location",
      question: "Where is it?",
      choices: [
        { value: "partition", label: "Internal partition" },
        { value: "door", label: "A glass door" },
        { value: "window", label: "An external window" },
        { value: "wet", label: "Bathroom or shower screen" },
      ],
    },
  },
  {
    step: {
      kind: "single",
      id: "condition",
      question: "What condition is it in?",
      choices: [
        { value: "good", label: "Clean and undamaged" },
        { value: "film", label: "Already has film or tint" },
        { value: "damaged", label: "Chipped, cracked or scratched" },
      ],
    },
  },
  {
    step: {
      kind: "single",
      id: "power",
      question: "Can power reach the glass edge?",
      choices: [
        { value: "yes", label: "Yes, there's a supply nearby" },
        { value: "maybe", label: "Possibly, with some work" },
        { value: "no", label: "No, and nothing can be chased in" },
      ],
    },
  },
  {
    step: {
      kind: "single",
      id: "access",
      question: "Can the glass be reached?",
      choices: [
        { value: "both", label: "Both sides" },
        { value: "one", label: "One side only" },
        { value: "hard", label: "Hard to reach" },
      ],
    },
  },
];

function assess(a: Record<string, string>): Verdict {
  if (a.surface === "curved")
    return {
      status: "unsuitable",
      headline: "Curved glass — film is not the answer.",
      body: "Film is applied as a flat sheet. On curved glass it will not bond evenly and it fails visibly within months.",
      next: ["Look at a blind or drapery for this opening instead"],
    };
  if (a.surface === "textured")
    return {
      status: "unsuitable",
      headline: "Textured glass won't hold the film.",
      body: "The adhesive needs a smooth surface. On frosted or patterned glass the bond traps air and clouds.",
      next: ["Replace the pane with flat clear glass, then film works", "Or specify a blind here"],
    };
  if (a.condition === "damaged")
    return {
      status: "unsuitable",
      headline: "The glass needs replacing first.",
      body: "Film over a chip or crack magnifies the damage and makes the panel harder to replace later.",
      next: ["Replace or repair the pane", "Book a survey once the new glass is in"],
    };
  if (a.power === "no")
    return {
      status: "unsuitable",
      headline: "No power route means no switchable film.",
      body: "PDLC film only works while it is powered. Without a supply reaching the glass edge, the honest answer is a blind.",
      next: ["Look at roller and panel options", "Start a Space Assessment and we'll specify the alternative"],
    };

  const flags: string[] = [];
  if (a.condition === "film") flags.push("Existing film or tint has to come off first — removal is quoted separately.");
  if (a.power === "maybe") flags.push("The power route is the main variable in the price. The surveyor confirms what's achievable.");
  if (a.access === "one") flags.push("Single-sided access changes the method and the time on site.");
  if (a.access === "hard") flags.push("Restricted access may need equipment, which the survey prices.");
  if (a.location === "window") flags.push("On an external window film gives privacy but not heat control — you may also need shading.");
  if (a.location === "wet") flags.push("In a wet area we detail the edge sealing carefully.");
  if (a.surface === "unknown") flags.push("We confirm the glass type and thickness on site before quoting.");

  return {
    status: flags.length ? "survey" : "eligible",
    headline: flags.length ? "Promising — with things to confirm." : "This looks straightforward.",
    body: flags.length
      ? "Nothing rules film out. These are the points that decide the price and the method, and a surveyor settles them in about half an hour."
      : "Flat, accessible, undamaged glass with power nearby is exactly what film is designed for. We still verify the glass on site before quoting.",
    next: flags.length ? flags : ["Book a survey and we'll confirm the glass and the switching route"],
  };
}

export function GlassCheckFlow() {
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const steps = useMemo(() => STEPS, []);

  if (done) {
    const verdict = assess(answers as Record<string, string>);
    const tone =
      verdict.status === "eligible"
        ? { label: "Looks suitable", cls: "text-good", border: "border-l-good" }
        : verdict.status === "survey"
          ? { label: "Needs a survey", cls: "text-warn", border: "border-l-warn" }
          : { label: "Not suitable", cls: "text-crit", border: "border-l-crit" };

    return (
      <FlowDone eyebrow="Glass check" title={verdict.headline}>
        <p className={`label ${tone.cls}`}>{tone.label}</p>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-2">{verdict.body}</p>

        <ul className={`glass mt-7 space-y-3 rounded-[4px] border-l-2 ${tone.border} p-6`}>
          {verdict.next.map((n) => (
            <li key={n} className="text-[14.5px] leading-snug text-ink-2">
              {n}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/book?context=office" className="btn btn-solid">
            Book a survey
          </Link>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setDone(false);
            }}
            className="btn btn-ghost"
          >
            Check another pane
          </button>
        </div>

        <p className="mt-8 font-mono text-[11px] leading-relaxed text-ink-3">
          A screening tool, not a quotation. Glass type, thickness and the switching route are
          confirmed on site before any price.
        </p>
      </FlowDone>
    );
  }

  return (
    <Flow
      eyebrow="Smart Film · glass check"
      steps={steps}
      answers={answers}
      setAnswers={setAnswers}
      onComplete={() => setDone(true)}
      finishLabel="See the answer"
    />
  );
}
