import { Suspense } from "react";
import type { Metadata } from "next";
import { AssessmentFlow } from "@/components/assessment-flow";

export const metadata: Metadata = {
  title: "Space Assessment",
  description:
    "Six questions and a photo. You get a scored profile of your space and three specified options — before anyone tries to sell you anything.",
};

export default function AssessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[860px] px-5 py-24 sm:px-8">
          <p className="eyebrow">Space assessment</p>
          <p className="mt-4 font-display text-[22px]">Loading your assessment…</p>
        </div>
      }
    >
      <AssessmentFlow />
    </Suspense>
  );
}
