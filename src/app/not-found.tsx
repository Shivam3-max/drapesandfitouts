import { PrimaryLink, GhostLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[640px] px-5 py-28 sm:px-8">
      <p className="eyebrow">404</p>
      <h1 className="display mt-5 text-[clamp(30px,5vw,48px)]">This page isn&apos;t here.</h1>
      <p className="mt-6 text-[18px] leading-relaxed text-ink-2">
        The link may be old, or the page may have moved. The quickest route to what you need is the
        assessment — it starts with your space rather than our catalogue.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <PrimaryLink href="/assess">Start your Space Assessment</PrimaryLink>
        <GhostLink href="/solutions">Browse solutions</GhostLink>
      </div>
    </div>
  );
}
