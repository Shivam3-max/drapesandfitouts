import Image from "next/image";

/**
 * Every image on the site goes through <Frame>.
 *
 * Until the photography lands it renders a labelled placeholder that is part of
 * the design rather than a grey box. When a real photograph arrives, pass `src`
 * and nothing else changes — same crop, same ratio, same caption.
 */

export type Ratio = "1/1" | "4/5" | "3/4" | "4/3" | "3/2" | "16/9" | "21/9" | "2/3" | "9/16";

const RATIO_CLASS: Record<Ratio, string> = {
  "1/1": "aspect-square",
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-video",
  "21/9": "aspect-[21/9]",
  "2/3": "aspect-[2/3]",
  "9/16": "aspect-[9/16]",
};

/** Six quiet washes so a collage never looks like one repeated grey box. */
const WASHES = [
  "linear-gradient(155deg,#f0ebe1 0%,#e0d8c8 48%,#cdc2ad 100%)",
  "linear-gradient(155deg,#eaeeef 0%,#d7dee0 48%,#c1cbcf 100%)",
  "linear-gradient(155deg,#f2ece2 0%,#e4dbcb 45%,#d0c5b0 100%)",
  "linear-gradient(155deg,#e9edee 0%,#dae0e2 50%,#c6d0d4 100%)",
  "linear-gradient(155deg,#f3eee5 0%,#e7dfd2 50%,#d6cbb8 100%)",
  "linear-gradient(155deg,#eeecE8 0%,#dedbd3 50%,#c9c5ba 100%)",
];

function washFor(seed: string) {
  let n = 0;
  for (let i = 0; i < seed.length; i++) n = (n + seed.charCodeAt(i) * (i + 3)) % 997;
  return WASHES[n % WASHES.length];
}

export function Frame({
  label,
  ratio = "4/5",
  src,
  alt,
  caption,
  tag,
  className = "",
  priority = false,
  rounded = true,
}: {
  /** Shot direction: what this image should show. Doubles as the placeholder text. */
  label: string;
  ratio?: Ratio;
  src?: string;
  alt?: string;
  caption?: string;
  tag?: string;
  className?: string;
  priority?: boolean;
  rounded?: boolean;
}) {
  return (
    <figure className={`group relative ${className}`}>
      <div
        className={`relative w-full overflow-hidden ${RATIO_CLASS[ratio]} ${rounded ? "rounded-[3px]" : ""}`}
        style={src ? undefined : { background: washFor(label) }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt ?? label}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <>
            {/* a drawn suggestion of a window, so the placeholder still composes */}
            <div className="absolute inset-[14%] border border-white/70" aria-hidden="true">
              <div className="grid h-full grid-cols-3">
                <span className="border-r border-white/55" />
                <span className="border-r border-white/55" />
                <span />
              </div>
            </div>
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(120% 80% at 78% 10%, rgba(255,255,255,.72), transparent 56%), linear-gradient(0deg, rgba(16,18,20,.10), transparent 42%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
              <span className="max-w-[68%] font-mono text-[10px] uppercase leading-tight tracking-[0.14em] text-ink/70">
                {label}
              </span>
              <span className="shrink-0 rounded-full border border-ink/12 bg-white/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/45">
                {tag ?? "Image"}
              </span>
            </div>
          </>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
