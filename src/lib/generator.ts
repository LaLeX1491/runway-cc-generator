import type { RunwayCondition } from '@/types/conditions.ts';

function getUtcTime(): string {
  const now = new Date();

  const hour = now.getUTCHours().toString().padStart(2, "0");
  const minute = Math.floor(now.getUTCMinutes() / 10) * 10;

  return `${hour}${minute.toString().padStart(2, "0")}`;
}

export function generate(input: Record<string, RunwayCondition>) {
  if (Object.keys(input).length === 0) return;

  let out = "";

  for (const [idx, runway] of Object.keys(input).entries()) {
    const condition: RunwayCondition = input[runway];

    out += `${idx > 0 ? ' ' : ''}RWY COND RWY ${runway.toUpperCase()} AT TIME ${getUtcTime()} RWYCC ${condition.conditionCode}`

    if(condition.conditionCode != 6 && condition.runwaySection == "all") {
      const deposit = condition.deposit.replaceAll("_", " ").toUpperCase();

      out += ` DEPOSIT TOTAL RWY ${deposit} ${condition.percentage} PCT `
    }
  }

  console.log(out);

  return out;
}