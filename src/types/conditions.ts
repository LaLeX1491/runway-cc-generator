type RunwayCondition = {
  conditionCode: number,
  deposit: Deposit,
  coverage: number,
  time?: string | undefined,
}

export type RunwayConditions = {
  tdz: RunwayCondition;
  mid: RunwayCondition;
  end: RunwayCondition;
}

type Deposit = "dry" | "wet" | "frost" | "slush" | "dry_snow" | "wet_snow" | "slippery_wet" | "ice" | "compacted_snow" | "standing_water";

export type { RunwayCondition, Deposit };