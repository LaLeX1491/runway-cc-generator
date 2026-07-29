import { defineStore } from "pinia";
import { ref } from "vue";
import type { Airport } from "@/types/airport";
import type { RunwayCondition } from "@/types/conditions";

import { generate } from "@/lib/generator";

export type RunwayConditions = {
  tdz: RunwayCondition;
  mid: RunwayCondition;
  end: RunwayCondition;
}

export const useRunwayConditionStore = defineStore("runwayConditions", () => {
  const airport = ref<Airport | null>(null);
  const metar = ref<string | null>(null);
  const runways = ref<string[]>([]);
  const selectedRunways = ref<string[]>([]);
  const conditions = ref<Record<string, RunwayCondition>>({});
  const conditionString = ref<string | null>(null);

  async function setAirport(value: Airport | null) {
    airport.value = value;

    selectedRunways.value = [];
    conditions.value = {};
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
    condition: RunwayCondition,
  ) {
    conditions.value[runway] = condition;
  }

  function generateConditionString() {
    conditionString.value = generate(conditions.value) ?? null;
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
    generateConditionString,
  };
});