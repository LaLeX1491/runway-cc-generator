import type { RunwayConditions, RunwayCondition } from "@/types/conditions.ts";


function getUtcTime(): string {
  const now = new Date();

  const hour = now.getUTCHours().toString().padStart(2, "0");
  const minute = Math.floor(now.getUTCMinutes() / 10) * 10;

  return `${hour}${minute.toString().padStart(2, "0")}`;
}


function isDry(condition?: RunwayCondition): boolean {
  return condition?.conditionCode === 6;
}


function formatCondition(condition?: RunwayCondition): string {
  if (!condition) {
    return "";
  }

  if (condition.conditionCode === 6) {
    return "RWYCC 6 DRY";
  }

  const deposit = condition.deposit
    .replaceAll("_", " ")
    .toUpperCase();

  return `RWYCC ${condition.conditionCode} DEPOSIT ${deposit} ${condition.percentage} PCT`;
}


export function generate(
  input: Record<string, RunwayConditions>
) {
  console.log(input)
  if (Object.keys(input).length === 0) {
    return;
  }

  let out = "";

  const time = getUtcTime();


  for (const [idx, runway] of Object.keys(input).entries()) {

    const condition = input[runway];


    out += `${idx > 0 ? " " : ""}RWY COND RWY ${runway.toUpperCase()} AT TIME ${time}`;


    const { tdz, mid, end } = condition;


    if (!tdz || !mid || !end) {
      console.warn("Incomplete runway condition:", runway, condition);
      continue;
    }


    const same =
      JSON.stringify(tdz) === JSON.stringify(mid) &&
      JSON.stringify(tdz) === JSON.stringify(end);


    if (same) {
      out += ` ${formatCondition(tdz)}`;
      continue;
    }


    out += ` RWYCC`;
    out += ` TDZ ${tdz.conditionCode}`;
    out += ` MID ${mid.conditionCode}`;
    out += ` END ${end.conditionCode}`;


    if (!(isDry(tdz) && isDry(mid) && isDry(end))) {
      out += ` DEPOSIT`;

      out += ` TDZ ${tdz.deposit.replaceAll("_", " ").toUpperCase()} ${tdz.percentage} PCT`;
      out += ` MID ${mid.deposit.replaceAll("_", " ").toUpperCase()} ${mid.percentage} PCT`;
      out += ` END ${end.deposit.replaceAll("_", " ").toUpperCase()} ${end.percentage} PCT`;
    } else {
      out += ` DRY`;
    }
  }

  console.log(out);

  return out;
}