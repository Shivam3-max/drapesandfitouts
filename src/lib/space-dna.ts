import {
  BudgetBandId,
  ContextId,
  GlazingId,
  OrientationId,
  ORIENTATIONS,
  ProblemId,
  PropertyStatusId,
  RoomId,
  ScoreId,
  Tier,
} from "./taxonomy";
import { estimateForSelection, type Estimate } from "./pricing";

export const RULESET_VERSION = "2026.09.1";

export interface AssessmentInput {
  context: ContextId;
  problems: ProblemId[];
  room?: RoomId;
  openings: number;
  widthM?: number;
  dropM?: number;
  ceilingHeightM?: number;
  orientation: OrientationId;
  glazing: GlazingId;
  community?: string;
  status?: PropertyStatusId;
  budget?: BudgetBandId;
  mediaCount: number;
  timeframe?: string;
  existingMotorisation?: boolean;
}

export type Scores = Record<ScoreId, number>;

export interface RecommendedItem {
  slug: string;
  role: string;
  reason: string;
  motorised: boolean;
}

export interface TierRecommendation {
  tier: Tier;
  items: RecommendedItem[];
  benefit: string;
  assumptions: string[];
  estimate: Estimate | null;
}

export interface FiredRule {
  id: string;
  explanation: string;
}

export interface SpaceDna {
  scores: Scores;
  confidence: "low" | "medium" | "high";
  confidenceNote: string;
  headline: string;
  summary: string;
  drivers: { score: ScoreId; reason: string }[];
  tiers: TierRecommendation[];
  verify: string[];
  firedRules: FiredRule[];
  filmEligible: boolean;
  filmNote: string;
  rulesetVersion: string;
  generatedAt: string;
}

const clamp = (n: number) => Math.max(0, Math.min(10, Math.round(n)));

// Written out explicitly rather than generated: these weights are product knowledge,
// not code, and they are reviewed by the Drapes product expert.
const ROOM_WEIGHTS: Record<
  RoomId,
  { blackout: number; privacy: number; completion: number; acoustic: number }
> = {
  living: { blackout: 2, privacy: 5, completion: 6, acoustic: 4 },
  majlis: { blackout: 3, privacy: 6, completion: 7, acoustic: 5 },
  bedroom: { blackout: 8, privacy: 7, completion: 5, acoustic: 4 },
  media: { blackout: 9, privacy: 5, completion: 6, acoustic: 8 },
  dining: { blackout: 2, privacy: 5, completion: 5, acoustic: 4 },
  kitchen: { blackout: 1, privacy: 4, completion: 2, acoustic: 2 },
  bathroom: { blackout: 3, privacy: 9, completion: 3, acoustic: 1 },
  study: { blackout: 3, privacy: 5, completion: 4, acoustic: 5 },
  prayer: { blackout: 3, privacy: 7, completion: 8, acoustic: 5 },
  stairwell: { blackout: 1, privacy: 4, completion: 4, acoustic: 5 },
  balcony: { blackout: 1, privacy: 5, completion: 3, acoustic: 1 },
  "open-office": { blackout: 1, privacy: 4, completion: 5, acoustic: 7 },
  boardroom: { blackout: 4, privacy: 9, completion: 6, acoustic: 8 },
  meeting: { blackout: 3, privacy: 8, completion: 5, acoustic: 7 },
  reception: { blackout: 1, privacy: 5, completion: 7, acoustic: 6 },
  consultation: { blackout: 2, privacy: 10, completion: 4, acoustic: 6 },
  ward: { blackout: 4, privacy: 9, completion: 4, acoustic: 6 },
  "guest-room": { blackout: 9, privacy: 7, completion: 6, acoustic: 6 },
  corridor: { blackout: 1, privacy: 3, completion: 5, acoustic: 7 },
  showroom: { blackout: 1, privacy: 4, completion: 5, acoustic: 4 },
};

const CONTEXT_PRIVACY_FLOOR: Record<ContextId, number> = {
  home: 0,
  office: 5,
  hotel: 4,
  clinic: 7,
  retail: 3,
  architect: 0,
  developer: 0,
};

const FILM_ROOMS: RoomId[] = [
  "boardroom",
  "meeting",
  "consultation",
  "reception",
  "bathroom",
  "stairwell",
  "ward",
  "showroom",
  "study",
];

export function runSpaceDna(input: AssessmentInput): SpaceDna {
  const fired: FiredRule[] = [];
  const verify = new Set<string>();
  const drivers: { score: ScoreId; reason: string }[] = [];

  const orientation = ORIENTATIONS.find((o) => o.id === input.orientation) ?? ORIENTATIONS[8];
  const room = input.room ? ROOM_WEIGHTS[input.room] : undefined;
  const glassArea = (input.widthM ?? 0) * (input.dropM ?? 0);
  const bigGlass = glassArea >= 6 || (input.widthM ?? 0) >= 4;
  const tallGlass = (input.ceilingHeightM ?? 0) > 3.2 || (input.dropM ?? 0) > 3;

  // ---- 1. base scores, derived from the space itself ----
  const scores: Scores = {
    solar: orientation.solarLoad,
    glare: Math.max(1, orientation.solarLoad - 1),
    privacy: room?.privacy ?? 4,
    blackout: room?.blackout ?? 3,
    automation: 2,
    completion: room?.completion ?? 4,
  };

  fired.push({
    id: "base.orientation",
    explanation: `${orientation.label} glazing — ${orientation.note.toLowerCase()}.`,
  });
  if (orientation.solarLoad >= 8) {
    drivers.push({
      score: "solar",
      reason: `${orientation.label} glazing carries the heaviest solar load in the UAE.`,
    });
  }

  // ---- 2. context floors ----
  const floor = CONTEXT_PRIVACY_FLOOR[input.context];
  if (floor > scores.privacy) {
    scores.privacy = floor;
    fired.push({
      id: "context.privacy-floor",
      explanation: `A ${input.context} space carries a minimum privacy requirement regardless of the room.`,
    });
  }

  // ---- 3. the customer's own priorities always outrank a derived score ----
  const has = (p: ProblemId) => input.problems.includes(p);
  if (has("heat")) {
    scores.solar = Math.max(scores.solar, 8) + 1;
    drivers.push({ score: "solar", reason: "You told us heat is the problem — that outranks anything we infer." });
    fired.push({ id: "problem.heat", explanation: "Stated heat problem raises solar control to the primary need." });
  }
  if (has("glare")) {
    scores.glare = Math.max(scores.glare, 8) + 1;
    fired.push({ id: "problem.glare", explanation: "Stated glare problem prioritises a light-filtering layer over a decorative one." });
  }
  if (has("blackout")) {
    scores.blackout = Math.max(scores.blackout, 8) + 1;
    drivers.push({ score: "blackout", reason: "You asked for darkness, so a blackout layer is mandatory, not optional." });
    fired.push({ id: "problem.blackout", explanation: "Stated blackout requirement makes an opaque layer mandatory." });
    verify.add("Whether side channels or a sealed cassette can be fitted — true blackout depends on the edges, not the fabric");
  }
  if (has("privacy")) {
    scores.privacy = Math.max(scores.privacy, 8) + 1;
    fired.push({ id: "problem.privacy", explanation: "Stated privacy requirement drives the primary layer selection." });
  }
  if (has("large-glazing")) {
    scores.automation += 2;
    scores.solar += 1;
    fired.push({ id: "problem.large-glazing", explanation: "Large glazing increases both solar load and the case for motorisation." });
  }
  if (has("automation")) {
    scores.automation = Math.max(scores.automation, 8) + 1;
    fired.push({ id: "problem.automation", explanation: "Stated automation need places motorised control in every tier above Essential." });
  }
  if (has("acoustics")) {
    scores.completion += 3;
    fired.push({ id: "problem.acoustics", explanation: "Acoustic complaints are usually a soft-surface problem: fabric at the window and carpet on the floor." });
  }
  if (has("unfinished")) {
    scores.completion = Math.max(scores.completion, 7);
    fired.push({ id: "problem.unfinished", explanation: "Room completion added to the Signature and Intelligent tiers." });
  }
  if (has("transformation")) {
    scores.completion = Math.max(scores.completion, 8);
    fired.push({ id: "problem.transformation", explanation: "Whole-room brief — window, floor and wall treated as one specification." });
  }

  // ---- 4. geometry rules ----
  if (bigGlass) {
    scores.solar += 1;
    scores.automation += 2;
    fired.push({
      id: "geometry.large-glass",
      explanation: `Around ${glassArea ? glassArea.toFixed(1) + " m²" : "a large area"} of glass — heavier fabric weight and a stronger case for motorised operation.`,
    });
    verify.add("Coupling strategy and fixing for wide runs");
  }
  if (tallGlass) {
    scores.automation += 3;
    fired.push({
      id: "geometry.height",
      explanation: "Glass above comfortable reach. Manual operation is a daily usability problem, not a preference.",
    });
    drivers.push({ score: "automation", reason: "The glass is taller than anyone wants to operate by hand twice a day." });
    verify.add("Ceiling fixing, track height and the exact drop to finished floor level");
  }
  if (input.openings >= 8) {
    scores.automation += 3;
    fired.push({
      id: "geometry.openings",
      explanation: `${input.openings} openings. Above roughly eight, opening and closing by hand becomes the actual problem.`,
    });
  } else if (input.openings >= 4) {
    scores.automation += 1;
    fired.push({ id: "geometry.openings-mid", explanation: `${input.openings} openings — motorisation is worth pricing as an upgrade.` });
  }

  // ---- 5. glazing and film eligibility ----
  let filmEligible = false;
  let filmNote = "";
  const filmRoom = input.room ? FILM_ROOMS.includes(input.room) : false;
  const filmContext = ["office", "clinic", "retail", "hotel", "developer", "architect"].includes(input.context);

  if (scores.privacy >= 6 && (filmRoom || filmContext)) {
    filmEligible = true;
    filmNote =
      "Smart Film is a candidate here, subject to glass verification on site. It gives privacy on demand without a blind, but it does not control heat.";
    fired.push({
      id: "film.candidate",
      explanation: "Privacy requirement and space type make Smart Film a legitimate candidate — eligibility confirmed only after glass verification.",
    });
    verify.add("Glass type, thickness and lamination for Smart Film suitability");
    verify.add("Achievable power route to the glass edge for Smart Film switching");
  } else if (scores.privacy >= 6) {
    filmNote =
      "We have not recommended Smart Film here. It suits glass partitions and internal glazing far better than a conventional window, and a layered window treatment will serve this space better.";
  }

  if (input.glazing === "single" && scores.solar >= 7) {
    fired.push({
      id: "glazing.single",
      explanation: "Single glazing with a high solar load — solar-control fabric does more work here than it would on double glazing.",
    });
    scores.solar += 1;
  }
  if (input.glazing === "curtain-wall") {
    scores.automation += 1;
    fired.push({ id: "glazing.curtain-wall", explanation: "Structural glazing — fixing is into the frame or slab and must be surveyed before quoting." });
    verify.add("Fixing detail into curtain-wall framing or slab");
  }
  if (input.glazing === "unknown") {
    verify.add("Glazing type — recorded on the site visit");
  }

  // ---- 6. status and intent ----
  if (input.status === "handover" || input.status === "under-construction") {
    fired.push({
      id: "status.early",
      explanation: "Early enough to change the track detail, the pelmet and the power routing — the three things that cannot be fixed later cheaply.",
    });
  }
  if (input.status === "occupied") {
    verify.add("Access, working hours and protection of finished surfaces during installation");
  }
  if (input.existingMotorisation) {
    verify.add("Existing motor make, model and whether it can genuinely be reused — never assumed");
    fired.push({ id: "existing.motor", explanation: "Existing motorisation present — compatibility checked before anything is specified." });
  }

  // ---- 7. budget shading ----
  if (input.budget === "premium") {
    scores.completion += 1;
    fired.push({ id: "budget.premium", explanation: "Premium band — higher fabric tiers and full automation shown as the default." });
  }
  if (input.budget === "entry" && has("automation")) {
    fired.push({
      id: "budget.entry-automation",
      explanation: "You asked for automation on an efficient budget. We show it honestly as a named upgrade rather than quietly dropping it.",
    });
  }

  // normalise
  (Object.keys(scores) as ScoreId[]).forEach((k) => (scores[k] = clamp(scores[k])));

  // ---- 8. confidence ----
  let confidencePoints = 0;
  if (input.orientation !== "unknown") confidencePoints += 2;
  if (input.widthM && input.dropM) confidencePoints += 2;
  if (input.mediaCount > 0) confidencePoints += 2;
  if (input.room) confidencePoints += 1;
  if (input.glazing !== "unknown") confidencePoints += 1;
  const confidence = confidencePoints >= 6 ? "high" : confidencePoints >= 3 ? "medium" : "low";
  const confidenceNote =
    confidence === "high"
      ? "Enough detail for a firm direction. Final specification still follows the site survey."
      : confidence === "medium"
        ? "A sound direction, with some assumptions. A photo and the facing direction would sharpen it."
        : "A starting direction only. We have filled several gaps with conservative assumptions.";

  // ---- 9. assemble the three tiers ----
  const tiers = buildTiers(input, scores, filmEligible, glassArea);

  // ---- 10. narrative ----
  const primary = dominantNeed(scores);
  const headline = HEADLINES[primary];
  const summary = buildSummary(input, scores, orientation.label, primary);

  verify.add("Verified room-by-room measurements — nothing is manufactured from an estimate");

  return {
    scores,
    confidence,
    confidenceNote,
    headline,
    summary,
    drivers: drivers.slice(0, 3),
    tiers,
    verify: Array.from(verify),
    firedRules: fired,
    filmEligible,
    filmNote,
    rulesetVersion: RULESET_VERSION,
    generatedAt: new Date().toISOString(),
  };
}

type PrimaryNeed = "solar" | "blackout" | "privacy" | "completion" | "automation";

const HEADLINES: Record<PrimaryNeed, string> = {
  solar: "This is a heat and glare problem before it is a curtain problem.",
  blackout: "This room needs darkness engineered at the edges, not just opaque fabric.",
  privacy: "This is a privacy problem, and the right answer depends on the glass.",
  completion: "The window is only part of what this room is missing.",
  automation: "With this much glass, the real product is not the fabric — it's the control.",
};

function dominantNeed(s: Scores): PrimaryNeed {
  const ranked: [PrimaryNeed, number][] = [
    ["solar", Math.max(s.solar, s.glare)],
    ["blackout", s.blackout],
    ["privacy", s.privacy],
    ["automation", s.automation - 1],
    ["completion", s.completion - 2],
  ];
  ranked.sort((a, b) => b[1] - a[1]);
  return ranked[0][0];
}

function buildSummary(input: AssessmentInput, s: Scores, orientationLabel: string, primary: PrimaryNeed): string {
  const parts: string[] = [];
  parts.push(
    `${orientationLabel === "I'm not sure" ? "Unconfirmed orientation" : orientationLabel + "-facing glazing"} with ${input.openings} opening${input.openings === 1 ? "" : "s"}.`,
  );
  if (primary === "solar") {
    parts.push(
      "The first layer has to be solar control — a mesh that cuts the energy and the glare while you keep the view. Anything decorative goes on top of that, not instead of it.",
    );
  } else if (primary === "blackout") {
    parts.push(
      "The fabric is the easy part. Real darkness comes from how the edges are treated, which is why we specify the seal before we specify the cloth.",
    );
  } else if (primary === "privacy") {
    parts.push(
      "Privacy has two different answers depending on whether this is a window or a glass partition, and they are not interchangeable.",
    );
  } else if (primary === "automation") {
    parts.push(
      "At this scale the daily experience is dominated by operation, not appearance. We would motorise first and choose fabric second.",
    );
  } else {
    parts.push(
      "The window treatment alone will not finish this room. Floor and wall surfaces are doing as much work here as the glass.",
    );
  }
  if (s.privacy >= 7 && primary !== "privacy") {
    parts.push("There is also a genuine privacy requirement that a single layer will not meet after dark.");
  }
  return parts.join(" ");
}

function buildTiers(
  input: AssessmentInput,
  s: Scores,
  filmEligible: boolean,
  glassArea: number,
): TierRecommendation[] {
  const solarPeak = Math.max(s.solar, s.glare);
  const solarLed = solarPeak >= 6;
  const blackoutLed = s.blackout >= 6;
  const privacyLed = s.privacy >= 7;
  const motorise = s.automation >= 6;
  const completion = s.completion >= 6;
  const commercial = ["office", "clinic", "retail", "hotel"].includes(input.context);

  // ---------- Essential ----------
  const essential: RecommendedItem[] = [];
  // The strictest need takes the single Essential layer. A stated blackout
  // requirement outranks a merely warm elevation — getting this order wrong
  // sends a bedroom a sunscreen blind, which is the wrong product entirely.
  if (blackoutLed && s.blackout >= solarPeak) {
    essential.push({
      slug: "blackout-roller",
      role: "Primary layer",
      reason: "The lightest intervention that actually delivers darkness in this room.",
      motorised: false,
    });
  } else if (solarLed) {
    essential.push({
      slug: "sunscreen-roller",
      role: "Primary layer",
      reason: "Cuts solar gain and glare at the glass while keeping the view — the correct first move on this elevation.",
      motorised: false,
    });
  } else if (blackoutLed) {
    essential.push({
      slug: "blackout-roller",
      role: "Primary layer",
      reason: "Darkness is the stated requirement, so the opaque layer comes first.",
      motorised: false,
    });
  } else if (privacyLed && commercial) {
    essential.push({
      slug: "blackout-roller",
      role: "Primary layer",
      reason: "A straightforward opaque layer where privacy matters and switchable glass is not justified.",
      motorised: false,
    });
  } else {
    essential.push({
      slug: "zebra-blind",
      role: "Primary layer",
      reason: "One product covering both filtered daylight and daytime privacy.",
      motorised: false,
    });
  }

  // ---------- Signature ----------
  const signature: RecommendedItem[] = [];
  if (solarLed) {
    signature.push({
      slug: "sunscreen-roller",
      role: "Day layer",
      reason: "Handles heat and glare during the day without closing the room off.",
      motorised: motorise,
    });
  }
  if (blackoutLed) {
    signature.push({
      slug: commercial ? "blackout-roller" : "wave-curtain",
      role: "Night layer",
      reason: commercial
        ? "An opaque layer for darkness and after-hours privacy."
        : "A lined wave curtain for darkness, softness and the acoustic improvement the room also needs.",
      motorised: motorise,
    });
  } else if (!commercial) {
    signature.push({
      slug: "wave-curtain",
      role: "Evening layer",
      reason: "Evening privacy and the visual weight that makes a room read as finished.",
      motorised: motorise,
    });
  } else {
    signature.push({
      slug: "roman-blind",
      role: "Softening layer",
      reason: "Fabric at the window to soften a hard-surfaced commercial space.",
      motorised: false,
    });
  }
  if (!commercial && s.privacy >= 5 && !signature.some((i) => i.slug === "sheer-curtain")) {
    signature.push({
      slug: "sheer-curtain",
      role: "Daytime privacy layer",
      reason: "Daytime privacy without losing the light — the inner track of a double-layer system.",
      motorised: false,
    });
  }

  // ---------- Intelligent ----------
  const intelligent: RecommendedItem[] = signature.map((i) => ({ ...i, motorised: true }));
  if (filmEligible) {
    intelligent.push({
      slug: "smart-film",
      role: "Switchable privacy",
      reason: "Privacy on demand on the glass itself, with no blind to draw and no floor space lost. Subject to glass verification.",
      motorised: false,
    });
  }
  intelligent.push({
    slug: "motorisation",
    role: "Control & scenes",
    reason:
      input.openings >= 8
        ? `${input.openings} openings moved by one command, with morning, work, evening and away scenes commissioned on site.`
        : "Scene control so the layers move together rather than one window at a time.",
    motorised: true,
  });
  if (completion) {
    intelligent.push({
      slug: commercial ? "carpet-tile" : "broadloom-carpet",
      role: "Room completion",
      reason: "The floor is the last untreated acoustic surface in the room, and the one that changes how it feels most.",
      motorised: false,
    });
  }

  const dedupe = (items: RecommendedItem[]) => {
    const seen = new Set<string>();
    return items.filter((i) => (seen.has(i.slug) ? false : (seen.add(i.slug), true)));
  };

  const area = glassArea > 0 ? glassArea : undefined;
  const width = input.widthM;

  return [
    {
      tier: "essential",
      items: dedupe(essential),
      benefit: "Solves the stated problem properly, with nothing specified that the room does not need.",
      assumptions: assumptionsFor(input),
      estimate: estimateForSelection(dedupe(essential), { area, width, openings: input.openings }),
    },
    {
      tier: "signature",
      items: dedupe(signature),
      benefit: motorise
        ? "Layered day and evening control, motorised so the room is actually used the way it was designed."
        : "Layered day and evening control, with the material quality that makes the room feel considered.",
      assumptions: assumptionsFor(input),
      estimate: estimateForSelection(dedupe(signature), { area, width, openings: input.openings }),
    },
    {
      tier: "intelligent",
      items: dedupe(intelligent),
      benefit: "The space responds on its own — scenes, switchable privacy where the glass allows it, and a finished room.",
      assumptions: assumptionsFor(input),
      estimate: estimateForSelection(dedupe(intelligent), { area, width, openings: input.openings }),
    },
  ];
}

function assumptionsFor(input: AssessmentInput): string[] {
  const a: string[] = [];
  if (!input.widthM || !input.dropM) {
    a.push("Sizes assumed from a typical opening for this room type — no measurement has been taken.");
  } else {
    a.push(
      `Based on your estimate of ${input.widthM} m × ${input.dropM} m for the main opening. The other ${Math.max(0, input.openings - 1)} opening${input.openings === 2 ? "" : "s"} are costed at a typical size until we measure them.`,
    );
  }
  if (input.orientation === "unknown") {
    a.push("Facing direction unconfirmed — we have assumed a moderate solar load.");
  }
  if (input.glazing === "unknown") {
    a.push("Glazing type unconfirmed.");
  }
  a.push("Prices are indicative ranges for supply and installation, excluding electrical works.");
  return a;
}
