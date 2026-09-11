import type { OrientationId } from "@/lib/taxonomy";

export interface Community {
  slug: string;
  name: string;
  emirate: "Dubai" | "Sharjah" | "Abu Dhabi";
  kind: "residential" | "commercial";
  lead: string;
  /** Typical building stock, in the words a resident would use. */
  typology: string[];
  /** The specific glazing problem this community actually has. */
  problem: string;
  hardestOrientation: OrientationId;
  recommended: string[];
  notes: string[];
  serviceNote: string;
}

export const COMMUNITIES: Community[] = [
  {
    slug: "dubai-hills-estate",
    name: "Dubai Hills Estate",
    emirate: "Dubai",
    kind: "residential",
    lead: "Large villas with double-height glazing and long west elevations facing open parkland and golf.",
    typology: ["4–6 bed villas", "Contemporary townhouses", "Golf-facing apartments"],
    problem:
      "The open aspect that sells the villa is also an unshaded aspect. Living rooms and stairwell glazing take direct afternoon sun with nothing between the glass and the park.",
    hardestOrientation: "w",
    recommended: ["sunscreen-roller", "wave-curtain", "motorisation", "broadloom-carpet"],
    notes: [
      "Most villas here have ceiling voids deep enough for a recessed curtain pelmet if it is specified before handover joinery is closed.",
      "Double-height stairwell glazing is the single most common motorisation request in this community.",
    ],
    serviceNote: "Survey within 48 hours; installation teams work the community weekly.",
  },
  {
    slug: "palm-jumeirah",
    name: "Palm Jumeirah",
    emirate: "Dubai",
    kind: "residential",
    lead: "Frond villas and beachfront apartments where the view is the entire proposition and salt air is a material constraint.",
    typology: ["Garden and signature villas", "Beachfront apartments", "Penthouse terraces"],
    problem:
      "Sea-facing glass is bright all day and the reflected light off the water raises glare well beyond what the orientation alone suggests. Nobody wants to lose the view to solve it.",
    hardestOrientation: "sw",
    recommended: ["sunscreen-roller", "sheer-curtain", "motorisation", "wave-curtain"],
    notes: [
      "Low-openness sunscreen (1–3%) is usually the only acceptable answer — the view cannot be given up.",
      "Salt-laden air is hard on exposed hardware; we specify finishes accordingly and record them on the passport.",
    ],
    serviceNote: "Access coordination with the frond security office is handled by us before the visit.",
  },
  {
    slug: "emirates-hills",
    name: "Emirates Hills",
    emirate: "Dubai",
    kind: "residential",
    lead: "Bespoke mansions where the window treatment is part of the architecture and the joinery was designed around it.",
    typology: ["Custom-built mansions", "Double-height reception halls", "Large formal majlis"],
    problem:
      "Scale. Drops beyond four metres, curtain runs beyond twelve, and reception glazing that no manual system can serve properly.",
    hardestOrientation: "sw",
    recommended: ["motorisation", "wave-curtain", "pinch-pleat-curtain", "broadloom-carpet"],
    notes: [
      "Almost always a motorised specification — at this scale manual operation is not a viable option.",
      "Formal majlis areas usually take a pinch pleat heading; contemporary wings take wave.",
    ],
    serviceNote: "Dedicated project manager assigned for whole-villa specifications.",
  },
  {
    slug: "arabian-ranches",
    name: "Arabian Ranches",
    emirate: "Dubai",
    kind: "residential",
    lead: "Established family villas, many now on their second or third interior refresh.",
    typology: ["Family villas", "Townhouses", "Converted majlis and garden rooms"],
    problem:
      "Older glazing, deeper reveals and existing tracks that were never right. Most enquiries here are replacement work, not first fit.",
    hardestOrientation: "w",
    recommended: ["wave-curtain", "sunscreen-roller", "broadloom-carpet", "wallpaper"],
    notes: [
      "Existing tracks are frequently reusable in principle and wrong in practice — we check rather than assume.",
      "Renovation work here is usually phased room by room around an occupied house.",
    ],
    serviceNote: "Evening and weekend installation slots available for occupied villas.",
  },
  {
    slug: "al-barari",
    name: "Al Barari",
    emirate: "Dubai",
    kind: "residential",
    lead: "Villas set in dense planting, where the light is green, filtered and unusually soft for Dubai.",
    typology: ["Garden villas", "Leaf-facing living spaces", "Indoor-outdoor rooms"],
    problem:
      "Less of a heat problem than most of Dubai and more of a finishing one. The planting handles the glare; the interiors need the soft layer to match the setting.",
    hardestOrientation: "s",
    recommended: ["sheer-curtain", "wave-curtain", "broadloom-carpet", "wallpaper"],
    notes: [
      "Sheer-led specifications are common because the landscaping already does the solar work.",
      "Humidity from dense irrigation affects material choice for wall finishes.",
    ],
    serviceNote: "Material samples brought on site so fabrics can be seen in the community's own light.",
  },
  {
    slug: "tilal-al-ghaf",
    name: "Tilal Al Ghaf",
    emirate: "Dubai",
    kind: "residential",
    lead: "Newly handed-over villas and townhouses — most enquiries arrive within weeks of getting the keys.",
    typology: ["New-handover villas", "Lagoon-facing homes", "Contemporary townhouses"],
    problem:
      "Everything at once, on a deadline. Families want the whole house treated before they move in, and the handover window is short.",
    hardestOrientation: "sw",
    recommended: ["sunscreen-roller", "wave-curtain", "motorisation", "broadloom-carpet"],
    notes: [
      "Pre-handover surveys let us install in the empty property, which is faster and cleaner for everyone.",
      "Whole-house specifications here almost always justify motorisation on opening count alone.",
    ],
    serviceNote: "Fast-track survey for properties within 30 days of handover.",
  },
  {
    slug: "jumeirah-islands",
    name: "Jumeirah Islands",
    emirate: "Dubai",
    kind: "residential",
    lead: "Lake-facing villas with wide rear glazing and strong reflected light off the water.",
    typology: ["Lake-facing villas", "Entertainment rooms", "Terrace-facing living spaces"],
    problem:
      "Reflected glare off the lake surface arrives from below the usual angle, which standard shading advice tends to miss.",
    hardestOrientation: "w",
    recommended: ["sunscreen-roller", "panel-blind", "wave-curtain"],
    notes: [
      "Wide sliding doors onto the terrace are usually best served by panel systems rather than one oversized blind.",
    ],
    serviceNote: "Weekly installation coverage across the community.",
  },
  {
    slug: "dubai-marina",
    name: "Dubai Marina",
    emirate: "Dubai",
    kind: "residential",
    lead: "High-rise apartments with floor-to-ceiling glass, close neighbours and no reveal depth to hide anything in.",
    typology: ["1–3 bed apartments", "Duplex penthouses", "Curtain-wall living rooms"],
    problem:
      "Two problems at once: brutal west sun across the marina, and towers close enough that privacy is a genuine daily concern.",
    hardestOrientation: "w",
    recommended: ["sunscreen-roller", "sheer-curtain", "blackout-roller", "zebra-blind"],
    notes: [
      "Curtain-wall glazing means fixing into frame or slab — surveyed every time, never assumed.",
      "Building management approval is usually required before installation; we handle the submission.",
    ],
    serviceNote: "Tower access permits arranged by us ahead of the installation date.",
  },
  {
    slug: "business-bay",
    name: "Business Bay",
    emirate: "Dubai",
    kind: "commercial",
    lead: "Office floors and mixed-use towers with full curtain-wall glazing and fit-outs on tight programmes.",
    typology: ["Open-plan office floors", "Glass meeting rooms", "Ground-floor showrooms"],
    problem:
      "Glass meeting rooms that everyone can see into, and west-facing desks where screens are unusable after two o'clock.",
    hardestOrientation: "w",
    recommended: ["smart-film", "sunscreen-roller", "carpet-tile"],
    notes: [
      "Smart Film on internal partitions and sunscreen on the facade is the standard pairing here.",
      "Fit-out programmes are fixed — we work to the contractor's dates and submit for building approvals early.",
    ],
    serviceNote: "Out-of-hours installation to avoid disrupting occupied floors.",
  },
  {
    slug: "difc",
    name: "DIFC",
    emirate: "Dubai",
    kind: "commercial",
    lead: "Financial and legal offices where confidentiality is a regulatory expectation, not a preference.",
    typology: ["Partner offices", "Boardrooms", "Client meeting suites", "Reception areas"],
    problem:
      "Glass-walled meeting rooms that need to be private instantly, repeatedly, and without anyone getting up to draw a blind.",
    hardestOrientation: "sw",
    recommended: ["smart-film", "blackout-roller", "carpet-tile"],
    notes: [
      "Smart Film's fail-safe behaviour — opaque when power is lost — matters in this sector and we state it up front.",
      "Building management approvals and insurance documentation are part of every DIFC installation.",
    ],
    serviceNote: "Documentation pack prepared for building management as standard.",
  },
  {
    slug: "jlt",
    name: "Jumeirah Lake Towers",
    emirate: "Dubai",
    kind: "commercial",
    lead: "SME offices and clinics across dozens of towers, with highly variable glazing and fit-out quality.",
    typology: ["SME office suites", "Clinics and consultancies", "Co-working floors"],
    problem:
      "Inherited fit-outs with the wrong shading, cheap partition glass and no privacy where it is needed most.",
    hardestOrientation: "w",
    recommended: ["smart-film", "sunscreen-roller", "carpet-tile", "blackout-roller"],
    notes: [
      "Partition glass here is often not what the tenant thinks it is — film suitability is verified before any quote.",
    ],
    serviceNote: "Same-week survey across the JLT clusters.",
  },
  {
    slug: "dubai-healthcare-city",
    name: "Dubai Healthcare City & clinic clusters",
    emirate: "Dubai",
    kind: "commercial",
    lead: "Clinics, dental practices and day-surgery units where patient privacy and cleanability govern every specification.",
    typology: ["Consultation rooms", "Treatment and recovery areas", "Reception and waiting"],
    problem:
      "Privacy that must work instantly, surfaces that must be cleanable, and materials that must survive a clinical cleaning regime.",
    hardestOrientation: "s",
    recommended: ["smart-film", "blackout-roller", "carpet-tile"],
    notes: [
      "Fabric selections are made for cleanability and durability under clinical regimes, not for appearance alone.",
      "Smart Film on consultation-room glazing removes the drawn-blind delay entirely — subject to glass verification.",
    ],
    serviceNote: "Installation scheduled around clinic hours; infection-control requirements observed.",
  },
];

export function getCommunity(slug: string) {
  return COMMUNITIES.find((c) => c.slug === slug);
}
