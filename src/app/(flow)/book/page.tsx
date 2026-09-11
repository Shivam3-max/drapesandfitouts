import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking-flow";

export const metadata: Metadata = {
  title: "Book a visit",
  description: "A 45-minute site visit: every opening measured, the glass checked, the right fabrics brought to you.",
};

export default function BookPage() {
  return (
    <Suspense fallback={<FlowFallback label="Book a visit" />}>
      <BookingFlow />
    </Suspense>
  );
}

function FlowFallback({ label }: { label: string }) {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-20 sm:px-8">
      <p className="eyebrow">{label}</p>
      <p className="display-md mt-5 text-[32px]">Loading…</p>
    </div>
  );
}
