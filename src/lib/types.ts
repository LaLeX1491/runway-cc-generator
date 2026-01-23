export type Airports = Record<string, {runways: string[]; }>;

export type Contaminants = Record<"0" | "1" | "2" | "3" | "4" | "5" | "6", string[]>;

export type Options = {
  airports: Airports;
  contaminants: Contaminants;
};
