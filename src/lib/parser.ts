import {
  SituationalAwarenessData,
  RunwaySnowbank,
  TaxiwaySnowbank
} from './types';

export function parseSnowBankOnRunway(snowbank: RunwaySnowbank, runway: string): string {
  const { crossPosition, leftMarginFromCL, rightMarginFromCL, alongPosition, taxiways } = snowbank;

  let output = `RWY ${runway} SNOW BANK`;

  if (crossPosition !== "NONE") {
    if (crossPosition !== "LR") {
      output += ` ${crossPosition}${
        crossPosition === "L"
          ? leftMarginFromCL?.toString()
          : rightMarginFromCL?.toString()
      } FM CL`;
    } else {
      if (leftMarginFromCL !== undefined && rightMarginFromCL !== undefined) {
        if (leftMarginFromCL === rightMarginFromCL) {
          output += leftMarginFromCL === 0 ? ` LR FM CL` : ` LR${leftMarginFromCL} FM CL`;
        } else {
          output += ` L${leftMarginFromCL} FM CL`;
          output += ` R${rightMarginFromCL} FM CL`;
        }
      } else {
        throw new Error("Cross position == LR but lr values not set");
      }
    }

    if (alongPosition) {
      if (alongPosition !== "BTN TWY") {
        output += ` FM ${alongPosition}`;
      } else {
        if (taxiways) {
          output += ` BTN TWY ${taxiways[0]} AND ${taxiways[1]}`;
        } else {
          throw new Error("Along position == BTN TWY but no taxiways set!");
        }
      }
    }
  }

  return output + ".";
}

export function parseSnowBankOnTaxiway(snowbank: TaxiwaySnowbank): string {
  const { taxiway, position, taxiways, runway } = snowbank;

  if (taxiway.length === 0) throw new Error("No taxiway set!");

  let output = `TWY ${taxiway} SNOW BANK`;

  switch (position) {
    case "FM TWY":
      if (taxiways?.[0]) {
        output += ` FM TWY ${taxiways[0]}`;
      } else throw new Error("Position == FM TWY but no taxiway set!");
      break;
    case "BTN TWY":
      if (taxiways?.[0] && taxiways?.[1]) {
        output += ` BTN TWY ${taxiways[0]} AND ${taxiways[1]}`;
      } else throw new Error("Position == BTN TWY but taxiways not set!");
      break;
    case "BTN TWY AND RWY":
      if (runway && taxiways?.[0]) {
        output += ` BTN TWY ${taxiways[0]} AND RWY ${runway}`;
      } else throw new Error("Position == BTN TWY AND RWY but no runway or taxiway set!");
      break;
  }

  return output + ".";
}

export function parseSituationalAwareness(data: SituationalAwarenessData): string {
  if (!data) return "";

  const parts: string[] = [];
  let driftingSnowIncluded = false;

  Object.entries(data.runwayItems).forEach(([runway, items]) => {
    if (items.includeItemI && items.itemI)
      parts.push(`RWY ${runway} REDUCED TO ${items.itemI} METERS.`);

    if (!driftingSnowIncluded && data.includeItemJ) {
      parts.push(`DRIFTING SNOW.`);
      driftingSnowIncluded = true;
    }

    if (items.includeItemK)
      parts.push(`RWY ${runway} LOOSE SAND.`);

    if (items.includeItemL)
      parts.push(`RWY ${runway} CHEMICALLY TREATED.`);

    if (items.includeItemM && items.itemM) {
      items.itemM
        .filter((snowbank): snowbank is RunwaySnowbank => snowbank !== null)
        .forEach(snowbank => {
          try {
            parts.push(parseSnowBankOnRunway(snowbank, runway));
          } catch (e) {
            console.error('Error parsing runway snowbank:', e);
          }
        });
    }
  });

  if (data.includeItemN && data.itemN) {
    data.itemN
      .filter((snowbank): snowbank is TaxiwaySnowbank => snowbank !== null)
      .forEach(snowbank => {
        try {
          parts.push(parseSnowBankOnTaxiway(snowbank));
        } catch (e) {
          console.error('Error parsing taxiway snowbank:', e);
        }
      });
  }

  if (data.includeItemO && data.itemO.length > 0) {
    data.itemO.forEach(runway => {
      parts.push(`RWY ${runway} ADJ SNOW BANK.`);
    });
  }

  if (data.includeItemP) {
    if (data.itemPAllTaxiways !== undefined) {
      parts.push(`ALL TWYS ${data.itemPAllTaxiways}.`);
    } else if (data.itemP) {
      data.itemP
        .filter((c): c is NonNullable<typeof c> => c !== null)
        .forEach(({ taxiway, condition }) => {
          parts.push(`TWY ${taxiway} ${condition}.`);
        });
    }
  }

  if (data.includeItemR) {
    if (data.itemRAllAprons !== undefined) {
      parts.push(`ALL APRONS ${data.itemRAllAprons}.`);
    } else if (data.itemR) {
      data.itemR
        .filter((c): c is NonNullable<typeof c> => c !== null)
        .forEach(({ apron, condition }) => {
          parts.push(`APRON ${apron} ${condition}.`);
        });
    }
  }

  if (data.itemT?.trim()) {
    parts.push(data.itemT.trim());
  }

  return parts.join(" ");
}