import {Airport, ConditionCode, ContaminationType} from './types';

export function getConditionCodeOptions(code: ConditionCode): ContaminationType[] {
  return CONDITION_DESCRIPTIONS[code];
}

export const CONDITION_CODES: Record<ConditionCode, string> = {
  6: "DRY",
  5: "GOOD",
  4: "GOOD TO MEDIUM",
  3: "MEDIUM",
  2: "MEDIUM TO POOR",
  1: "POOR",
  0: "LESS THAN POOR",
};

export const AIRPORTS: Airport[] = [
  {
    icao: "EDDB",
    configs: [["24L", "24R"], ["06R", "06L"]]
  },
  {
    icao: "EDDH",
    configs: [["23", "33"], ["23", "15"], ["05", "33"], ["05", "15"], ["23"], ["05"], ["33"], ["15"]]
  },
  {
    icao: "EDDV",
    configs: [["27L", "27R"], ["09R", "09L"]]
  },
  {
    icao: "EDDW",
    configs: [["27"], ["09"]]
  }
]

export const CONDITION_DESCRIPTIONS: Record<ConditionCode, ContaminationType[]> = {
  6: [
    { desc: "DRY" },
    { desc: "NR", rcamRule: "not reported" },
  ],
  5: [
    { desc: "WET", rcamRule: "Depth less than 3mm" },
    { desc: "FROST" },
    { desc: "DRY SNOW", rcamRule: "less than 3mm", looseContaminant: true, maxLooseContaminant: 3 },
    { desc: "WET SNOW", rcamRule: "less than 3mm", looseContaminant: true, maxLooseContaminant: 3 },
    { desc: "SLUSH", rcamRule: "less than 3mm", looseContaminant: true, maxLooseContaminant: 3 },
    { desc: "NR", rcamRule: "not reported" },
  ],
  4: [
    { desc: "COMPACTED SNOW", rcamRule: "OAT lower than -15°C" }
  ],
  3: [
    { desc: "DRY SNOW", rcamRule: "more than 3mm", looseContaminant: true, minLooseContaminant: 3 },
    { desc: "WET SNOW", rcamRule: "more than 3mm", looseContaminant: true, minLooseContaminant: 3 },
    { desc: "DRY SNOW ON TOP OF COMPACTED SNOW" },
    { desc: "WET SNOW ON TOP OF COMPACTED SNOW" },
    { desc: "COMPACTED SNOW", rcamRule: "OAT higher than -15°C" },
    { desc: "NR", rcamRule: "not reported" },
  ],
  2: [
    { desc: "SLUSH", rcamRule: "more than 3mm", looseContaminant: true, minLooseContaminant: 3 },
    { desc: "WATER", rcamRule: "more than 3mm", looseContaminant: true, minLooseContaminant: 3 },
    { desc: "NR", rcamRule: "not reported" },
  ],
  1: [
    { desc: "ICE" },
    { desc: "NR", rcamRule: "not reported" },
  ],
  0: [
    { desc: "WET ICE" },
    { desc: "WATER ON TOP OF COMPACTED SNOW" },
    { desc: "DRY SNOW ON TOP OF ICE" },
    { desc: "WET SNOW ON TOP OF ICE" },
    { desc: "NR", rcamRule: "not reported" },
  ]
};