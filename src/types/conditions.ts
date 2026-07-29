type RunwayCondition = {
  runwaySection: RunwaySection,
  conditionCode: number,
  deposit: Deposit,
  percentage: number,
  time?: string | undefined,
}

type RunwaySection = "all" | "tdz" | "mid" | "end";
type Deposit = "dry" | "wet" | "frost" | "slush" | "dry_snow" | "wet_snow" | "slippery_wet" | "ice" | "compacted_snow" | "standing_water";

export type { RunwayCondition, RunwaySection, Deposit };