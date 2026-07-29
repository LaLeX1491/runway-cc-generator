<script setup lang="ts">

import {Button} from '@/components/ui/button';
import type {RunwayCondition} from '@/types/conditions.ts';
import {useRunwayStore} from '@/stores/runway-conditions.ts';
import {storeToRefs} from 'pinia';
import {Separator} from "@/components/ui/separator"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

defineProps<{
  runway: string;
  mode: "ez" | "ad";
}>();

const ezValues: {label: string, value: string, condition: RunwayCondition}[] = [
  { label: "Dry", value: "dry", condition: { runwaySection: "all", conditionCode: 6, deposit: "dry", percentage: 100 }},
  { label: "Wet", value: "wet", condition: { runwaySection: "all", conditionCode: 5, deposit: "wet", percentage: 100 }},
  { label: "Snow", value: "snow", condition: { runwaySection: "all", conditionCode: 5, deposit: "dry_snow", percentage: 100 }},
  { label: "Slippery Wet", value: "slipwet", condition: { runwaySection: "all", conditionCode: 3, deposit: "slippery_wet", percentage: 100 }}
]

type SelectOption = {
  label: string;
  value: string | number;
};

type AdValue = {
  label: string;
  selectPlaceholder: string;
  values: SelectOption[];
};

const adValues: AdValue[] = [
  {
    label: "Runway condition code",
    selectPlaceholder: "Select RWYCC",
    values: [6, 5, 4, 3, 2, 1, 0].map(value => ({
      label: value.toString(),
      value,
    })),
  },
  {
    label: "Deposit",
    selectPlaceholder: "Select deposit",
    values: [
      "dry",
      "wet",
      "frost",
      "slush",
      "dry_snow",
      "wet_snow",
      "slippery_wet",
      "ice",
      "compacted_snow",
      "standing_water",
    ].map(value => ({
      value,
      label: value
          .replaceAll("_", " ")
          .replace(/\b\w/g, char => char.toUpperCase()),
    })),
  },
  {
    label: "Percentage",
    selectPlaceholder: "Select percentage",
    values: [100, 75, 50, 25].map(value => ({
      label: `${value}%`,
      value,
    })),
  },
];

const runwayZones = ["TDZ", "MID", "END"]

const store = useRunwayStore();

const { setCondition } = useRunwayStore();
const { conditions } = storeToRefs(store);

</script>

<template>
  <section v-if="mode == 'ez'">
    <div class="flex gap-2">
      <Button
          v-for="value in ezValues"
          variant="outline"
          :key="value.label"
          :value="value.label"
          class="grow"
          :class="conditions[runway]?.conditionCode === value.condition.conditionCode &&
        conditions[runway]?.deposit === value.condition.deposit
          ? '!border-primary bg-primary/10 dark:bg-primary/20 !px-5'
          : ''"
          @click="setCondition(runway, value.condition)"
      >
        {{value.label}}
      </Button>
    </div>
  </section>
  <section v-else>
    <div class="grid grid-cols-3">
      <div
          v-for="[idx, zone] in runwayZones.entries()"
          :key="zone"
          class="p-2"
          :class="idx !== 2 ? 'border-r' : ''"
      >
        <h1 class="text-center font-black text-xl pb-2">
          {{ zone }}
        </h1>
        <Separator />
        <div
            v-for="field in adValues"
            :key="field.label"
            class="my-2"
        >
          <Label class="text-sm">{{ field.label }}</Label>
          <Select>
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="field.selectPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                  v-for="option in field.values"
                  :key="option.value"
                  :value="option.value"
              >
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>
          <Separator class="my-2" />
        </div>
      </div>
    </div>
  </section>
</template>