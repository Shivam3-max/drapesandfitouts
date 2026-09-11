/**
 * Shared vocabulary for the whole platform.
 * The assessment, the rule engine, the catalogue and the admin all speak this.
 * Changing an id here is a breaking change — add, don't rename.
 */

export type ContextId =
  | "home"
  | "office"
  | "hotel"
  | "clinic"
  | "retail"
  | "architect"
  | "developer";

export type ProblemId =
  | "heat"
  | "glare"
  | "blackout"
  | "privacy"
  | "large-glazing"
  | "automation"
  | "acoustics"
  | "unfinished"
  | "transformation";

export type RoomId =
  | "living"
  | "bedroom"
  | "media"
  | "majlis"
  | "dining"
  | "kitchen"
  | "bathroom"
  | "study"
  | "prayer"
  | "stairwell"
  | "balcony"
  | "open-office"
  | "boardroom"
  | "meeting"
  | "reception"
  | "consultation"
  | "ward"
  | "guest-room"
  | "corridor"
  | "showroom";

export type OrientationId = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw" | "unknown";

export type GlazingId = "single" | "double" | "laminated" | "tinted" | "curtain-wall" | "unknown";

export type PropertyStatusId = "handover" | "renovation" | "occupied" | "under-construction";

export type BudgetBandId = "entry" | "mid" | "premium" | "unspecified";

export type ScoreId =
  | "solar"
  | "glare"
  | "privacy"
  | "blackout"
  | "automation"
  | "completion";

export type Group = "light" | "privacy" | "softness" | "surface" | "intelligence";

export type Rung = "manual" | "motorized" | "automated" | "intelligent";

export type Tier = "essential" | "signature" | "intelligent";

export interface Option<T extends string> {
  id: T;
  label: string;
  note?: string;
}

export const CONTEXTS: Option<ContextId>[] = [
  { id: "home", label: "My home", note: "Villa, townhouse or apartment" },
  { id: "office", label: "An office", note: "Workplace, boardroom or co-working floor" },
  { id: "hotel", label: "A hotel", note: "Guest rooms, suites, public areas" },
  { id: "clinic", label: "A clinic", note: "Consultation, treatment, reception" },
  { id: "retail", label: "A retail space", note: "Frontage, display, fitting areas" },
  { id: "architect", label: "I'm an architect or designer", note: "Specifying for a client project" },
  { id: "developer", label: "I'm a developer or fit-out firm", note: "Multiple units or a whole building" },
];

export const PROBLEMS: Option<ProblemId>[] = [
  { id: "heat", label: "Too much heat", note: "The room is hard to cool in the afternoon" },
  { id: "glare", label: "Too much glare", note: "Screens wash out, the light is harsh" },
  { id: "blackout", label: "It never gets dark enough", note: "Bedrooms, media rooms, shift sleepers" },
  { id: "privacy", label: "People can see in", note: "Overlooked windows, exposed glass" },
  { id: "large-glazing", label: "A large glass area", note: "Floor-to-ceiling, curtain wall, sliding doors" },
  { id: "automation", label: "Opening and closing is a chore", note: "Too many windows, out-of-reach glass" },
  { id: "acoustics", label: "The room echoes", note: "Hard floors, glass walls, open plan" },
  { id: "unfinished", label: "The room feels unfinished", note: "Bare windows, bare floor, bare walls" },
  { id: "transformation", label: "A complete transformation", note: "Start from the space, not the product" },
];

export const ROOMS: { id: RoomId; label: string; contexts: ContextId[] }[] = [
  { id: "living", label: "Living room", contexts: ["home"] },
  { id: "majlis", label: "Majlis", contexts: ["home"] },
  { id: "bedroom", label: "Bedroom", contexts: ["home", "hotel"] },
  { id: "media", label: "Media room", contexts: ["home", "hotel"] },
  { id: "dining", label: "Dining room", contexts: ["home", "hotel"] },
  { id: "kitchen", label: "Kitchen", contexts: ["home"] },
  { id: "bathroom", label: "Bathroom", contexts: ["home", "hotel"] },
  { id: "study", label: "Study or home office", contexts: ["home"] },
  { id: "prayer", label: "Prayer room", contexts: ["home", "office", "hotel"] },
  { id: "stairwell", label: "Stairwell or double-height glazing", contexts: ["home", "office", "hotel"] },
  { id: "balcony", label: "Balcony or terrace", contexts: ["home", "hotel", "retail"] },
  { id: "open-office", label: "Open-plan floor", contexts: ["office"] },
  { id: "boardroom", label: "Boardroom", contexts: ["office", "hotel"] },
  { id: "meeting", label: "Meeting room", contexts: ["office", "clinic", "hotel"] },
  { id: "reception", label: "Reception", contexts: ["office", "clinic", "hotel", "retail"] },
  { id: "consultation", label: "Consultation room", contexts: ["clinic"] },
  { id: "ward", label: "Treatment or recovery area", contexts: ["clinic"] },
  { id: "guest-room", label: "Guest room", contexts: ["hotel"] },
  { id: "corridor", label: "Corridor or circulation", contexts: ["hotel", "office", "clinic"] },
  { id: "showroom", label: "Showroom or frontage", contexts: ["retail"] },
];

export const ORIENTATIONS: { id: OrientationId; label: string; solarLoad: number; note: string }[] = [
  { id: "n", label: "North", solarLoad: 2, note: "Soft indirect light for most of the year" },
  { id: "ne", label: "North-east", solarLoad: 4, note: "Early sun, comfortable afternoons" },
  { id: "e", label: "East", solarLoad: 6, note: "Strong morning sun, cooler afternoons" },
  { id: "se", label: "South-east", solarLoad: 7, note: "Long morning exposure, high winter sun" },
  { id: "s", label: "South", solarLoad: 8, note: "High sun most of the day" },
  { id: "sw", label: "South-west", solarLoad: 10, note: "The hardest exposure in the UAE — low, long afternoon sun" },
  { id: "w", label: "West", solarLoad: 10, note: "Fierce late-afternoon sun straight into the room" },
  { id: "nw", label: "North-west", solarLoad: 7, note: "Late sun in summer, comfortable in winter" },
  { id: "unknown", label: "I'm not sure", solarLoad: 6, note: "We confirm this on the site visit" },
];

export const GLAZING: Option<GlazingId>[] = [
  { id: "double", label: "Double glazed", note: "Standard in most new UAE properties" },
  { id: "single", label: "Single glazed", note: "Common in older buildings and villas" },
  { id: "laminated", label: "Laminated or safety glass", note: "Often used in balustrades and partitions" },
  { id: "tinted", label: "Tinted or reflective", note: "Already has a factory or applied tint" },
  { id: "curtain-wall", label: "Full curtain wall", note: "Structural glazing, floor to ceiling" },
  { id: "unknown", label: "I don't know", note: "We check this during the survey" },
];

export const PROPERTY_STATUS: Option<PropertyStatusId>[] = [
  { id: "handover", label: "Just handed over", note: "Keys received, not lived in yet" },
  { id: "renovation", label: "Renovating", note: "Works in progress" },
  { id: "occupied", label: "Lived in", note: "We work around your routine" },
  { id: "under-construction", label: "Under construction", note: "We can coordinate with the contractor" },
];

export const BUDGET_BANDS: Option<BudgetBandId>[] = [
  { id: "entry", label: "Keep it efficient", note: "Solve the problem properly, nothing more" },
  { id: "mid", label: "Balanced", note: "Good materials, some automation" },
  { id: "premium", label: "Premium", note: "Best materials, full automation, finishing detail" },
  { id: "unspecified", label: "Tell me the options", note: "Show all three and let me decide" },
];

export const SCORE_META: Record<ScoreId, { label: string; description: string }> = {
  solar: {
    label: "Heat & solar load",
    description: "How much thermal energy this glass puts into the room across the day.",
  },
  glare: {
    label: "Glare",
    description: "How much the direct sun will interfere with screens, reading and comfort.",
  },
  privacy: {
    label: "Privacy requirement",
    description: "How exposed the space is to being seen into, and how much that matters here.",
  },
  blackout: {
    label: "Blackout requirement",
    description: "How close to full darkness this room needs to reach.",
  },
  automation: {
    label: "Automation benefit",
    description: "How much daily effort motorisation and scenes would remove.",
  },
  completion: {
    label: "Room completion gap",
    description: "How much the room still needs beyond the window to feel finished.",
  },
};

export const TIER_META: Record<Tier, { label: string; promise: string }> = {
  essential: {
    label: "Essential",
    promise: "Solve the problem properly, at the lightest intervention.",
  },
  signature: {
    label: "Signature",
    promise: "Design, comfort and layered control — the tier most homes choose.",
  },
  intelligent: {
    label: "Intelligent",
    promise: "Automation, scenes and switchable privacy. The space responds on its own.",
  },
};

export const RUNGS: { id: Rung; label: string; line: string }[] = [
  { id: "manual", label: "Manual", line: "You operate it. Chain, wand or cord." },
  { id: "motorized", label: "Motorized", line: "A motor operates it. Remote or wall switch." },
  { id: "automated", label: "Automated", line: "Schedules and scenes operate it. App and voice." },
  { id: "intelligent", label: "Intelligent", line: "The glass itself changes state on command." },
];

export const GROUP_META: Record<Group, { label: string; line: string }> = {
  light: { label: "Light", line: "Blinds and shading systems" },
  privacy: { label: "Privacy", line: "Smart Film and switchable glass" },
  softness: { label: "Softness", line: "Curtains and drapery" },
  surface: { label: "Surface", line: "Carpets and wallpaper" },
  intelligence: { label: "Intelligence", line: "Motors, control and scenes" },
};

export function labelFor<T extends string>(list: Option<T>[], id: T | undefined): string {
  return list.find((o) => o.id === id)?.label ?? "—";
}

export function roomLabel(id: RoomId | undefined): string {
  return ROOMS.find((r) => r.id === id)?.label ?? "—";
}

export function orientationLabel(id: OrientationId | undefined): string {
  return ORIENTATIONS.find((o) => o.id === id)?.label ?? "—";
}
