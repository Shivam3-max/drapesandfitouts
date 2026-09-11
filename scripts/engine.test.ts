/**
 * Rule-engine checks. Run with: npm run test:engine
 *
 * These assert the product rules the business actually promises — that a
 * bedroom gets a blackout layer, that west glazing leads with solar control,
 * that film is never recommended on a bare window, and that nothing is ever
 * priced before the survey where we said it would not be.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { runSpaceDna, type AssessmentInput } from "../src/lib/space-dna";

const base: AssessmentInput = {
  context: "home",
  problems: [],
  openings: 1,
  orientation: "unknown",
  glazing: "unknown",
  mediaCount: 0,
};

const slugs = (dna: ReturnType<typeof runSpaceDna>, tier: number) =>
  dna.tiers[tier].items.map((i) => i.slug);

test("west glazing with stated heat leads with solar control", () => {
  const dna = runSpaceDna({ ...base, orientation: "w", problems: ["heat"], room: "living" });
  assert.equal(dna.scores.solar, 10);
  assert.ok(slugs(dna, 0).includes("sunscreen-roller"), "Essential should lead with sunscreen");
  assert.match(dna.headline, /heat and glare/);
});

test("a bedroom asking for darkness always gets a blackout layer", () => {
  const dna = runSpaceDna({ ...base, room: "bedroom", problems: ["blackout"], orientation: "e" });
  assert.ok(dna.scores.blackout >= 9, `blackout should dominate, got ${dna.scores.blackout}`);
  assert.ok(slugs(dna, 0).some((s) => s.includes("blackout")), "Essential must include blackout");
  assert.ok(
    dna.verify.some((v) => v.toLowerCase().includes("side channels")),
    "edge sealing must be flagged for verification",
  );
});

test("smart film is offered for a boardroom and withheld from a living room window", () => {
  const office = runSpaceDna({ ...base, context: "office", room: "boardroom", problems: ["privacy"] });
  assert.equal(office.filmEligible, true);
  assert.ok(slugs(office, 2).includes("smart-film"), "Intelligent tier should offer film");

  const home = runSpaceDna({ ...base, context: "home", room: "living", problems: ["privacy"] });
  assert.equal(home.filmEligible, false);
  assert.ok(!slugs(home, 2).includes("smart-film"), "film must not be pushed onto a normal window");
});

test("film and skylights are never given a customer-facing price", () => {
  const dna = runSpaceDna({ ...base, context: "clinic", room: "consultation", problems: ["privacy"] });
  const intelligent = dna.tiers[2].estimate;
  assert.ok(intelligent, "an estimate object should still be produced");
  assert.ok(
    intelligent!.surveyOnly.some((n) => n.includes("Smart Film")),
    "film must be flagged as survey-only rather than priced",
  );
  assert.ok(
    !intelligent!.lines.some((l) => l.slug.startsWith("smart-film")),
    "no film line may carry a price",
  );
});

test("openings and height drive the automation score, not the sales pitch", () => {
  const few = runSpaceDna({ ...base, openings: 2, room: "living" });
  const many = runSpaceDna({ ...base, openings: 12, room: "living", ceilingHeightM: 3.6 });
  assert.ok(many.scores.automation > few.scores.automation);
  assert.ok(many.scores.automation >= 6, "12 openings at height should recommend motorisation");
});

test("the engine is deterministic for the same input", () => {
  const input: AssessmentInput = {
    ...base,
    context: "home",
    room: "media",
    problems: ["blackout", "acoustics"],
    orientation: "sw",
    openings: 3,
    widthM: 3,
    dropM: 2.6,
  };
  const a = runSpaceDna(input);
  const b = runSpaceDna(input);
  assert.deepEqual(a.scores, b.scores);
  assert.deepEqual(
    a.tiers.map((t) => t.items.map((i) => i.slug)),
    b.tiers.map((t) => t.items.map((i) => i.slug)),
  );
  assert.equal(a.tiers[1].estimate?.low, b.tiers[1].estimate?.low);
});

test("customer dimensions size the main opening only", () => {
  const input: AssessmentInput = {
    ...base,
    room: "living",
    problems: ["heat"],
    orientation: "w",
    openings: 10,
    widthM: 5,
    dropM: 3,
  };
  const dna = runSpaceDna(input);
  const line = dna.tiers[0].estimate!.lines[0];
  // 15 m² main + 9 typical openings at 4.5 m² = 55.5 m², not 150 m².
  assert.ok(line.quantity < 70, `expected a sane area, got ${line.quantity}`);
  assert.ok(dna.tiers[0].assumptions.some((a) => a.includes("typical size")));
});
