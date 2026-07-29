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
    const cc = cond.tdz.conditionCode;
    return cc === 6 ? `RWYCC 6 DRY` : `RWYCC ${cc}`;
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
    const lines = [
      `RWY COND RWY ${runway} AT TIME ${time}`,
      buildRwyccLine(condition),
    ];

    const depositLine = buildDepositLine(condition);
    if (depositLine) lines.push(depositLine);

    blocks.push(lines.join("\n"));
  }

  return blocks.join("\n\n");
}