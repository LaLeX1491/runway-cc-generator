import {SnowbankAlongPosition, SnowbankCrossPosition, TaxiwaySnowbankPosition} from '@/lib/types';

export function parseSnowBankOnRunway(
  runway: string,
  crossPosition: SnowbankCrossPosition,
  leftMarginFromCL?: number,
  rightMarginFromCL?: number,
  alongPosition?: SnowbankAlongPosition,
  taxiways?: [string, string],
): string {
  let output = `RWY ${runway} SNOW BANK`;

  if(crossPosition !== "NONE") {
    if(crossPosition !== "LR") {
      output += ` ${crossPosition}${
        crossPosition === "L" 
          ? leftMarginFromCL?.toString() 
          : rightMarginFromCL?.toString()
      } FM CL`;
    } else {
      if(leftMarginFromCL && rightMarginFromCL || leftMarginFromCL === 0 || rightMarginFromCL === 0) {

        if(leftMarginFromCL === rightMarginFromCL) {
          if(leftMarginFromCL === 0) {
            output += ` LR FM CL`;
          } else {
            output += ` LR${leftMarginFromCL} FM CL`;
          }
        } else {
          output += ` L${leftMarginFromCL} FM CL`;
          output += ` R${rightMarginFromCL} FM CL`;
        }
      } else throw new Error("Cross position == LR but lr values not set");
    }


    if(alongPosition) {
      if(alongPosition !== "BTN TWY") {
        output += ` FM ${alongPosition}`
      } else {
        if (taxiways) {
          output += ` BTN TWY ${taxiways[0]} AND ${taxiways[1]}`;
        } else throw new Error("Along position == BTN TWY but no taxiways set!");
      }
    }
  }

  return output += ".";
}

export function parseSnowBankOnTaxiway(
  taxiway: string,
  position: TaxiwaySnowbankPosition,
  taxiways?: [string, string | undefined],
  runway?: string,
): string {
  if(taxiway.length === 0) throw new Error("No taxiway set!");

  let output = `TWY ${taxiway} SNOW BANK`;

  switch(position) {
    case "FM TWY":
      if(taxiways && taxiways[0]) {
        output += ` FM TWY ${taxiways?.[0]}`;
      } else throw new Error("Position == FM TWY but no taxiway set!");
      break;
    case "BTN TWY":
      if(taxiways && taxiways[0] && taxiways?.[1]) {
        output += ` BTN TWY ${taxiways[0]} AND ${taxiways[1]}`;
      } else throw new Error("Position == BTN TWY but taxiways not set!");
      break;
    case "BTN TWY AND RWY":
      if(runway && taxiways && taxiways[0]) {
        output += ` BTN TWY ${taxiways[0]} AND RWY ${runway}`;
      } else throw new Error("Position == BTN TWY AND RWY but no runway or taxiway set!");
      break;
  }

  return output += ".";
}