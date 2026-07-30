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

  // Tracks whether the user has attempted to generate a report at least once.
  const submitted = ref(false);

  async function setAirport(value: Airport | null) {
    airport.value = value;

    selectedRunways.value = [];
    conditions.value = {};
    conditionString.value = null;
    metar.value = null;
    runways.value = [];
    submitted.value = false;

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
    submitted.value = false;
  }

  function generateConditionString() {
    submitted.value = true;

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
    submitted,

    setAirport,
    setRunways,
    setCondition,
    setEasyCondition,
    clearConditions,
    generateConditionString,
  };
});