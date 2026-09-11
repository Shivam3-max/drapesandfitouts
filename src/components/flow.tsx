"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * One question per screen.
 *
 * Every form on the site runs through this: the assessment, the site-visit
 * booking, project registration and the glass check. Choosing a single answer
 * moves you on by itself; everything else has one Continue. You can always go
 * back, including with the browser's own back button.
 */

export type Answers = Record<string, unknown>;

export interface Choice {
  value: string;
  label: string;
  note?: string;
}

export type Step =
  | { kind: "single"; id: string; question: string; hint?: string; choices: Choice[]; optional?: boolean; columns?: 1 | 2 }
  | { kind: "multi"; id: string; question: string; hint?: string; choices: Choice[]; optional?: boolean; columns?: 1 | 2 }
  | { kind: "counter"; id: string; question: string; hint?: string; presets: number[]; min?: number; max?: number; optional?: boolean }
  | { kind: "compass"; id: string; question: string; hint?: string; optional?: boolean }
  | {
      kind: "fields";
      id: string;
      question: string;
      hint?: string;
      optional?: boolean;
      fields: { key: string; label: string; type?: "text" | "tel" | "email" | "number"; placeholder?: string; required?: boolean; suffix?: string }[];
    }
  | { kind: "textarea"; id: string; question: string; hint?: string; optional?: boolean; placeholder?: string }
  | { kind: "photo"; id: string; question: string; hint?: string; optional?: boolean }
  | { kind: "consent"; id: string; question: string; hint?: string; statement: ReactNode; optional?: boolean };

export interface FlowStep {
  step: Step;
  /** Hide the step when earlier answers make it pointless. */
  when?: (a: Answers) => boolean;
}

const COMPASS: { id: string; label: string }[] = [
  { id: "nw", label: "NW" },
  { id: "n", label: "N" },
  { id: "ne", label: "NE" },
  { id: "w", label: "W" },
  { id: "", label: "" },
  { id: "e", label: "E" },
  { id: "sw", label: "SW" },
  { id: "s", label: "S" },
  { id: "se", label: "SE" },
];

export function Flow({
  steps,
  answers,
  setAnswers,
  onComplete,
  finishLabel = "Finish",
  eyebrow,
  onPhoto,
  photos = [],
  onRemovePhoto,
  busy = false,
}: {
  steps: FlowStep[];
  answers: Answers;
  setAnswers: Dispatch<SetStateAction<Answers>>;
  onComplete: () => void;
  finishLabel?: string;
  eyebrow: string;
  /** Photo steps hand files up to the owner, which keeps image handling out of here. */
  onPhoto?: (files: FileList | null) => void;
  photos?: string[];
  onRemovePhoto?: (index: number) => void;
  busy?: boolean;
}) {
  const visible = useMemo(() => steps.filter((s) => !s.when || s.when(answers)), [steps, answers]);
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const advancing = useRef<number | null>(null);

  const current = visible[Math.min(index, visible.length - 1)];
  const step = current?.step;

  const value = step ? answers[step.id] : undefined;

  /** Has the person actually answered, as opposed to being allowed to move on? */
  const answered = useMemo(() => {
    if (!step) return false;
    switch (step.kind) {
      case "single":
      case "compass":
        return Boolean(value);
      case "counter":
        return typeof value === "number";
      case "multi":
        return Array.isArray(value) && value.length > 0;
      case "fields": {
        const v = (value ?? {}) as Record<string, string>;
        return step.fields.some((f) => (v[f.key] ?? "").trim().length > 0);
      }
      case "textarea":
        return typeof value === "string" && value.trim().length > 0;
      case "photo":
        return photos.length > 0;
      case "consent":
        return value === true;
      default:
        return false;
    }
  }, [step, value, photos.length]);

  /** Is the step allowed to be left? */
  const complete = useMemo(() => {
    if (!step) return false;
    if (step.kind === "fields") {
      const v = (value ?? {}) as Record<string, string>;
      return step.fields.every((f) => !f.required || (v[f.key] ?? "").trim().length > 1);
    }
    if (step.kind === "consent") return value === true;
    return answered || Boolean(step.optional);
  }, [step, value, answered]);

  const skippable = Boolean(step?.optional) && !answered;

  const go = useCallback(
    (next: number, push = true) => {
      const target = Math.max(0, Math.min(visible.length - 1, next));
      setTouched(false);
      setIndex(target);
      if (push && typeof window !== "undefined") {
        window.history.pushState({ flowStep: target }, "");
      }
      panel.current?.scrollIntoView({ block: "nearest" });
    },
    [visible.length],
  );

  const advance = useCallback(() => {
    if (index >= visible.length - 1) {
      onComplete();
      return;
    }
    go(index + 1);
  }, [index, visible.length, onComplete, go]);

  const next = useCallback(() => {
    setTouched(true);
    if (!complete && !step?.optional) return;
    advance();
  }, [complete, step, advance]);

  // browser back moves a step back rather than leaving the flow
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = (e.state as { flowStep?: number } | null)?.flowStep;
      setIndex(typeof s === "number" ? s : 0);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => () => {
    if (advancing.current) window.clearTimeout(advancing.current);
  }, []);

  // step transition
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        panel.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      );
    },
    { dependencies: [index], scope: panel },
  );

  // functional updates: two taps in the same tick must not overwrite each other
  const set = (id: string, v: unknown) => setAnswers((prev) => ({ ...prev, [id]: v }));

  const toggleMulti = (id: string, v: string) => {
    setAnswers((prev) => {
      const list = Array.isArray(prev[id]) ? (prev[id] as string[]) : [];
      return {
        ...prev,
        [id]: list.includes(v) ? list.filter((x) => x !== v) : [...list, v],
      };
    });
  };

  /** Single-choice answers move on by themselves, after a beat. */
  const pickAndAdvance = (id: string, v: unknown) => {
    set(id, v);
    if (advancing.current) window.clearTimeout(advancing.current);
    advancing.current = window.setTimeout(() => {
      if (index >= visible.length - 1) onComplete();
      else go(index + 1);
    }, 260);
  };

  // keyboard: number keys pick, Enter continues
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!step) return;
      const target = e.target as HTMLElement;
      const typing = ["INPUT", "TEXTAREA"].includes(target.tagName);
      if (e.key === "Enter" && !typing) {
        e.preventDefault();
        next();
        return;
      }
      if (typing) return;
      if ((step.kind === "single" || step.kind === "multi") && /^[1-9]$/.test(e.key)) {
        const choice = step.choices[Number(e.key) - 1];
        if (!choice) return;
        e.preventDefault();
        if (step.kind === "single") pickAndAdvance(step.id, choice.value);
        else toggleMulti(step.id, choice.value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!step) return null;

  const progress = ((index + 1) / visible.length) * 100;

  return (
    <div className="flex flex-1 flex-col">
      {/* progress */}
      <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-brass transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="tnum font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
            {String(index + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* question */}
      <div className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col px-5 py-12 sm:px-8 sm:py-16">
        <div ref={panel} className="flex-1">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-md mt-5 max-w-[18ch] text-[clamp(32px,5.4vw,60px)]">
            {step.question}
          </h1>
          {step.hint && <p className="mt-4 max-w-[46ch] text-[15px] text-ink-3">{step.hint}</p>}

          <div className="mt-10">
            {step.kind === "single" && (
              <ChoiceGrid columns={step.columns}>
                {step.choices.map((c, i) => (
                  <ChoiceCard
                    key={c.value}
                    index={i}
                    selected={value === c.value}
                    label={c.label}
                    note={c.note}
                    onClick={() => pickAndAdvance(step.id, c.value)}
                  />
                ))}
              </ChoiceGrid>
            )}

            {step.kind === "multi" && (
              <ChoiceGrid columns={step.columns}>
                {step.choices.map((c, i) => (
                  <ChoiceCard
                    key={c.value}
                    index={i}
                    multi
                    selected={Array.isArray(value) && (value as string[]).includes(c.value)}
                    label={c.label}
                    note={c.note}
                    onClick={() => toggleMulti(step.id, c.value)}
                  />
                ))}
              </ChoiceGrid>
            )}

            {step.kind === "counter" && (
              <Counter
                value={typeof value === "number" ? value : undefined}
                presets={step.presets}
                min={step.min ?? 1}
                max={step.max ?? 400}
                onSet={(n) => set(step.id, n)}
                onPick={(n) => pickAndAdvance(step.id, n)}
              />
            )}

            {step.kind === "compass" && (
              <Compass value={typeof value === "string" ? value : undefined} onPick={(v) => pickAndAdvance(step.id, v)} />
            )}

            {step.kind === "fields" && (
              <div className="grid max-w-[640px] gap-4 sm:grid-cols-2">
                {step.fields.map((f) => {
                  const v = ((value ?? {}) as Record<string, string>)[f.key] ?? "";
                  return (
                    <label key={f.key} className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
                        {f.label}
                        {f.required && <span className="text-brass"> *</span>}
                      </span>
                      <input
                        type={f.type ?? "text"}
                        value={v}
                        placeholder={f.placeholder}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [step.id]: { ...((prev[step.id] ?? {}) as object), [f.key]: e.target.value },
                          }))
                        }
                        className="mt-2 w-full rounded-[3px] border border-line bg-white/80 px-4 py-3.5 text-[16px] text-ink placeholder:text-ink-3/60 focus:border-brass focus:outline-none"
                      />
                    </label>
                  );
                })}
              </div>
            )}

            {step.kind === "textarea" && (
              <textarea
                rows={4}
                placeholder={step.placeholder}
                value={typeof value === "string" ? value : ""}
                onChange={(e) => set(step.id, e.target.value)}
                className="w-full max-w-[640px] rounded-[3px] border border-line bg-white/80 px-4 py-3.5 text-[16px] text-ink placeholder:text-ink-3/60 focus:border-brass focus:outline-none"
              />
            )}

            {step.kind === "photo" && (
              <div className="flex flex-wrap items-center gap-4">
                <label className="cursor-pointer rounded-[4px] border border-dashed border-line bg-white/60 px-7 py-6 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-2 transition-colors hover:border-brass hover:text-brass">
                  Add a photo
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => onPhoto?.(e.target.files)}
                  />
                </label>
                {photos.map((t, i) => (
                  <div key={i} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t} alt={`Your space, photo ${i + 1}`} className="h-28 w-36 rounded-[3px] object-cover" />
                    <button
                      type="button"
                      onClick={() => onRemovePhoto?.(i)}
                      className="absolute right-1.5 top-1.5 rounded-full bg-ink/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-white"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {step.kind === "consent" && (
              <button
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, [step.id]: prev[step.id] !== true }))}
                aria-pressed={value === true}
                className={`glass flex max-w-[640px] items-start gap-4 rounded-[4px] p-6 text-left transition-all ${
                  value === true ? "border-brass" : ""
                }`}
              >
                <span
                  className={`mt-0.5 block h-5 w-5 shrink-0 rounded-[3px] border ${
                    value === true ? "border-brass bg-brass" : "border-line"
                  }`}
                />
                <span className="text-[15px] leading-relaxed text-ink-2">{step.statement}</span>
              </button>
            )}
          </div>

          {touched && !complete && (
            <p className="mt-6 text-[14px] text-crit">
              {step.kind === "consent"
                ? "We need your agreement before we can continue."
                : step.kind === "fields"
                  ? "Please fill the marked fields."
                  : "Choose an option to continue."}
            </p>
          )}
        </div>

        {/* controls */}
        <div className="mt-14 flex items-center justify-between gap-4 border-t border-line pt-6">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="-ml-2 rounded-full px-2 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-3 transition-colors hover:text-ink disabled:opacity-30"
          >
            ← Back
          </button>

          <div className="flex items-center gap-5">
            {skippable && (
              <button
                type="button"
                onClick={advance}
                className="px-2 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3 underline-offset-4 hover:underline"
              >
                Skip
              </button>
            )}
            <button
              type="button"
              onClick={next}
              disabled={busy}
              className={`btn ${answered || !skippable ? "btn-solid" : "btn-ghost"}`}
            >
              {busy ? "One moment…" : index === visible.length - 1 ? finishLabel : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- pieces ---------------- */

function ChoiceGrid({ children, columns = 2 }: { children: ReactNode; columns?: 1 | 2 }) {
  return (
    <div className={`grid max-w-[860px] gap-3 ${columns === 1 ? "" : "sm:grid-cols-2"}`}>{children}</div>
  );
}

function ChoiceCard({
  label,
  note,
  selected,
  onClick,
  multi = false,
  index,
}: {
  label: string;
  note?: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
  index: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex items-start gap-4 rounded-[4px] p-5 text-left transition-all duration-300 ${
        selected
          ? "bg-ink text-white shadow-[0_20px_44px_-30px_rgba(16,18,20,.9)]"
          : "glass hover:-translate-y-[2px]"
      }`}
    >
      <span
        className={`mt-1 grid h-5 w-5 shrink-0 place-items-center border font-mono text-[9px] ${
          multi ? "rounded-[3px]" : "rounded-full"
        } ${selected ? "border-brass-light bg-brass-light text-ink" : "border-line text-ink-3"}`}
      >
        {selected ? "✓" : index + 1}
      </span>
      <span>
        <span className="block font-display text-[24px] leading-none">{label}</span>
        {note && (
          <span className={`mt-2 block text-[13px] leading-snug ${selected ? "text-white/60" : "text-ink-3"}`}>
            {note}
          </span>
        )}
      </span>
    </button>
  );
}

function Counter({
  value,
  presets,
  min,
  max,
  onSet,
  onPick,
}: {
  value?: number;
  presets: number[];
  min: number;
  max: number;
  onSet: (n: number) => void;
  onPick: (n: number) => void;
}) {
  const v = value ?? min;
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Fewer"
          onClick={() => onSet(Math.max(min, v - 1))}
          className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white/80 text-[20px] text-ink transition-colors hover:border-brass hover:text-brass"
        >
          −
        </button>
        <span className="tnum w-20 text-center font-display text-[46px] leading-none">{v}</span>
        <button
          type="button"
          aria-label="More"
          onClick={() => onSet(Math.min(max, v + 1))}
          className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white/80 text-[20px] text-ink transition-colors hover:border-brass hover:text-brass"
        >
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPick(n)}
            className={`rounded-full border px-5 py-2.5 text-[13px] transition-colors ${
              value === n
                ? "border-ink bg-ink text-white"
                : "border-line bg-white/70 text-ink-2 hover:border-ink hover:text-ink"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function Compass({ value, onPick }: { value?: string; onPick: (v: string) => void }) {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <div className="grid w-[280px] grid-cols-3 gap-px overflow-hidden rounded-[4px] bg-line">
        {COMPASS.map((c, i) =>
          c.id === "" ? (
            <div key={i} className="grid aspect-square place-items-center bg-white">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-3">Glass</span>
            </div>
          ) : (
            <button
              key={c.id}
              type="button"
              onClick={() => onPick(c.id)}
              aria-pressed={value === c.id}
              className={`grid aspect-square place-items-center font-display text-[22px] transition-colors ${
                value === c.id ? "bg-ink text-white" : "bg-white/80 text-ink-2 hover:bg-white hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          ),
        )}
      </div>
      <button
        type="button"
        onClick={() => onPick("unknown")}
        aria-pressed={value === "unknown"}
        className={`rounded-full border px-5 py-2.5 text-[13px] transition-colors ${
          value === "unknown"
            ? "border-ink bg-ink text-white"
            : "border-line bg-white/70 text-ink-2 hover:border-ink hover:text-ink"
        }`}
      >
        I&apos;m not sure
      </button>
    </div>
  );
}

/* ---------------- shared closing screen ---------------- */

export function FlowDone({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1100px] flex-1 px-5 py-16 sm:px-8 sm:py-24">
      <p className="eyebrow text-brass">{eyebrow}</p>
      <h1 className="display-md mt-5 max-w-[16ch] text-[clamp(34px,5.4vw,62px)]">{title}</h1>
      <div className="mt-10 max-w-[640px]">{children}</div>
    </div>
  );
}
