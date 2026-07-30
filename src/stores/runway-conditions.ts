import { defineStore } from "pinia";
import { ref } from "vue";
import type { Airport } from "@/types/airport";
import type {RunwayCondition, RunwayConditions} from "@/types/conditions";

import { generate } from "@/lib/generator";

export const useRunwayConditionStore = defineStore("runwayConditions", () => {
  const airport = ref<Airport | null>(null);
  const metar = ref<string | null>(null);
  const runways = ref<string[]>([]);
  const selectedRunways = ref<string[]>([]);
  const conditions = ref<Record<string, RunwayConditions>>({});
  const conditionString = ref<string | null>(null);

  async function setAirport(value: Airport | null) {
    airport.value = value;

    selectedRunways.value = [];
    conditions.value = {};
    conditionString.value = null;
    metar.value = null;
    runways.value = [];

    if (!value) return;

    const response = await fetch(
      `https://metar.vatsim.net/${value.icao}`,
    );

    metar.value = await response.text();
    runways.value = value.runways;
  }

  function setRunways(value: string[]) {
    selectedRunways.value = value;
  }

  function setCondition(
    runway: string,
    section: keyof RunwayConditions,
    condition: RunwayCondition,
  ) {
    if (!conditions.value[runway]) {
      conditions.value[runway] = {} as RunwayConditions;
    }
    conditions.value[runway][section] = condition;
  }

  function setEasyCondition(
    runway: string,
    condition: RunwayCondition,
  ) {
    conditions.value[runway] = {
      tdz: condition,
      mid: { ...condition },
      end: { ...condition },
    };
  }

  function clearConditions() {
    conditions.value = {};
    conditionString.value = null;
  }

  function generateConditionString() {
    const result = generate(conditions.value);
    conditionString.value = result && result.trim().length > 0 ? result : null;
  }

  return {
    airport,
    metar,
    runways,
    selectedRunways,
    conditions,
    conditionString,

    setAirport,
    setRunways,
    setCondition,
    setEasyCondition,
    clearConditions,
    generateConditionString,
  };
});