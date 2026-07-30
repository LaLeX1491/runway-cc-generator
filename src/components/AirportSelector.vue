<script setup lang="ts">
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

import airportsData from "@/data/airports.json";
import type { Airport } from "@/types/airport";
import type { AcceptableValue } from "reka-ui";
import { useRunwayConditionStore } from "@/stores/runway-conditions";
import Time from '@/components/Time.vue';
import RunwaySelector from '@/components/RunwaySelector.vue';

const airports = airportsData as Record<string, Airport>;
const airportOptions = Object.values(airports);

const store = useRunwayConditionStore();

function onAirportChange(value: AcceptableValue) {
  store.setAirport(value as Airport | null);
}
</script>

<template>
  <section class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="space-y-2">
      <div>
        <Select
            :model-value="store.airport"
            @update:model-value="onAirportChange"
        >
          <Label class="mb-1">
            Airport and runways
          </Label>

          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select airport" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>FIR EDWW</SelectLabel>

              <SelectItem
                  v-for="airport in airportOptions"
                  :key="airport.icao"
                  :value="airport"
              >
                {{ airport.label }}
              </SelectItem>

            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <RunwaySelector
          v-if="store.runways.length"
          :runways="store.runways"
      />
      <Input
          v-else
          disabled
          placeholder="No airport selected"
      />
    </div>

    <div class="space-y-2">
      <div>
        <Label class="mb-1">
          METAR and time
        </Label>

        <Tooltip class="w-full">
          <TooltipTrigger class="w-full">
            <Input
                disabled
                class="truncate"
                :model-value="store.metar ?? 'No airport selected'"
            />
          </TooltipTrigger>

          <TooltipContent v-if="store.metar">
            METAR {{ store.metar }}
          </TooltipContent>
        </Tooltip>
      </div>

      <Time />
    </div>
  </section>
</template>