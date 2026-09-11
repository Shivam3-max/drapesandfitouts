import Link from "next/link";

/**
 * Flow chrome: nothing but the name and a way out.
 * Forms get the whole screen so one question can hold it.
 */
export default function FlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="-my-1 py-2 font-display text-[20px] leading-none tracking-tight text-ink">
            Drapes <span className="italic text-brass">&amp;</span> Fitouts
          </Link>
          <Link
            href="/"
            className="rounded-full border border-line bg-white/70 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3 transition-colors hover:border-ink hover:text-ink"
          >
            Close
          </Link>
        </div>
      </header>
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
