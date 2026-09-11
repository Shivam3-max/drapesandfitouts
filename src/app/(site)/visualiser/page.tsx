import type { Metadata } from "next";
import Link from "next/link";
import { Visualiser } from "@/components/visualiser";

export const metadata: Metadata = {
  title: "3D room visualiser",
  description:
    "See sheer, blackout, sunscreen and Smart Film on the same window, at the time of day that causes the problem.",
};

export default function VisualiserPage() {
  return (
    <div className="pb-16 pt-8 sm:pt-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">3D visualiser</p>
            <h1 className="display-md mt-3 text-[clamp(30px,4.6vw,56px)]">
              Same window. <span className="italic text-brass">Four answers.</span>
            </h1>
          </div>
          <Link href="/solutions" className="btn btn-ghost">
            All solutions
          </Link>
        </div>
      </div>

      <Visualiser />
    </div>
  );
}
