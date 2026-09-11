import { getSolution, type PriceBasis } from "./catalogue";

/**
 * The estimator is deliberately separate from the recommendation engine.
 * Prices change constantly; product rules do not. Nothing here selects a product.
 *
 * Customer-facing output is ALWAYS a range, and never a firm figure, until a
 * surveyor has recorded verified measurements.
 */

export interface Estimate {
  /** Low end of the typical band shown to the customer. */
  low: number;
  /** High end of the typical band shown to the customer. */
  high: number;
  /** Absolute floor and ceiling if every single choice went the same way. */
  absoluteLow: number;
  absoluteHigh: number;
  currency: "AED";
  /** True when we had real dimensions to work with rather than typical ones. */
  fromCustomerDimensions: boolean;
  /** Categories we deliberately refuse to price before a survey. */
  surveyOnly: string[];
  lines: EstimateLine[];
}

export interface EstimateLine {
  slug: string;
  name: string;
  basis: PriceBasis;
  quantity: number;
  unit: string;
  low: number;
  high: number;
}

export interface Dimensions {
  /** Glass area in m², if the customer gave width and drop. */
  area?: number;
  /** Opening width in m. */
  width?: number;
  openings: number;
}

/** Typical UAE opening when the customer has not measured anything. */
const TYPICAL_AREA = 4.5;
const TYPICAL_WIDTH = 2.6;

/** Motor cost per motorised opening, AED. */
const MOTOR = { low: 900, high: 2400 };

/** Families we will not put a customer-facing number against before a survey. */
const SURVEY_ONLY: Record<string, string> = {
  "skylight-blind":
    "Skylight and roof glazing is measured on site before any figure is given — geometry, access and power routing move the cost too much to estimate honestly.",
  "smart-film":
    "Smart Film is quoted only after we verify the glass and the power route. An estimate before that would be a guess with your money attached.",
};

export function estimateForSelection(
  items: { slug: string; motorised: boolean }[],
  dims: Dimensions,
): Estimate | null {
  const lines: EstimateLine[] = [];
  const surveyOnly: string[] = [];
  const openings = Math.max(1, dims.openings || 1);

  // The customer measures the opening that bothers them, not the average one.
  // Treating every other opening as that size inflates a villa quote absurdly,
  // so the remaining openings are costed at a typical size for the room type.
  const mainArea = dims.area ?? TYPICAL_AREA;
  const otherArea = Math.min(mainArea, TYPICAL_AREA);
  const totalArea = mainArea + (openings - 1) * otherArea;

  const mainWidth = dims.width ?? TYPICAL_WIDTH;
  const otherWidth = Math.min(mainWidth, TYPICAL_WIDTH);
  const totalWidth = mainWidth + (openings - 1) * otherWidth;

  for (const item of items) {
    const solution = getSolution(item.slug);
    if (!solution) continue;

    if (SURVEY_ONLY[item.slug]) {
      surveyOnly.push(SURVEY_ONLY[item.slug]);
      continue;
    }

    const { basis, low, high } = solution.price;
    let quantity = 1;
    let unit = "";

    switch (basis) {
      case "per_sqm":
        quantity = round1(totalArea);
        unit = "m²";
        break;
      case "per_running_m":
        quantity = round1(totalWidth);
        unit = "running m";
        break;
      case "per_opening":
        quantity = openings;
        unit = openings === 1 ? "opening" : "openings";
        break;
      case "per_panel":
        quantity = openings;
        unit = "panels";
        break;
    }

    lines.push({
      slug: solution.slug,
      name: solution.name,
      basis,
      quantity,
      unit,
      low: Math.round(low * quantity),
      high: Math.round(high * quantity),
    });

    if (item.motorised && solution.rungs.includes("motorized") && solution.slug !== "motorisation") {
      lines.push({
        slug: `${solution.slug}:motor`,
        name: `${solution.name} — motorisation`,
        basis: "per_opening",
        quantity: openings,
        unit: openings === 1 ? "opening" : "openings",
        low: MOTOR.low * openings,
        high: MOTOR.high * openings,
      });
    }
  }

  if (!lines.length && !surveyOnly.length) return null;

  const absoluteLow = lines.reduce((n, l) => n + l.low, 0);
  const absoluteHigh = lines.reduce((n, l) => n + l.high, 0);
  const band = typicalBand(lines, absoluteLow, absoluteHigh);

  return {
    low: roundTo(band.low, 100),
    high: roundTo(band.high, 100),
    absoluteLow: roundTo(absoluteLow, 100),
    absoluteHigh: roundTo(absoluteHigh, 100),
    currency: "AED",
    fromCustomerDimensions: Boolean(dims.area || dims.width),
    surveyOnly,
    lines,
  };
}

export function formatAed(n: number): string {
  return new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(n);
}

export function formatRange(e: Estimate | null): string {
  if (!e || (!e.low && !e.high)) return "Survey required";
  return `AED ${formatAed(e.low)} – ${formatAed(e.high)}`;
}

/**
 * Summing every line's worst case against every line's best case produces a
 * range so wide it tells the customer nothing. Fabric and hardware choices
 * vary independently, so the practical band is narrower than the naive sum.
 * We treat each line as uniform between its low and high and report the
 * central ~80% of the resulting distribution, clamped to the absolute bounds.
 */
function typicalBand(lines: EstimateLine[], absLow: number, absHigh: number) {
  if (lines.length < 2) return { low: absLow, high: absHigh };
  const mean = lines.reduce((n, l) => n + (l.low + l.high) / 2, 0);
  const variance = lines.reduce((n, l) => n + Math.pow(l.high - l.low, 2) / 12, 0);
  const sd = Math.sqrt(variance);
  return {
    low: Math.max(absLow, mean - 1.28 * sd),
    high: Math.min(absHigh, mean + 1.28 * sd),
  };
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function roundTo(n: number, step: number) {
  return Math.round(n / step) * step;
}
