import type { Group, ProblemId, RoomId, Rung } from "./taxonomy";

export type PriceBasis = "per_sqm" | "per_running_m" | "per_opening" | "per_panel";

export interface Solution {
  /** Stable id used by the rule engine. Never rename. */
  slug: string;
  name: string;
  group: Group;
  /** Control rungs this family can actually be supplied on. */
  rungs: Rung[];
  tagline: string;
  summary: string;
  /** Problems this family is a legitimate answer to. */
  solves: ProblemId[];
  /** Rooms where it is commonly specified. */
  rooms: RoomId[];
  winsWhen: string[];
  notFor: string[];
  specs: { label: string; value: string }[];
  materials: string[];
  /** Indicative supply-and-install range, AED. Always shown as a range. */
  price: { basis: PriceBasis; low: number; high: number; note?: string };
  leadTimeDays: [number, number];
  /** What the survey must confirm before this can be quoted firm. */
  verify: string[];
  faqs: { q: string; a: string }[];
  /** Families that are commonly layered with this one. */
  pairsWith: string[];
}

export const PRICE_BASIS_LABEL: Record<PriceBasis, string> = {
  per_sqm: "per m² of covered glass",
  per_running_m: "per running metre of track",
  per_opening: "per opening",
  per_panel: "per panel",
};

export const SOLUTIONS: Solution[] = [
  {
    slug: "sunscreen-roller",
    name: "Sunscreen roller blind",
    group: "light",
    rungs: ["manual", "motorized", "automated"],
    tagline: "Keeps the view. Removes the heat.",
    summary:
      "A technical mesh fabric that blocks solar energy and glare while staying transparent enough to see through. The single most useful product in the UAE, and the one most often specified last.",
    solves: ["heat", "glare", "large-glazing"],
    rooms: ["living", "majlis", "study", "open-office", "meeting", "reception", "dining", "showroom"],
    winsWhen: [
      "The window faces west, south-west or south and the afternoon is unusable",
      "The view is the reason you bought the property and you refuse to lose it",
      "Screens are washing out in an office or study",
      "Glass runs floor to ceiling and a heavy fabric would dominate the room",
    ],
    notFor: [
      "Bedrooms that need darkness — sunscreen is never a blackout product",
      "Night-time privacy on its own: with interior lights on, a low-openness mesh still reveals silhouettes",
    ],
    specs: [
      { label: "Openness factor", value: "1% · 3% · 5% · 10% — lower is more privacy and less view" },
      { label: "Solar rejection", value: "Varies by fabric and colour; confirmed from the mill data sheet per selection" },
      { label: "Colour behaviour", value: "Darker fabrics give better glare control and a clearer view out; lighter fabrics reflect more heat" },
      { label: "Max width", value: "Typically up to ~3 m per blind before coupling is required" },
    ],
    materials: ["Fibreglass-backed PVC mesh", "Polyester mesh", "Bronze and charcoal technical weaves"],
    price: { basis: "per_sqm", low: 220, high: 480, note: "Motorisation quoted separately per blind" },
    leadTimeDays: [10, 18],
    verify: [
      "Recess depth and whether the blind sits inside or outside the reveal",
      "Sill projection and handle clearance on openable windows",
      "Coupling strategy for runs wider than a single blind",
    ],
    faqs: [
      {
        q: "Will I still see out?",
        a: "Yes, during the day. A 3% openness fabric keeps a clear view out while cutting most of the glare. At night, with the lights on inside, the effect reverses — that's why we usually pair sunscreen with a second layer.",
      },
      {
        q: "Does it actually reduce the cooling load?",
        a: "It reduces solar gain through the glass, which is where most of the heat enters a UAE room. The size of the effect depends on the fabric, the colour, the glazing and the orientation — we quote from the mill data for the fabric you choose rather than a general claim.",
      },
    ],
    pairsWith: ["blackout-roller", "wave-curtain", "sheer-curtain"],
  },
  {
    slug: "blackout-roller",
    name: "Blackout roller blind",
    group: "light",
    rungs: ["manual", "motorized", "automated"],
    tagline: "Darkness, with a clean line.",
    summary:
      "A coated opaque fabric on a roller system. Blocks light through the fabric completely — the remaining light comes around the edges, which is an installation problem, not a fabric one.",
    solves: ["blackout", "privacy", "glare"],
    rooms: ["bedroom", "media", "guest-room", "ward", "study"],
    winsWhen: [
      "You want darkness without the bulk of curtains",
      "The room is small and floor space matters",
      "You need a clean, contemporary line in a bedroom or media room",
    ],
    notFor: [
      "Rooms where you want the view retained during the day — this is an on/off product",
      "Anyone expecting zero light with a standard reveal fit: side channels are required for true blackout",
    ],
    specs: [
      { label: "Fabric", value: "Triple-weave or acrylic-coated blackout, 100% opaque through the weave" },
      { label: "True blackout", value: "Requires side channels or a cassette with a light seal — specified per window" },
      { label: "Cassette options", value: "Open roll, semi-cassette, full cassette with bottom seal" },
    ],
    materials: ["Triple-weave polyester", "Acrylic-coated blackout", "Fire-retardant contract blackout"],
    price: { basis: "per_sqm", low: 240, high: 520 },
    leadTimeDays: [10, 18],
    verify: [
      "Whether side channels can be fitted to the reveal",
      "Reveal depth for a cassette without fouling the handle",
      "Whether the customer's expectation is 'dark' or 'true blackout' — they are different products",
    ],
    faqs: [
      {
        q: "Why is there light around the edges?",
        a: "Because the fabric is opaque but the gap between fabric and wall is not. If you want true blackout we specify side channels and a bottom seal, and we tell you before you order rather than after.",
      },
    ],
    pairsWith: ["sunscreen-roller", "sheer-curtain", "wave-curtain"],
  },
  {
    slug: "zebra-blind",
    name: "Zebra blind",
    group: "light",
    rungs: ["manual", "motorized"],
    tagline: "Two fabrics, one roll, infinite in between.",
    summary:
      "Alternating sheer and opaque bands on a single roller. Align the bands for privacy, offset them for filtered light. Popular in apartments because one product covers two moods.",
    solves: ["glare", "privacy", "unfinished"],
    rooms: ["living", "dining", "bedroom", "study", "reception"],
    winsWhen: [
      "An apartment where one product has to do two jobs",
      "You want daytime light control without fully committing to either sheer or opaque",
      "A rental or a fast handover where speed and value matter",
    ],
    notFor: [
      "True blackout — the opaque bands are not a blackout layer",
      "Very wide openings, where band alignment across a long roll becomes visible",
    ],
    specs: [
      { label: "Operation", value: "Chain or motor; band alignment by roll position" },
      { label: "Fabric", value: "Polyester sheer / dim-out band pairing" },
      { label: "Cassette", value: "Aluminium cassette with optional fascia" },
    ],
    materials: ["Polyester day-night weaves", "Textured band fabrics", "Metallic-backed dim-out bands"],
    price: { basis: "per_sqm", low: 200, high: 430 },
    leadTimeDays: [8, 15],
    verify: ["Reveal depth for the cassette", "Width against band alignment tolerance"],
    faqs: [
      {
        q: "Is a zebra blind private at night?",
        a: "When the bands are aligned it is close to a dim-out blind, but it is not blackout and not fully private with strong interior light behind it. For a bedroom we would rather specify a blackout layer.",
      },
    ],
    pairsWith: ["sheer-curtain", "blackout-roller"],
  },
  {
    slug: "roman-blind",
    name: "Roman blind",
    group: "softness",
    rungs: ["manual", "motorized"],
    tagline: "The softness of a curtain in the space of a blind.",
    summary:
      "Fabric that folds into horizontal pleats as it rises. Reads as an upholstered, tailored window rather than a technical one — the right answer when a room wants warmth but has no depth for curtains.",
    solves: ["unfinished", "glare", "privacy", "acoustics"],
    rooms: ["bedroom", "living", "dining", "study", "guest-room", "majlis"],
    winsWhen: [
      "A designed room where a roller blind would look utilitarian",
      "Windows too shallow for a curtain stack but too prominent for a bare blind",
      "You want fabric, pattern or texture at the window without floor-length drapery",
    ],
    notFor: [
      "Very wide windows — beyond roughly 2.4 m the fold weight and sag become a problem",
      "High-humidity rooms and kitchens, where the fabric will hold odour and moisture",
    ],
    specs: [
      { label: "Fold depth", value: "Typically 180–250 mm, set to suit the window proportion" },
      { label: "Lining", value: "Standard, dim-out or blackout lining" },
      { label: "Mechanism", value: "Chain-driven cord lock or motorised lift" },
    ],
    materials: ["Linen and linen blends", "Textured cottons", "Contract-grade decorative weaves"],
    price: { basis: "per_sqm", low: 450, high: 1100 },
    leadTimeDays: [14, 25],
    verify: ["Head fixing surface and depth", "Fold layout against window proportion", "Lining choice against light expectations"],
    faqs: [
      {
        q: "Can a Roman blind be blackout?",
        a: "With a blackout lining, yes — through the fabric. Edge light still comes around the sides because the blind sits within or in front of the reveal, so for a bedroom we usually pair it with a blackout layer or a side channel.",
      },
    ],
    pairsWith: ["sheer-curtain", "blackout-roller"],
  },
  {
    slug: "venetian-blind",
    name: "Venetian blind",
    group: "light",
    rungs: ["manual", "motorized"],
    tagline: "Directional light. You steer it.",
    summary:
      "Tilting horizontal slats in wood, faux wood or aluminium. The only common product that lets you redirect daylight upward instead of simply blocking it.",
    solves: ["glare", "privacy", "unfinished"],
    rooms: ["study", "open-office", "meeting", "kitchen", "bathroom", "reception", "bedroom"],
    winsWhen: [
      "You want light in the room but not in your eyes",
      "A study or office where glare moves across the day",
      "Wet areas and kitchens, where aluminium and faux wood outperform fabric",
    ],
    notFor: [
      "Blackout requirements — slats always leak light at the tilt",
      "Very large glazing, where slat stacks become heavy and visually busy",
    ],
    specs: [
      { label: "Slat widths", value: "25 mm · 35 mm · 50 mm" },
      { label: "Materials", value: "Wooden · Aluminium · Faux wood" },
      { label: "Control", value: "Wand tilt with cord lift, or motorised tilt and lift" },
    ],
    materials: ["Basswood", "Powder-coated aluminium", "Moisture-resistant faux wood"],
    price: { basis: "per_sqm", low: 180, high: 720, note: "Wooden slats sit at the top of the range; aluminium at the bottom" },
    leadTimeDays: [10, 20],
    verify: ["Reveal depth for the stack", "Handle and opening clearance", "Humidity exposure if wood is selected"],
    faqs: [
      {
        q: "Wood or faux wood?",
        a: "Wood looks and feels better and weighs less. Faux wood survives bathrooms, kitchens and direct sun without warping. In a UAE villa with strong west glazing we often specify faux wood on the exposed elevation and wood elsewhere.",
      },
    ],
    pairsWith: ["sheer-curtain", "wave-curtain"],
  },
  {
    slug: "panel-blind",
    name: "Panel blind",
    group: "light",
    rungs: ["manual", "motorized"],
    tagline: "For glass that behaves like a wall.",
    summary:
      "Wide fabric panels that slide across a multi-track head rail. Built for sliding doors, wide terraces and room dividers where a conventional blind would be unmanageable.",
    solves: ["large-glazing", "glare", "privacy"],
    rooms: ["living", "dining", "balcony", "open-office", "showroom", "reception"],
    winsWhen: [
      "Sliding or bi-fold doors onto a terrace",
      "A very wide opening where one roller would be too heavy and too wide",
      "You want the covering to stack almost entirely off the glass",
    ],
    notFor: ["Small windows, where the panel proportion looks wrong", "Blackout bedrooms"],
    specs: [
      { label: "Panel width", value: "Typically 400–1000 mm per panel" },
      { label: "Tracks", value: "2 to 5 channels, hand-drawn or motorised" },
      { label: "Fabrics", value: "Sunscreen, dim-out and decorative panels can be mixed on one track" },
    ],
    materials: ["Sunscreen mesh panels", "Dim-out panels", "Textured decorative panels"],
    price: { basis: "per_sqm", low: 260, high: 560 },
    leadTimeDays: [12, 20],
    verify: ["Ceiling or wall fixing and head depth", "Stack space at one or both ends", "Door handle and traffic clearance"],
    faqs: [
      {
        q: "Where do the panels go when they're open?",
        a: "They stack against one another at one or both ends. That stack needs wall space — we measure for it, because a panel blind that covers part of the door when open is the most common mistake with this product.",
      },
    ],
    pairsWith: ["sunscreen-roller", "wave-curtain"],
  },
  {
    slug: "skylight-blind",
    name: "Skylight & roof-glazing blind",
    group: "light",
    rungs: ["motorized", "automated"],
    tagline: "The hardest glass in the building.",
    summary:
      "Tensioned systems for roof glazing, atriums and sloped glass, where gravity, heat and access all work against a conventional blind. Always motorised, always measured on site.",
    solves: ["heat", "glare", "large-glazing", "automation"],
    rooms: ["stairwell", "living", "reception", "corridor"],
    winsWhen: [
      "A skylight or atrium that turns the space into a greenhouse by mid-morning",
      "Sloped or roof glazing that no one can reach",
      "Double-height stairwells with unshaded glass",
    ],
    notFor: ["Anything that can be solved with a standard vertical window product at a fraction of the cost"],
    specs: [
      { label: "System", value: "Tensioned cable or channel-guided, motorised as standard" },
      { label: "Fabric", value: "High solar-rejection sunscreen or dim-out, UV stabilised" },
      { label: "Power", value: "Mains or low-voltage supply required at the head — usually needs coordination" },
    ],
    materials: ["UV-stabilised technical mesh", "Reflective-backed dim-out"],
    price: { basis: "per_sqm", low: 850, high: 2200, note: "Access, geometry and power routing move this range significantly" },
    leadTimeDays: [25, 45],
    verify: [
      "Exact geometry — never quoted from customer dimensions",
      "Power availability and routing at the head",
      "Access equipment needed for installation",
      "Structural fixing points",
    ],
    faqs: [
      {
        q: "Why is a skylight blind so much more expensive?",
        a: "Because gravity is pulling on the fabric, the glass is often irregular, the heat load is extreme, and installing it needs access equipment. It is an engineered system rather than a made-to-measure blind, and we only quote it after a site survey.",
      },
    ],
    pairsWith: ["motorisation"],
  },
  {
    slug: "wave-curtain",
    name: "Wave curtain",
    group: "softness",
    rungs: ["manual", "motorized", "automated"],
    tagline: "One continuous S-curve, floor to ceiling.",
    summary:
      "A modern heading where the fabric runs in an even, unbroken wave on a corded or motorised track. The default choice for contemporary UAE interiors, and the heading that photographs best.",
    solves: ["unfinished", "privacy", "blackout", "acoustics", "transformation"],
    rooms: ["living", "bedroom", "majlis", "dining", "guest-room", "study", "reception"],
    winsWhen: [
      "Ceiling-mounted track, floor-to-ceiling drop, contemporary interior",
      "Long runs where an even repeat matters visually",
      "You want the curtain to look deliberate rather than gathered",
    ],
    notFor: [
      "Traditional or classical interiors, where a pinch pleat carries the room better",
      "Windows with no ceiling fixing and no space for a recessed track",
    ],
    specs: [
      { label: "Fullness", value: "Typically 2.0× to 2.5× the track width" },
      { label: "Wave spacing", value: "60 · 80 · 100 mm glider spacing — sets the depth of the curve" },
      { label: "Track", value: "Ceiling-recessed, surface or bracket-mounted; motorised options across all three" },
      { label: "Drop", value: "Floor-clearing (10 mm) or breaking — specified, never assumed" },
    ],
    materials: ["Linen and linen blends", "Velvet", "Blackout-lined decorative weaves", "Sheer voiles"],
    price: { basis: "per_running_m", low: 320, high: 1400, note: "Per running metre of track, including fabric at standard fullness, making and installation" },
    leadTimeDays: [14, 28],
    verify: [
      "Ceiling condition and whether a recessed pelmet exists or can be formed",
      "Exact drop from fixed track height to finished floor level",
      "Stack space at each end so the curtain clears the glass when open",
    ],
    faqs: [
      {
        q: "Should the curtain touch the floor?",
        a: "For wave headings we normally set a 10 mm clearance so the curtain hangs cleanly and doesn't drag. A break on the floor is a deliberate classical look and it needs a heavier fabric to sit properly.",
      },
      {
        q: "Wave or pinch pleat?",
        a: "Wave for contemporary rooms with ceiling tracks and long drops. Pinch pleat for classical rooms, decorative poles and where the heading itself should be part of the detail.",
      },
    ],
    pairsWith: ["sheer-curtain", "sunscreen-roller", "motorisation"],
  },
  {
    slug: "pinch-pleat-curtain",
    name: "Pinch pleat curtain",
    group: "softness",
    rungs: ["manual", "motorized"],
    tagline: "The classical heading, properly made.",
    summary:
      "Hand-formed double or triple pleats on a pole or track. The American-style heading in the portfolio — structured, formal, and unforgiving of poor making.",
    solves: ["unfinished", "privacy", "blackout", "transformation"],
    rooms: ["majlis", "living", "bedroom", "dining", "guest-room"],
    winsWhen: [
      "Classical, traditional or transitional interiors",
      "Decorative poles and finials that should be seen",
      "A majlis or formal reception where the window should feel tailored",
    ],
    notFor: ["Minimal contemporary rooms with recessed ceiling tracks — the heading fights the architecture"],
    specs: [
      { label: "Pleat types", value: "Double, triple and goblet" },
      { label: "Fullness", value: "Typically 2.2× to 2.5×" },
      { label: "Heading depth", value: "Buckram-stiffened, 100–150 mm" },
    ],
    materials: ["Jacquards", "Silk-look polyesters", "Velvet", "Heavy linens"],
    price: { basis: "per_running_m", low: 340, high: 1500 },
    leadTimeDays: [16, 30],
    verify: ["Pole or track fixing and projection", "Return to wall detail", "Pattern repeat and matching across panels"],
    faqs: [
      {
        q: "Why do two quotes for 'the same' curtain differ so much?",
        a: "Fullness, lining, pattern matching and hand-finishing. A 2.0× curtain in a printed fabric with no repeat matching costs far less than a 2.5× curtain with matched panels and hand-sewn leading edges — and they do not look the same after a month.",
      },
    ],
    pairsWith: ["sheer-curtain", "venetian-blind"],
  },
  {
    slug: "sheer-curtain",
    name: "Sheer curtain",
    group: "softness",
    rungs: ["manual", "motorized", "automated"],
    tagline: "Daytime privacy that still lets the room glow.",
    summary:
      "A light, translucent layer — usually the inner of a double-track system. Softens the light, gives daytime privacy, and makes the room read as finished even with the heavy curtain open.",
    solves: ["privacy", "glare", "unfinished"],
    rooms: ["living", "bedroom", "majlis", "dining", "reception", "guest-room"],
    winsWhen: [
      "Any room where the curtain will be open all day but the glass still feels bare",
      "Overlooked apartments that need daytime privacy without darkness",
      "Layered systems, as the inner track of a double-layer curtain",
    ],
    notFor: ["Night-time privacy on its own", "Any heat problem — a sheer is not a solar-control product"],
    specs: [
      { label: "Fullness", value: "2.5× to 3.0× — sheers need more fullness than lined curtains" },
      { label: "Weight", value: "Weighted hem recommended in air-conditioned rooms so the fabric hangs still" },
      { label: "Track", value: "Usually the inner channel of a double track" },
    ],
    materials: ["Voile", "Linen-look sheers", "Wide-width seamless sheers"],
    price: { basis: "per_running_m", low: 180, high: 650 },
    leadTimeDays: [12, 22],
    verify: ["Double-track feasibility at the ceiling", "Air-conditioning airflow at the window", "Drop to finished floor level"],
    faqs: [
      {
        q: "Can people see in through a sheer at night?",
        a: "Yes. A sheer gives daytime privacy because it is brighter outside than inside. After dark that reverses. That is exactly why we specify a second layer in bedrooms and living rooms rather than selling a sheer on its own.",
      },
    ],
    pairsWith: ["wave-curtain", "blackout-roller", "pinch-pleat-curtain"],
  },
  {
    slug: "smart-film",
    name: "Smart Film",
    group: "privacy",
    rungs: ["intelligent"],
    tagline: "Clear to private, in under a second.",
    summary:
      "Switchable PDLC film applied to existing glass. Power on, the liquid-crystal layer aligns and the glass turns clear; power off, it scatters light and the glass turns opaque. No blind, no curtain, no lost floor space.",
    solves: ["privacy", "automation", "large-glazing", "transformation"],
    rooms: ["boardroom", "meeting", "consultation", "reception", "bathroom", "stairwell", "showroom", "ward"],
    winsWhen: [
      "Glass meeting rooms and boardrooms that need privacy on demand",
      "Clinics where patient privacy cannot wait for a blind to be drawn",
      "Bathrooms and internal partitions where a curtain would be impractical",
      "Retrofit — you keep the existing glass and gain a new function",
    ],
    notFor: [
      "Heat control. Film switches privacy, not solar load — pair it with shading if the glass is also hot",
      "Any glass that cannot be verified as suitable: curved, heavily textured, damaged or inaccessible glazing",
      "Locations with no achievable power route to the glass edge",
    ],
    specs: [
      { label: "Technology", value: "PDLC (polymer dispersed liquid crystal), self-adhesive retrofit film" },
      { label: "States", value: "Opaque when off · clear when on — switching in well under a second" },
      { label: "Switching", value: "Wall switch, remote, app or building system, via a dedicated transformer" },
      { label: "Power", value: "Low-voltage AC supply to the glass edge; exact voltage and consumption confirmed per product data sheet at survey" },
      { label: "Projection", value: "In the opaque state the surface can be used as a rear-projection screen" },
    ],
    materials: ["Self-adhesive PDLC film", "Laminated switchable glass (new-build option)"],
    price: { basis: "per_sqm", low: 650, high: 1400, note: "Excludes electrical works; switching, transformer and power routing quoted after survey" },
    leadTimeDays: [15, 30],
    verify: [
      "Glass type, thickness and whether it is laminated or toughened",
      "Frame detail and whether the film edge can be concealed",
      "Achievable route for the power supply to the glass edge",
      "Glass surface condition — existing film, scratches or contamination",
      "Whether the panel is accessible from the required side for application",
    ],
    faqs: [
      {
        q: "What happens in a power cut?",
        a: "The glass returns to its opaque state. That is the fail-safe behaviour of PDLC film, and it is worth knowing before you specify it for a room that must stay transparent.",
      },
      {
        q: "Can it go on any glass?",
        a: "No, and this is where most film projects go wrong. We verify the glass type, condition, frame detail and power route on site before we quote — and if it isn't suitable we will tell you and specify a blind instead.",
      },
      {
        q: "Does it keep the room cooler?",
        a: "Not meaningfully. Smart Film is a privacy product. If the same glass is also a heat problem, the honest answer is film for privacy plus a solar-control layer for heat.",
      },
    ],
    pairsWith: ["sunscreen-roller", "motorisation"],
  },
  {
    slug: "motorisation",
    name: "Motorisation & control",
    group: "intelligence",
    rungs: ["motorized", "automated"],
    tagline: "Twenty-five windows, one command.",
    summary:
      "Motors, tracks, power and control for curtains and blinds — plus the scenes that make them worth having. Commissioned on site, documented on the project passport.",
    solves: ["automation", "large-glazing", "heat", "transformation"],
    rooms: ["living", "bedroom", "majlis", "media", "stairwell", "boardroom", "open-office", "guest-room"],
    winsWhen: [
      "More than about eight openings in one property",
      "Glass above reach, on stairwells or double-height rooms",
      "Media rooms and bedrooms where a scene should move several layers at once",
      "Anyone who currently opens and closes the house by hand twice a day",
    ],
    notFor: [
      "A single small window where a chain works perfectly well",
      "Properties where no power can be brought to the head of the window and battery service access is impractical",
    ],
    specs: [
      { label: "Motor types", value: "Mains, low-voltage and rechargeable battery tubular motors" },
      { label: "Control", value: "Handheld remote, wall switch, app and voice; scene control via the supported home system" },
      { label: "Scenes", value: "Good Morning · Work · Movie · Away — configured at commissioning and recorded on your passport" },
      { label: "Integration", value: "We support the control systems we can commission and service ourselves — confirmed per project, never assumed" },
    ],
    materials: ["Tubular motors", "Motorised curtain tracks", "Transformers and controllers"],
    price: { basis: "per_opening", low: 900, high: 3200, note: "Per motorised opening. Electrical works and control hardware quoted separately" },
    leadTimeDays: [14, 30],
    verify: [
      "Power availability at the head of each opening",
      "Whether cabling can be concealed or must be surface-run",
      "Existing motors and whether they can genuinely be reused — never assumed",
      "Network coverage at the window for app and scene control",
    ],
    faqs: [
      {
        q: "Battery or wired?",
        a: "Wired wherever power can reach the head — it is more reliable and never needs charging. Battery motors are the right answer in a finished property where chasing walls isn't an option, and we will tell you the service interval before you buy.",
      },
      {
        q: "Will it work with my home system?",
        a: "We support the control systems we can commission and service ourselves, and we confirm compatibility at survey rather than promising it up front. Anything we cannot support properly, we say so.",
      },
    ],
    pairsWith: ["wave-curtain", "sunscreen-roller", "blackout-roller", "smart-film"],
  },
  {
    slug: "broadloom-carpet",
    name: "Carpet & rugs",
    group: "surface",
    rungs: ["manual"],
    tagline: "The room isn't finished until the floor is.",
    summary:
      "Wall-to-wall carpet and made-to-size rugs. In hard-surfaced UAE interiors the floor is usually the last acoustic and thermal surface left untreated — and the one that changes how a room feels most.",
    solves: ["acoustics", "unfinished", "transformation"],
    rooms: ["bedroom", "majlis", "media", "living", "study", "guest-room", "corridor"],
    winsWhen: [
      "Marble and porcelain floors that make the room echo",
      "Bedrooms and majlis areas that feel cold underfoot and hard to the ear",
      "Media rooms, where the floor does real acoustic work",
    ],
    notFor: ["Wet areas", "High-traffic commercial circulation better served by carpet tile"],
    specs: [
      { label: "Constructions", value: "Loop, cut pile, cut-and-loop, hand-tufted" },
      { label: "Fibres", value: "Wool, wool blends, solution-dyed nylon, polypropylene" },
      { label: "Finishing", value: "Machine-serged, cotton or leather binding, mitred borders" },
    ],
    materials: ["Wool and wool blends", "Solution-dyed nylon", "Hand-tufted custom rugs"],
    price: { basis: "per_sqm", low: 90, high: 480, note: "Underlay, binding and fitting quoted with the selection" },
    leadTimeDays: [10, 35],
    verify: ["Floor level and existing finish", "Doorway thresholds and clearances", "Exact room geometry for a made-to-size rug"],
    faqs: [
      {
        q: "Wool or nylon?",
        a: "Wool feels better, handles humidity well and ages gracefully. Solution-dyed nylon takes heavy traffic and cleans harder. For a majlis we usually specify wool; for a family corridor, nylon.",
      },
    ],
    pairsWith: ["wave-curtain", "wallpaper"],
  },
  {
    slug: "carpet-tile",
    name: "Carpet tile",
    group: "surface",
    rungs: ["manual"],
    tagline: "Commercial floors that can be repaired, not replaced.",
    summary:
      "Modular tiles for offices, corridors and high-traffic areas. When one tile is damaged you replace one tile — which is why every serious workplace specification uses them.",
    solves: ["acoustics", "unfinished"],
    rooms: ["open-office", "meeting", "reception", "corridor", "boardroom"],
    winsWhen: [
      "Offices and workplaces with real traffic",
      "Raised access floors that need to stay accessible",
      "Any space where a single damaged area shouldn't mean a whole new floor",
    ],
    notFor: ["Residential bedrooms, where broadloom or a rug reads better"],
    specs: [
      { label: "Formats", value: "500 × 500 mm · 250 × 1000 mm planks" },
      { label: "Backing", value: "Bitumen, PVC-free and cushion-backed options" },
      { label: "Laying", value: "Monolithic, quarter-turn, ashlar and brick-bond patterns" },
    ],
    materials: ["Solution-dyed nylon", "Recycled-content backings"],
    price: { basis: "per_sqm", low: 85, high: 320 },
    leadTimeDays: [12, 30],
    verify: ["Subfloor condition and moisture", "Access floor compatibility", "Attic stock quantity for future repairs"],
    faqs: [
      {
        q: "How much attic stock should we hold?",
        a: "Around 3–5% of the installed area, from the same dye lot. It is the difference between a repair that disappears and a repair everyone can see.",
      },
    ],
    pairsWith: ["sunscreen-roller", "smart-film"],
  },
  {
    slug: "prayer-carpet",
    name: "Prayer room carpet",
    group: "surface",
    rungs: ["manual"],
    tagline: "Made for the room, aligned to the direction.",
    summary:
      "Carpet for prayer rooms in villas, offices, hotels and mosques — supplied plain, bordered or with woven prayer rows, and always set out to the qibla direction measured on site.",
    solves: ["unfinished", "acoustics", "transformation"],
    rooms: ["prayer"],
    winsWhen: [
      "A dedicated prayer room in a villa, office floor or hotel",
      "Spaces where the rows must be set out accurately",
    ],
    notFor: ["General living areas"],
    specs: [
      { label: "Layouts", value: "Plain, bordered, or woven prayer rows" },
      { label: "Setting out", value: "Qibla direction measured and confirmed on site before cutting" },
      { label: "Fibres", value: "Wool and wool-blend, acrylic and polypropylene contract grades" },
    ],
    materials: ["Wool blends", "Contract-grade acrylic", "Custom-woven designs"],
    price: { basis: "per_sqm", low: 110, high: 420 },
    leadTimeDays: [15, 40],
    verify: ["Qibla direction on site", "Room geometry and row setting-out", "Cleaning and maintenance expectations"],
    faqs: [
      {
        q: "Can the rows be custom sized?",
        a: "Yes — row depth is set to the room and the expected number of worshippers. We set out the direction on site before anything is cut.",
      },
    ],
    pairsWith: ["broadloom-carpet"],
  },
  {
    slug: "wallpaper",
    name: "Wallpaper & wall finishes",
    group: "surface",
    rungs: ["manual"],
    tagline: "One wall, and the room reads differently.",
    summary:
      "Feature walls and full-room finishes — textured, printed and custom-scaled. The cheapest intervention with the largest effect on how a finished room feels.",
    solves: ["unfinished", "transformation"],
    rooms: ["bedroom", "living", "majlis", "reception", "dining", "study", "guest-room", "corridor"],
    winsWhen: [
      "A bedroom or majlis that feels flat once the furniture is in",
      "Reception and corridor walls that carry the brand or the design idea",
      "Custom-scaled murals sized to one specific wall",
    ],
    notFor: ["Damp walls and untreated substrates — the finish will fail and take the wall with it"],
    specs: [
      { label: "Types", value: "Non-woven, vinyl, textile, custom digital print" },
      { label: "Roll widths", value: "Standard 53 cm and wide-width; custom panels made to the wall" },
      { label: "Preparation", value: "Surface must be sound, dry and primed — inspected before installation" },
    ],
    materials: ["Non-woven papers", "Textile and grasscloth", "Contract vinyl", "Custom digital murals"],
    price: { basis: "per_sqm", low: 55, high: 280, note: "Supply and installation; surface preparation quoted after inspection" },
    leadTimeDays: [10, 25],
    verify: ["Wall condition, moisture and existing finish", "Exact wall dimensions for a custom-scaled print", "Socket, switch and skirting details"],
    faqs: [
      {
        q: "Will it lift in UAE humidity?",
        a: "Not if the wall is properly prepared and the right product is used for the room. Most failures we're called to fix are preparation failures, not product failures — which is why we inspect the wall before quoting.",
      },
    ],
    pairsWith: ["broadloom-carpet", "wave-curtain"],
  },
];

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}

export function solutionsByGroup(group: Group): Solution[] {
  return SOLUTIONS.filter((s) => s.group === group);
}

export function solutionName(slug: string): string {
  return getSolution(slug)?.name ?? slug;
}
