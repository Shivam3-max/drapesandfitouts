"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CONTEXTS, type ContextId } from "@/lib/taxonomy";
import { COMMUNITIES } from "@/data/communities";
import { Flow, FlowDone, type Answers, type FlowStep } from "@/components/flow";

const WHATSAPP = "971559787259";
const EMIRATES = ["Dubai", "Sharjah", "Abu Dhabi", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];
const SLOTS = ["Morning · 9–12", "Afternoon · 12–4", "Evening · 4–7", "Weekend"];

export function BookingFlow() {
  const params = useSearchParams();
  const ref = params.get("ref");

  const [answers, setAnswers] = useState<Answers>(() => ({
    context: params.get("context") ?? undefined,
    emirate: "Dubai",
    openings: 4,
  }));
  const [done, setDone] = useState(false);

  const steps: FlowStep[] = useMemo(
    () => [
      {
        step: {
          kind: "single",
          id: "context",
          question: "What are we visiting?",
          choices: CONTEXTS.filter((c) => c.id !== "architect" && c.id !== "developer").map((c) => ({
            value: c.id,
            label: c.label,
            note: c.note,
          })),
        },
      },
      {
        step: {
          kind: "single",
          id: "emirate",
          question: "Which emirate?",
          choices: EMIRATES.map((e) => ({ value: e, label: e })),
        },
      },
      {
        step: {
          kind: "single",
          id: "community",
          question: "Which area?",
          hint: "It helps us send the right consultant.",
          optional: true,
          choices: [
            ...COMMUNITIES.map((c) => ({ value: c.name, label: c.name })),
            { value: "Somewhere else", label: "Somewhere else" },
          ],
        },
      },
      {
        step: {
          kind: "counter",
          id: "openings",
          question: "Roughly how many openings?",
          hint: "A rough count is enough.",
          optional: true,
          presets: [2, 6, 12, 25],
        },
      },
      {
        step: {
          kind: "single",
          id: "slot",
          question: "When suits you?",
          choices: SLOTS.map((s) => ({ value: s, label: s })),
        },
      },
      {
        step: {
          kind: "textarea",
          id: "notes",
          question: "Anything we should know?",
          hint: "Access, security clearance, building management, working hours.",
          optional: true,
          placeholder: "Optional",
        },
      },
      {
        step: {
          kind: "fields",
          id: "contact",
          question: "How do we reach you?",
          fields: [
            { key: "name", label: "Your name", required: true },
            { key: "whatsapp", label: "WhatsApp number", type: "tel", required: true, placeholder: "+971 …" },
          ],
        },
      },
      {
        step: {
          kind: "consent",
          id: "consent",
          question: "One last thing.",
          statement: (
            <>
              Drapes &amp; Fitouts may contact me about this visit and keep these details for that
              purpose. I can withdraw at any time.{" "}
              <Link href="/privacy" className="link-underline text-ink">
                How we handle your data
              </Link>
              .
            </>
          ),
        },
      },
    ],
    [],
  );

  const contact = (answers.contact ?? {}) as Record<string, string>;
  const message = [
    "Site visit request — Drapes & Fitouts",
    "",
    `Name: ${contact.name ?? ""}`,
    `Type: ${CONTEXTS.find((c) => c.id === (answers.context as ContextId))?.label ?? "—"}`,
    `Where: ${answers.emirate}${answers.community ? ` · ${answers.community}` : ""}`,
    answers.openings ? `Openings: ${answers.openings}` : null,
    `Preferred time: ${answers.slot ?? "—"}`,
    answers.notes ? `Notes: ${answers.notes}` : null,
    ref ? `Assessment ref: ${ref.slice(0, 6).toUpperCase()}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  if (done) {
    return (
      <FlowDone eyebrow="Ready to send" title="Send it, and we'll confirm your slot.">
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-[3px] border border-line bg-white/70 p-5 font-mono text-[12px] leading-relaxed text-ink-2">
{message}
        </pre>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`} className="btn btn-solid">
            Send on WhatsApp
          </a>
          <button type="button" onClick={() => setDone(false)} className="btn btn-ghost">
            Change something
          </button>
        </div>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          The visit takes about 45 minutes and costs nothing.
        </p>
      </FlowDone>
    );
  }

  return (
    <Flow
      eyebrow="Book a visit"
      steps={steps}
      answers={answers}
      setAnswers={setAnswers}
      onComplete={() => setDone(true)}
      finishLabel="Review my request"
    />
  );
}
