"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Flow, FlowDone, type Answers, type FlowStep } from "@/components/flow";

const WHATSAPP = "971559787259";

const ROLES = [
  { value: "architect", label: "Architect" },
  { value: "designer", label: "Interior designer" },
  { value: "fitout", label: "Fit-out contractor" },
  { value: "developer", label: "Developer" },
  { value: "other", label: "Something else" },
];

const PROJECT_TYPES = [
  { value: "villa", label: "Villa" },
  { value: "apartments", label: "Apartment building" },
  { value: "office", label: "Office" },
  { value: "hotel", label: "Hotel" },
  { value: "clinic", label: "Clinic" },
  { value: "retail", label: "Retail" },
  { value: "mixed", label: "Mixed use" },
];

const STAGES = [
  { value: "concept", label: "Concept", note: "Still shaping the idea" },
  { value: "design", label: "Design", note: "Drawings in progress" },
  { value: "tender", label: "Tender", note: "Pricing the package" },
  { value: "site", label: "On site", note: "Works have started" },
  { value: "handover", label: "Handover soon", note: "Weeks, not months" },
];

const SCOPE = [
  { value: "curtains", label: "Curtains" },
  { value: "blinds", label: "Blinds" },
  { value: "film", label: "Smart Film" },
  { value: "carpets", label: "Carpets" },
  { value: "wallpaper", label: "Wallpaper" },
  { value: "automation", label: "Automation" },
];

const NEEDS = [
  { value: "spec", label: "Specification support" },
  { value: "samples", label: "Sample kit" },
  { value: "pricing", label: "Project pricing" },
  { value: "survey", label: "Site survey" },
  { value: "coordination", label: "Programme coordination" },
];

const TIMING = [
  { value: "now", label: "Now" },
  { value: "1-3", label: "1–3 months" },
  { value: "3-6", label: "3–6 months" },
  { value: "6+", label: "Later than 6 months" },
];

export function RegisterFlow() {
  const [answers, setAnswers] = useState<Answers>({ units: 20 });
  const [done, setDone] = useState(false);

  const steps: FlowStep[] = useMemo(
    () => [
      { step: { kind: "single", id: "role", question: "What do you do?", choices: ROLES } },
      { step: { kind: "single", id: "type", question: "What is the project?", choices: PROJECT_TYPES } },
      { step: { kind: "single", id: "stage", question: "Where is it up to?", choices: STAGES } },
      {
        step: {
          kind: "multi",
          id: "scope",
          question: "What is in scope?",
          hint: "Choose as many as apply.",
          choices: SCOPE,
        },
      },
      {
        step: {
          kind: "counter",
          id: "units",
          question: "Roughly how many openings or units?",
          hint: "A ballpark is fine at this stage.",
          optional: true,
          presets: [10, 30, 80, 200],
          max: 2000,
        },
      },
      { step: { kind: "single", id: "timing", question: "When does it need to be on site?", choices: TIMING } },
      {
        step: {
          kind: "multi",
          id: "needs",
          question: "What do you need from us?",
          choices: NEEDS,
        },
      },
      {
        step: {
          kind: "fields",
          id: "details",
          question: "The project, and you.",
          fields: [
            { key: "project", label: "Project name", required: true },
            { key: "company", label: "Your practice or company" },
            { key: "name", label: "Your name", required: true },
            { key: "whatsapp", label: "WhatsApp number", type: "tel", required: true, placeholder: "+971 …" },
            { key: "email", label: "Email", type: "email" },
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
              Register this project to me and my practice. Drapes &amp; Fitouts may contact me about
              it and keep these details for that purpose.{" "}
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

  const d = (answers.details ?? {}) as Record<string, string>;
  const labels = (list: { value: string; label: string }[], ids?: unknown) =>
    Array.isArray(ids)
      ? (ids as string[]).map((v) => list.find((x) => x.value === v)?.label ?? v).join(", ")
      : "—";

  const message = [
    "Project registration — Drapes & Fitouts",
    "",
    `Project: ${d.project ?? ""}`,
    `Practice: ${d.company ?? "—"}`,
    `Contact: ${d.name ?? ""}`,
    `Role: ${ROLES.find((r) => r.value === answers.role)?.label ?? "—"}`,
    `Type: ${PROJECT_TYPES.find((t) => t.value === answers.type)?.label ?? "—"}`,
    `Stage: ${STAGES.find((s) => s.value === answers.stage)?.label ?? "—"}`,
    `Scope: ${labels(SCOPE, answers.scope)}`,
    `Size: ~${answers.units} openings/units`,
    `On site: ${TIMING.find((t) => t.value === answers.timing)?.label ?? "—"}`,
    `Needs: ${labels(NEEDS, answers.needs)}`,
  ].join("\n");

  if (done) {
    return (
      <FlowDone eyebrow="Registered" title="The project is yours.">
        <p className="text-[16px] leading-relaxed text-ink-2">
          Attribution stays with you through survey, quotation and installation — including if your
          client contacts us directly. Send this across and we&apos;ll come back with the
          specification support you asked for.
        </p>
        <pre className="mt-7 overflow-x-auto whitespace-pre-wrap rounded-[3px] border border-line bg-white/70 p-5 font-mono text-[12px] leading-relaxed text-ink-2">
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
      </FlowDone>
    );
  }

  return (
    <Flow
      eyebrow="Register a project"
      steps={steps}
      answers={answers}
      setAnswers={setAnswers}
      onComplete={() => setDone(true)}
      finishLabel="Register the project"
    />
  );
}
