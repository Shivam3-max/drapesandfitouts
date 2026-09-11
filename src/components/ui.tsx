import Link from "next/link";
import type { ReactNode } from "react";

export function Section({
  children,
  className = "",
  tone = "stone",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "stone" | "paper" | "shell" | "ink";
  id?: string;
}) {
  const tones = {
    stone: "",
    paper: "",
    shell: "",
    ink: "text-white",
  };
  return (
    <section id={id} className={`relative ${tones[tone]} ${className}`}>
      <div
        className={`mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-20 ${
          tone === "ink" ? "my-8 rounded-[4px] bg-ink px-8 py-16 sm:px-12" : ""
        }`}
      >
        {children}
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  invert?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-[62ch] text-center" : "max-w-[62ch]"}>
      {eyebrow && <p className={`eyebrow ${invert ? "text-brass-light" : ""}`}>{eyebrow}</p>}
      <h2
        className={`display-md mt-4 text-[clamp(28px,3.8vw,48px)] ${invert ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {lead && (
        <p className={`mt-5 text-[16px] leading-relaxed ${invert ? "text-white/70" : "text-ink-2"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

export function PrimaryLink({
  href,
  children,
  invert = false,
}: {
  href: string;
  children: ReactNode;
  invert?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`btn ${invert ? "btn-light" : "btn-solid"}`}
    >
      {children}
    </Link>
  );
}

export function GhostLink({
  href,
  children,
  invert = false,
}: {
  href: string;
  children: ReactNode;
  invert?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`btn ${invert ? "border border-white/40 text-white hover:border-white" : "btn-ghost"}`}
    >
      {children}
    </Link>
  );
}

export function Pill({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "brass" | "good" | "warn" }) {
  const tones = {
    default: "border-line text-ink-3",
    brass: "border-brass text-brass",
    good: "border-good text-good",
    warn: "border-warn text-warn",
  };
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function ScoreBar({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description?: string;
}) {
  const tone =
    value >= 8 ? "bg-crit" : value >= 6 ? "bg-warn" : value >= 4 ? "bg-brass" : "bg-ink-3";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-semibold text-ink">{label}</span>
        <span className="tnum font-mono text-[13px] text-ink-2">{value}/10</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${value * 10}%` }} />
      </div>
      {description && <p className="mt-2 text-[13.5px] leading-snug text-ink-3">{description}</p>}
    </div>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-t border-line pt-4">
      <p className="tnum font-display text-[38px] leading-none">{value}</p>
      <p className="mt-2 font-mono text-[12px] leading-snug text-ink-3">{label}</p>
    </div>
  );
}

export function Note({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="glass rounded-[4px] border-l-2 border-l-brass px-6 py-5">
      {title && <p className="eyebrow text-brass">{title}</p>}
      <div className={`text-[15.5px] leading-relaxed text-ink-2 ${title ? "mt-2" : ""}`}>{children}</div>
    </div>
  );
}

export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && <span className="px-2 text-rule">/</span>}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-brass">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-2">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
