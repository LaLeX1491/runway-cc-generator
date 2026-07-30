import type {RunwayConditions, Deposit} from "@/types/conditions.ts";

type Condition = RunwayConditions["tdz"];
type Section = "TDZ" | "MID" | "END";

function getUtcTime(): string {
  const now = new Date();

  const hour = now.getUTCHours().toString().padStart(2, "0");
  const minute = Math.floor(now.getUTCMinutes() / 10) * 10;

  return `${hour}${minute.toString().padStart(2, "0")}`;
}

function formatDeposit(input: Deposit): string {
  return input.replaceAll("_", " ").toUpperCase();
}

// A single third is only usable once conditionCode, deposit, AND coverage
// are all present. code=6 (dry) still requires deposit/coverage to be set
// (the store is expected to auto-fill "dry"/100 in that case), so this
// check stays uniform across all condition codes.
function isSectionComplete(section: Condition | undefined | null): section is Condition {
  return (
    !!section &&
    section.conditionCode !== undefined &&
    section.conditionCode !== null &&
    section.deposit !== undefined &&
    section.deposit !== null &&
    section.coverage !== undefined &&
    section.coverage !== null
  );
}

// A condition is only usable once all three thirds have been fully set
// with conditionCode, deposit, AND coverage. Partially filled state
// (e.g. only conditionCode chosen, deposit/coverage still empty) must
// never reach the line builders below, since they assume every field exists.
function isComplete(cond: RunwayConditions | undefined | null): cond is RunwayConditions {
  return (
    !!cond &&
    isSectionComplete(cond.tdz) &&
    isSectionComplete(cond.mid) &&
    isSectionComplete(cond.end)
  );
}

function sameCC(cond: RunwayConditions): boolean {
  return cond.tdz.conditionCode === cond.mid.conditionCode && cond.tdz.conditionCode === cond.end.conditionCode;
}

function sameDeposit(cond: RunwayConditions): boolean {
  return cond.tdz.deposit === cond.mid.deposit && cond.tdz.deposit === cond.end.deposit;
}

function sameCoverage(cond: RunwayConditions): boolean {
  return cond.tdz.coverage === cond.mid.coverage && cond.tdz.coverage === cond.end.coverage;
}

function getSections(cond: RunwayConditions): Array<[Section, Condition]> {
  return [
    ["TDZ", cond.tdz],
    ["MID", cond.mid],
    ["END", cond.end],
  ];
}

// RWYCC line only reflects the friction/condition code per third.
// It is intentionally independent from the deposit/coverage line below,
// since two thirds can share the same deposit but still report a different RWYCC.
function buildRwyccLine(cond: RunwayConditions): string {
  if (sameCC(cond)) {
    return `RWYCC ${cond.tdz.conditionCode}`;
  }

  return `RWYCC ${getSections(cond)
    .map(([label, c]) => `${label} ${c.conditionCode}`)
    .join(" ")}`;
}

// Deposit line groups by deposit type + coverage percentage, NOT by RWYCC.
// Reasoning: RWYCC can differ per third (e.g. TDZ 5 / MID 4 / END 4) while the
// physical deposit (e.g. FROST 75 PCT) is identical across the whole runway.
// German ATIS phrasing collapses that case to "DEPOSIT TOTAL RWY ..." regardless
// of whether the RWYCC line above was uniform or split.
function buildDepositLine(cond: RunwayConditions): string | null {
  const sections = getSections(cond);

  // Entire runway dry (CC 6 everywhere) -> no deposit/coverage reported at all.
  const allDry = sections.every(([, c]) => c.conditionCode === 6);
  if (allDry) return null;

  // Same deposit type AND same coverage across all three thirds -> collapse to TOTAL RWY,
  // even if the RWYCC values themselves differ between thirds.
  if (sameDeposit(cond) && sameCoverage(cond)) {
    return `DEPOSIT TOTAL RWY ${formatDeposit(cond.tdz.deposit)} ${cond.tdz.coverage} PCT`;
  }

  // Otherwise report each third individually, skipping dry thirds (CC 6) since
  // dry sections carry no deposit/coverage by definition.
  const wetSections = sections.filter(([, c]) => c.conditionCode !== 6);
  return `DEPOSIT ${wetSections
    .map(([label, c]) => `${label} ${formatDeposit(c.deposit)} ${c.coverage} PCT`)
    .join(" ")}`;
}

export function generate(input: Record<string, RunwayConditions>): string | undefined {
  if (Object.keys(input).length === 0) return;

  const time = getUtcTime();
  const blocks: string[] = [];

  for (const [runway, condition] of Object.entries(input)) {
    // Skip runways whose condition isn't fully filled out yet (missing
    // conditionCode, deposit, or coverage on any third) instead of throwing —
    // a partially configured runway simply doesn't contribute a block.
    if (!isComplete(condition)) continue;

    // All parts of a single runway's report stay on one line (space-separated).
    // Line breaks are only inserted between different runways (see join below).
    const parts = [
      `RWY COND RWY ${runway} AT TIME ${time}`,
      buildRwyccLine(condition),
    ];

    const depositLine = buildDepositLine(condition);
    if (depositLine) parts.push(depositLine);

    blocks.push(parts.join(" "));
  }

  if (blocks.length === 0) return;

  return blocks.join("\n");
}