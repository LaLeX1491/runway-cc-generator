import {SnowbankAlongPosition, SnowbankCrossPosition} from '@/lib/types';

export function parseSnowBank(
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
          output += ` LR${leftMarginFromCL} FM CL`;
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

  return output;
}