"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  BUDGET_BANDS,
  CONTEXTS,
  GLAZING,
  PROBLEMS,
  PROPERTY_STATUS,
  ROOMS,
  type BudgetBandId,
  type ContextId,
  type GlazingId,
  type OrientationId,
  type ProblemId,
  type PropertyStatusId,
  type RoomId,
} from "@/lib/taxonomy";
import { COMMUNITIES } from "@/data/communities";
import { makeThumbnail, newToken, saveAssessment } from "@/lib/assessment-store";
import { Flow, type Answers, type FlowStep } from "@/components/flow";

const TIMEFRAMES = ["Within 2 weeks", "This month", "1–3 months", "Just planning"];

export function AssessmentFlow() {
  const router = useRouter();
  const params = useSearchParams();

  const [answers, setAnswers] = useState<Answers>(() => ({
    context: params.get("context") ?? undefined,
    problems: params.get("problem") ? [params.get("problem")] : [],
    community: params.get("community") ?? undefined,
    openings: 1,
    language: "en",
  }));
  const [photos, setPhotos] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const steps: FlowStep[] = useMemo(
    () => [
      {
        step: {
          kind: "single",
          id: "context",
          question: "Where is the space?",
          hint: "This changes everything we recommend.",
          choices: CONTEXTS.map((c) => ({ value: c.id, label: c.label, note: c.note })),
        },
      },
      {
        step: {
          kind: "multi",
          id: "problems",
          question: "What are you trying to solve?",
          hint: "Choose as many as apply. Your answer outranks anything we infer.",
          choices: PROBLEMS.map((p) => ({ value: p.id, label: p.label, note: p.note })),
        },
      },
      {
        step: {
          kind: "single",
          id: "room",
          question: "Which room?",
          optional: true,
          choices: ROOMS.filter(
            (r) =>
              !answers.context ||
              r.contexts.includes(answers.context as ContextId) ||
              answers.context === "architect" ||
              answers.context === "developer",
          ).map((r) => ({ value: r.id, label: r.label })),
        },
      },
      {
        step: {
          kind: "counter",
          id: "openings",
          question: "How many openings?",
          hint: "Windows, doors or glass panels in this space.",
          presets: [1, 4, 8, 12, 25],
        },
      },
      {
        step: {
          kind: "fields",
          id: "size",
          question: "Rough size of the main opening?",
          hint: "An estimate is fine — nothing is made from it. We measure on site.",
          optional: true,
          fields: [
            { key: "width", label: "Width (m)", type: "number", placeholder: "5.2" },
            { key: "drop", label: "Drop (m)", type: "number", placeholder: "3.0" },
            { key: "ceiling", label: "Ceiling height (m)", type: "number", placeholder: "3.4" },
          ],
        },
      },
      {
        step: {
          kind: "photo",
          id: "photos",
          question: "Show us the space.",
          hint: "Up to three. They stay on your device until you send them.",
          optional: true,
        },
      },
      {
        step: {
          kind: "compass",
          id: "orientation",
          question: "Which way does the glass face?",
          hint: "The strongest single clue to the right answer in the UAE.",
        },
      },
      {
        step: {
          kind: "single",
          id: "community",
          question: "Which area?",
          optional: true,
          choices: [
            ...COMMUNITIES.map((c) => ({ value: c.slug, label: c.name })),
            { value: "other", label: "Somewhere else" },
          ],
        },
      },
      {
        step: {
          kind: "single",
          id: "glazing",
          question: "What is the glazing?",
          optional: true,
          choices: GLAZING.map((g) => ({ value: g.id, label: g.label, note: g.note })),
        },
      },
      {
        step: {
          kind: "single",
          id: "status",
          question: "The property is…",
          optional: true,
          choices: PROPERTY_STATUS.map((s) => ({ value: s.id, label: s.label, note: s.note })),
        },
      },
      {
        step: {
          kind: "single",
          id: "timeframe",
          question: "When would you like it done?",
          optional: true,
          choices: TIMEFRAMES.map((t) => ({ value: t, label: t })),
        },
      },
      {
        step: {
          kind: "single",
          id: "budget",
          question: "How far do you want to take it?",
          hint: "We show all three levels either way.",
          optional: true,
          choices: BUDGET_BANDS.map((b) => ({ value: b.id, label: b.label, note: b.note })),
        },
      },
      {
        step: {
          kind: "fields",
          id: "contact",
          question: "Where should we send it?",
          fields: [
            { key: "name", label: "Your name", required: true },
            { key: "whatsapp", label: "WhatsApp number", type: "tel", required: true, placeholder: "+971 …" },
            { key: "email", label: "Email (optional)", type: "email" },
          ],
        },
      },
      {
        step: {
          kind: "single",
          id: "language",
          question: "Which language suits you?",
          choices: [
            { value: "en", label: "English" },
            { value: "ar", label: "العربية" },
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
              Drapes &amp; Fitouts may contact me about this assessment and keep my answers and any
              photographs for that purpose. I can withdraw at any time.{" "}
              <Link href="/privacy" className="link-underline text-ink">
                How we handle your data
              </Link>
              .
            </>
          ),
        },
      },
    ],
    [answers.context],
  );

  const onPhoto = async (files: FileList | null) => {
    if (!files?.length) return;
    for (const file of Array.from(files).slice(0, 3 - photos.length)) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const thumb = await makeThumbnail(file);
        setPhotos((t) => [...t, thumb].slice(0, 3));
      } catch {
        /* unreadable file — the step stays optional */
      }
    }
  };

  const complete = () => {
    setBusy(true);
    const token = newToken();
    const size = (answers.size ?? {}) as Record<string, string>;
    const contact = (answers.contact ?? {}) as Record<string, string>;
    const num = (v?: string) => (v && !Number.isNaN(Number(v)) ? Number(v) : undefined);

    saveAssessment({
      token,
      createdAt: new Date().toISOString(),
      thumbnails: photos,
      community: answers.community as string | undefined,
      contact: {
        name: contact.name ?? "",
        whatsapp: contact.whatsapp ?? "",
        email: contact.email ?? "",
        language: (answers.language as "en" | "ar") ?? "en",
        consent: answers.consent === true,
        consentAt: new Date().toISOString(),
      },
      input: {
        context: (answers.context as ContextId) ?? "home",
        problems: (answers.problems as ProblemId[]) ?? [],
        room: answers.room as RoomId | undefined,
        openings: typeof answers.openings === "number" ? answers.openings : 1,
        widthM: num(size.width),
        dropM: num(size.drop),
        ceilingHeightM: num(size.ceiling),
        orientation: (answers.orientation as OrientationId) ?? "unknown",
        glazing: (answers.glazing as GlazingId) ?? "unknown",
        community: answers.community as string | undefined,
        status: answers.status as PropertyStatusId | undefined,
        budget: answers.budget as BudgetBandId | undefined,
        mediaCount: photos.length,
        timeframe: answers.timeframe as string | undefined,
      },
    });

    router.push(`/assessment/${token}`);
  };

  return (
    <Flow
      eyebrow="Space assessment"
      steps={steps}
      answers={answers}
      setAnswers={setAnswers}
      onComplete={complete}
      onPhoto={onPhoto}
      photos={photos}
      onRemovePhoto={(i) => setPhotos((all) => all.filter((_, j) => j !== i))}
      finishLabel="See my Space DNA"
      busy={busy}
    />
  );
}
