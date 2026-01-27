export type ConditionCode = "6" | "5" | "4" | "3" | "2" | "1" | "0";
export type ContaminationLevel = "NR" | "25" | "50" | "75" | "100";
export type RunwayZone = "TDZ" | "MID" | "END";
export type LooseContaminationDepth = number | "NR";
export type RunwayConfig = string[];
export type ContaminationType = {
  desc: string, // description of the runway condition
  rcamRule?: string, // rcam rules (displayed in tooltip)
  looseContaminant?: boolean, // if loose contaminant (friction) has to be reported
  maxLooseContaminant?: number,
  minLooseContaminant?: number,
}
export type RunwayZoneCondition = {
  runway: string,

  runwayZone: RunwayZone,
  runwayCondition: ConditionCode,
  contaminationLevel: ContaminationLevel,
  contaminationType: string,
  looseContaminationDepth?: LooseContaminationDepth,
  applyWidth?: number,
}
export type Airport = {
  icao: string;
  configs: RunwayConfig[];
};
export type SnowbankCrossPosition = "L" | "R" | "LR" | "NONE";
export type SnowbankAlongPosition = "THR" | "MID" | "BTN TWY" | undefined;