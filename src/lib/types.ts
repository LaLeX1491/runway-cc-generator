export type ConditionCode = 6 | 5 | 4 | 3 | 2 | 1 | 0;
export type ContaminationLevel = "NR" | "25" | "50" | "75" | "100";
export type RunwayZone = "TDZ" | "MID" | "END" | "ALL";
export type LooseContaminationDepth = number | "NR";
export type RunwayConfig = string[];
export type ContaminationType = {
  desc: string;
  rcamRule?: string;
  looseContaminant?: boolean;
  maxLooseContaminant?: number;
  minLooseContaminant?: number;
}
export type RunwayZoneCondition = {
  runway: string;
  runwayZone: RunwayZone;
  runwayCondition: ConditionCode;
  contaminationLevel: ContaminationLevel;
  looseContaminationDepth?: LooseContaminationDepth;
  applyWidth?: number;
}
export type Airport = {
  icao: string;
  configs: RunwayConfig[];
};
export type SnowbankCrossPosition = "L" | "R" | "LR" | "NONE";
export type SnowbankAlongPosition = "THR" | "MID" | "BTN TWY" | undefined;
export type TaxiwaySnowbankPosition = "BTN TWY" | "FM TWY" | "BTN TWY AND RWY" | undefined;

export type RunwaySnowbank = {
  crossPosition: SnowbankCrossPosition;
  leftMarginFromCL?: number;
  rightMarginFromCL?: number;
  alongPosition?: SnowbankAlongPosition;
  taxiways?: [string, string];
}

export type TaxiwaySnowbank = {
  taxiway: string;
  position?: TaxiwaySnowbankPosition;
  taxiways?: [string, string | undefined];
  runway?: string;
}

export type TaxiwayCondition = {
  taxiway: string;
  condition: ConditionCode;
}

export type ApronCondition = {
  apron: string;
  condition: ConditionCode;
}

export type RunwayItemsFormState = {
  includeItemI: boolean;
  itemI?: number;
  includeItemJ: boolean;
  includeItemK: boolean;
  includeItemL: boolean;
  includeItemM: boolean;
  itemM?: RunwaySnowbank[];
}

export interface SituationalAwarenessData {
  runwayItems: Record<string, RunwayItemsFormState>;
  includeItemJ: boolean;
  includeItemN: boolean;
  itemN: TaxiwaySnowbank[];
  includeItemO: boolean;
  itemO: string[];
  includeItemP: boolean;
  itemP: TaxiwayCondition[];
  itemPAllTaxiways?: ConditionCode;
  includeItemR: boolean;
  itemR: ApronCondition[];
  itemRAllAprons?: ConditionCode;
  itemT: string;
}

export type RunwayZoneConditionMap = Record<string, Record<RunwayZone, RunwayZoneCondition>>;

export type ParsedOutput = {
  snowtam: string;
  atis: string;
  situationalAwareness: string;
}