<script setup lang="ts">
import { watch } from "vue";

import { Button } from "@/components/ui/button";
import { useRunwayStore } from "@/stores/runway-conditions.ts";
import {storeToRefs} from 'pinia';


const props = defineProps<{
  runways: string[];
}>();


const store = useRunwayStore();

const { selectedRunways } = storeToRefs(store);

function oppositeRunway(runway: string): string {
  const match = runway.match(/^(\d{1,2})([LRC]?)$/);

  if (!match) {
    return runway;
  }

  const [, number, side] = match;

  const oppositeDirection = String(
      (Number(number) + 18) % 36,
  ).padStart(2, "0");


  let oppositeSide = "";

  if (side === "L") {
    oppositeSide = "R";
  } else if (side === "R") {
    oppositeSide = "L";
  } else if (side === "C") {
    oppositeSide = "C";
  }


  return `${oppositeDirection}${oppositeSide}`;
}


function availableRunways(): string[] {
  return [
    ...props.runways,
    ...props.runways.map(oppositeRunway),
  ].filter(
      (value, index, array) =>
          array.indexOf(value) === index,
  );
}

function toggleRunway(runway: string) {
  const opposite = oppositeRunway(runway);

  selectedRunways.value = selectedRunways.value.filter(
      (item) => item !== opposite,
  );

  if (selectedRunways.value.includes(runway)) {
    selectedRunways.value =
        selectedRunways.value.filter(
            (item) => item !== runway,
        );
  } else {
    selectedRunways.value.push(runway);
  }


  store.setRunways(selectedRunways.value);
}


watch(
    () => props.runways,
    () => {
      selectedRunways.value = [];
      store.setRunways([]);
    },
);
</script>


<template>
  <div class="flex gap-2">
    <Button
        v-for="runway in availableRunways()"
        :key="runway"
        variant="outline"
        class="grow"
        :class="[
        selectedRunways.includes(runway)
          ? '!border-primary bg-primary/10 dark:bg-primary/20 !px-5'
          : '',
        ]"
        @click="toggleRunway(runway)"
    >
      RWY {{ runway }}
    </Button>
  </div>
</template>