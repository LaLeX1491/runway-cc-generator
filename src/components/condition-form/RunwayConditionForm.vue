<script setup lang="ts">

import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import type {Deposit, RunwayCondition} from '@/types/conditions.ts';
import {useRunwayConditionStore} from '@/stores/runway-conditions.ts';
import {storeToRefs} from 'pinia';
import {Separator} from "@/components/ui/separator"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {reactive, watch} from 'vue';

const props = defineProps<{
  runway: string;
  mode: "ez" | "ad";
}>();

const ezValues: {label: string, value: string, condition: RunwayCondition}[] = [
  { label: "Dry", value: "dry", condition: { conditionCode: 6, deposit: "dry", coverage: 100 }},
  { label: "Wet", value: "wet", condition: { conditionCode: 5, deposit: "wet", coverage: 100 }},
  { label: "Snow", value: "snow", condition: { conditionCode: 5, deposit: "dry_snow", coverage: 100 }},
  { label: "Slippery Wet", value: "slipwet", condition: { conditionCode: 3, deposit: "slippery_wet", coverage: 100 }}
]

type SelectOption = {
  label: string;
  value: string | number;
};

type AdFieldKey = "conditionCode" | "deposit" | "coverage";

type AdValue = {
  key: AdFieldKey;
  label: string;
  selectPlaceholder: string;
  values: SelectOption[];
};

const adValues: AdValue[] = [
  {
    key: "conditionCode",
    label: "Runway condition code",
    selectPlaceholder: "Select RWYCC",
    values: [6, 5, 4, 3, 2, 1, 0].map(value => ({
      label: value.toString(),
      value,
    })),
  },
  {
    key: "deposit",
    label: "Deposit",
    selectPlaceholder: "Select deposit",
    values: [
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
    key: "coverage",
    label: "Coverage",
    selectPlaceholder: "Select coverage",
    values: [100, 75, 50, 25].map(value => ({
      label: `${value}%`,
      value,
    })),
  },
];

type RunwayZoneKey = "tdz" | "mid" | "end";

const runwayZones: { key: RunwayZoneKey; label: string }[] = [
  { key: "tdz", label: "TDZ" },
  { key: "mid", label: "MID" },
  { key: "end", label: "END" },
];

const store = useRunwayConditionStore();

const { setCondition, setEasyCondition } = store;
const { conditions } = storeToRefs(store);

const adState = reactive<Record<RunwayZoneKey, Partial<Record<AdFieldKey, number | string>>>>({
  tdz: {},
  mid: {},
  end: {},
});

let hydrating = false;

watch(
    () => props.runway,
    (runway) => {
      hydrating = true;

      const stored = conditions.value[runway];

      for (const zone of runwayZones) {
        const zoneCondition = stored?.[zone.key];

        adState[zone.key] = zoneCondition
            ? { ...zoneCondition }
            : {};
      }

      hydrating = false;
    },
    { immediate: true },
);

watch(
    adState,
    (state) => {
      if (hydrating) return;

      for (const zone of runwayZones) {
        const draft = state[zone.key];

        if (draft.conditionCode !== undefined) {
          const code = Number(draft.conditionCode);

          if (code === 6) {
            draft.deposit = "dry";
            draft.coverage = 100;
          } else if (code !== 6 && draft.deposit === "dry" && draft.coverage === 100) {
            delete draft.deposit;
            delete draft.coverage;
          }

          if (
              draft.deposit !== undefined &&
              draft.coverage !== undefined
          ) {
            setCondition(props.runway, zone.key, {
              conditionCode: code,
              deposit: draft.deposit as Deposit,
              coverage: Number(draft.coverage),
            });
          }
        }
      }
    },
    { deep: true },
);

function isEzActive(condition: RunwayCondition) {
  const current = conditions.value[props.runway]?.tdz;
  return (
      current?.conditionCode === condition.conditionCode &&
      current?.deposit === condition.deposit
  );
}

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
          :class="isEzActive(value.condition)
          ? '!border-primary bg-primary/10 dark:bg-primary/20 !px-5'
          : ''"
          @click="setEasyCondition(runway, value.condition)"
      >
        {{value.label}}
      </Button>
    </div>
  </section>
  <section v-else>
    <div class="grid grid-cols-3">
      <div
          v-for="(zone, idx) in runwayZones"
          :key="zone.key"
          class="p-2"
          :class="idx !== 2 ? 'border-r' : ''"
      >
        <h1 class="text-center font-black text-xl pb-2">
          {{ zone.label }}
        </h1>
        <Separator />
        <template
            v-for="field in adValues"
            :key="field.label"
        >
          <div
              v-if="!(field.key !== 'conditionCode' && adState[zone.key].conditionCode === 6)"
              class="my-2"
          >
            <Label class="text-sm">{{ field.label }}</Label>
            <Select v-model="adState[zone.key][field.key]">
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
        </template>
      </div>
    </div>
  </section>
</template>