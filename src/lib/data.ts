import data from './data.json';

export type Data = {
  airports: Airport[];
  contaminants: Contaminants
}
export type ConditionCode = "6" | "5" | "4" | "3" | "2" | "1" | "0";

type Contaminants = Record<ConditionCode, string[]>;
type RunwayConfig = string[];
type Airport = {
  icao: string;
  configs: RunwayConfig[];
}

const jsonData = data as Data;

export function getRunwayConfigs(icao: string): RunwayConfig[] | null {
  for (const a of jsonData.airports) {
    if(a.icao === icao) {
      return a.configs;
    }
  }
  return null;
}

export function getAllAirports(): string[] {
  const airports = [];
  for (const a of jsonData.airports) {
    airports.push(a.icao);
  }
  return airports;
}

export function getConditionCodeOptions(cc: ConditionCode): string[] {
  return jsonData.contaminants[cc];
}