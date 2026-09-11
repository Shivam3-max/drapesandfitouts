export interface Project {
  slug: string;
  title: string;
  sector: "residential" | "commercial" | "hospitality" | "healthcare";
  community: string;
  communitySlug?: string;
  year: string;
  openings: number;
  /** Set false only when a project has been signed off for publication with real photography. */
  illustrative: boolean;
  brief: string;
  diagnosis: string;
  specified: { solution: string; detail: string }[];
  outcome: string;
  /** Deliberate two-state imagery: the same window, before and after. */
  states: { label: string; note: string }[];
}

export const PROJECTS: Project[] = [
  {
    slug: "dubai-hills-villa-whole-house",
    title: "Six-bedroom villa, whole-house specification",
    sector: "residential",
    community: "Dubai Hills Estate",
    communitySlug: "dubai-hills-estate",
    year: "2026",
    openings: 34,
    illustrative: true,
    brief:
      "Family took handover in May and wanted the house finished before the summer. Double-height stairwell glazing, a west-facing living room and a media room that had to be genuinely dark.",
    diagnosis:
      "Two separate problems that are usually mixed up. The living room was a solar problem — the afternoon sun made it unusable between two and six. The media room was an edge-sealing problem: the owner had been quoted blackout fabric by two suppliers, neither of whom mentioned that the light comes around the sides.",
    specified: [
      { solution: "sunscreen-roller", detail: "3% openness, charcoal, motorised across the west elevation" },
      { solution: "wave-curtain", detail: "Lined wave curtains on recessed ceiling track, 80 mm wave spacing" },
      { solution: "blackout-roller", detail: "Media room, side channels and sealed cassette for true blackout" },
      { solution: "motorisation", detail: "34 openings on scene control — morning, day, evening and away" },
    ],
    outcome:
      "The living room came back into use in the afternoon, and the media room reaches a level of darkness the owner had been told was not achievable with blinds.",
    states: [
      { label: "Before", note: "Bare glass, 3 pm, west elevation" },
      { label: "After", note: "Same window, same hour, sunscreen deployed" },
    ],
  },
  {
    slug: "difc-legal-boardroom",
    title: "Legal practice, boardroom and client suites",
    sector: "commercial",
    community: "DIFC",
    communitySlug: "difc",
    year: "2026",
    openings: 11,
    illustrative: true,
    brief:
      "A firm moving into a glass-partitioned floor needed instant privacy in the boardroom and four client meeting rooms, without losing the daylight the fit-out was designed around.",
    diagnosis:
      "Blinds would have worked and would have been drawn permanently, which defeats the fit-out. The real requirement was privacy that could be switched on for the length of a meeting and switched off afterwards — which is a glass problem, not a window-covering problem.",
    specified: [
      { solution: "smart-film", detail: "Switchable film on all internal partition glazing, wall-switch and room-booking control" },
      { solution: "blackout-roller", detail: "Facade glazing, dim-out fabric for presentation conditions" },
      { solution: "carpet-tile", detail: "Acoustic-backed tile throughout, 5% attic stock retained" },
    ],
    outcome:
      "Meeting rooms are private in under a second and transparent the rest of the time. The daylight the architect specified survived the privacy requirement.",
    states: [
      { label: "Clear", note: "Boardroom glazing, unpowered state documented at handover" },
      { label: "Private", note: "Same glazing, switched" },
    ],
  },
  {
    slug: "marina-apartment-privacy",
    title: "Marina apartment, privacy and west sun",
    sector: "residential",
    community: "Dubai Marina",
    communitySlug: "dubai-marina",
    year: "2026",
    openings: 7,
    illustrative: true,
    brief:
      "Two-bedroom apartment on a mid floor with a neighbouring tower forty metres away and full west glazing across the living room.",
    diagnosis:
      "The owner asked for blackout curtains everywhere. That would have solved privacy and created a dark apartment. The correct answer was layered: solar control during the day, a sheer for daytime privacy, and blackout confined to the bedrooms where it belongs.",
    specified: [
      { solution: "sunscreen-roller", detail: "3% openness on the living room west glazing" },
      { solution: "sheer-curtain", detail: "Wide-width seamless sheer on the inner track, weighted hem" },
      { solution: "blackout-roller", detail: "Bedrooms only, with side channels" },
    ],
    outcome:
      "Daytime privacy without darkness, an afternoon the owner can use, and blackout where sleep actually happens.",
    states: [
      { label: "Before", note: "Bare curtain-wall glazing, neighbouring tower visible" },
      { label: "After", note: "Layered system, mid-afternoon" },
    ],
  },
  {
    slug: "jlt-dental-clinic",
    title: "Dental clinic, consultation privacy",
    sector: "healthcare",
    community: "Jumeirah Lake Towers",
    communitySlug: "jlt",
    year: "2026",
    openings: 9,
    illustrative: true,
    brief:
      "A clinic inheriting a fit-out with glass-fronted consultation rooms and fabric blinds that could not be cleaned to the practice's standard.",
    diagnosis:
      "Two constraints the previous supplier had ignored: the cleaning regime ruled out the installed fabric, and the privacy requirement was immediate — a patient sits down and the room must already be private.",
    specified: [
      { solution: "smart-film", detail: "Consultation room glazing, switched at the door; glass verified for suitability before quotation" },
      { solution: "blackout-roller", detail: "External glazing, wipeable technical fabric" },
      { solution: "carpet-tile", detail: "Reception only; clinical areas left hard-floored by design" },
    ],
    outcome:
      "Privacy is instant and hands-free, and every surface in the treatment areas meets the practice's cleaning protocol.",
    states: [
      { label: "Clear", note: "Consultation room glazing between patients" },
      { label: "Private", note: "Switched at the door as the patient sits" },
    ],
  },
  {
    slug: "palm-beachfront-villa",
    title: "Beachfront villa, keeping the view",
    sector: "residential",
    community: "Palm Jumeirah",
    communitySlug: "palm-jumeirah",
    year: "2026",
    openings: 22,
    illustrative: true,
    brief:
      "Sea-facing villa where the owner had refused three previous proposals because each one obscured the water.",
    diagnosis:
      "Glare off the water arrives from a lower angle than the sun itself, which is why standard advice had failed here. A 1% openness technical mesh in a dark tone cuts the glare while keeping the view sharper than a lighter fabric would.",
    specified: [
      { solution: "sunscreen-roller", detail: "1% openness, bronze, motorised, coupled across the sea-facing runs" },
      { solution: "sheer-curtain", detail: "Evening layer on a recessed double track" },
      { solution: "motorisation", detail: "Scene control, with marine-appropriate hardware finishes recorded on the passport" },
    ],
    outcome:
      "The view survived the solution — which was the only acceptance criterion the client had.",
    states: [
      { label: "Before", note: "Unshaded sea-facing glazing, late afternoon" },
      { label: "After", note: "1% mesh deployed, view retained" },
    ],
  },
  {
    slug: "hotel-guest-room-rollout",
    title: "Hotel guest-room rollout, 140 keys",
    sector: "hospitality",
    community: "Business Bay",
    communitySlug: "business-bay",
    year: "2026",
    openings: 280,
    illustrative: true,
    brief:
      "A property refurbishing guest rooms floor by floor while continuing to trade, with a fixed specification and a fixed nightly room-out allowance.",
    diagnosis:
      "The specification was straightforward; the programme was not. The constraint was the number of rooms that could be out of service at one time, which made sequencing and per-room installation time the real design problem.",
    specified: [
      { solution: "blackout-roller", detail: "Contract blackout with fire performance certification, sealed cassette" },
      { solution: "sheer-curtain", detail: "Contract sheer on a double track, standard across all keys" },
      { solution: "broadloom-carpet", detail: "Guest rooms and corridors, phased with the room programme" },
    ],
    outcome:
      "Rolled out floor by floor within the nightly room-out allowance, with room-by-room records that make future replacement a lookup rather than a re-survey.",
    states: [
      { label: "Before", note: "Existing guest-room window, end of life" },
      { label: "After", note: "Refurbished specification, same key type" },
    ],
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

export const SECTOR_LABEL: Record<Project["sector"], string> = {
  residential: "Residential",
  commercial: "Commercial",
  hospitality: "Hospitality",
  healthcare: "Healthcare",
};
