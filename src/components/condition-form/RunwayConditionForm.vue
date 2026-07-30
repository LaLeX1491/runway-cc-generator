<script setup lang="ts">

import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import type {Deposit, RunwayCondition} from '@/types/conditions.ts';
import {useRunwayConditionStore} from '@/stores/runway-conditions.ts';
import {storeToRefs} from 'pinia';
import {Separator} from "@/components/ui/separator"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {reactive, watch, computed} from 'vue';
import {TriangleAlertIcon} from 'lucide-vue-next';

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
const { conditions, submitted } = storeToRefs(store);

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

// Easy mode: incomplete simply means "nothing picked yet" for this runway.
// Reads directly from the store (source of truth), not local component state.
const isEzIncomplete = computed(() => {
  const stored = conditions.value[props.runway];
  return !stored || !stored.tdz;
});

// Advanced mode: a zone is incomplete once the user picked a conditionCode
// but hasn't finished deposit/coverage yet.
function isZoneIncomplete(zone: RunwayZoneKey): boolean {
  const draft = adState[zone];

  if (draft.conditionCode === undefined || draft.conditionCode === null) return false;

  return draft.deposit === undefined || draft.coverage === undefined;
}

const incompleteZones = computed(() =>
    runwayZones.filter(zone => isZoneIncomplete(zone.key)),
);

const showEzWarning = computed(() => submitted.value && isEzIncomplete.value);
const showAdWarning = computed(() => submitted.value && incompleteZones.value.length > 0);

</script>

<template>
  <section v-if="mode == 'ez'">
    <div
        v-if="showEzWarning"
        class="mb-2 flex items-center gap-2 rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400"
    >
      <TriangleAlertIcon class="size-4 shrink-0" />
      <span>Please select a surface condition — this runway will be skipped from the report until then.</span>
    </div>
    <div class="flex flex-wrap gap-2">
      <Button
          v-for="value in ezValues"
          variant="outline"
          :key="value.label"
          :value="value.label"
          class="grow basis-[calc(50%-0.25rem)] sm:basis-0"
          :class="isEzActive(value.condition)
            ? '!border-primary bg-primary/10 dark:bg-primary/20 !px-5'
            : (showEzWarning ? '!border-amber-500' : '')"
          @click="setEasyCondition(runway, value.condition)"
      >
        {{value.label}}
      </Button>
    </div>
  </section>
  <section v-else>
    <div
        v-if="showAdWarning"
        class="mb-2 flex items-center gap-2 rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400"
    >
      <TriangleAlertIcon class="size-4 shrink-0" />
      <span>
        Please complete deposit and coverage for {{ incompleteZones.map(z => z.label).join(", ") }} — this runway will be skipped from the report until then.
      </span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3">
      <div
          v-for="(zone, idx) in runwayZones"
          :key="zone.key"
          class="p-2"
          :class="[
            idx !== 2 ? 'border-b sm:border-b-0 sm:border-r' : '',
            submitted && isZoneIncomplete(zone.key) ? 'bg-amber-500/5 rounded-md' : '',
          ]"
      >
        <h1 class="text-center font-black text-xl pb-2 flex items-center justify-center gap-1">
          {{ zone.label }}
          <TriangleAlertIcon v-if="submitted && isZoneIncomplete(zone.key)" class="size-4 text-amber-500" />
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
              <SelectTrigger
                  class="w-full"
                  :class="submitted && adState[zone.key].conditionCode !== undefined && adState[zone.key][field.key] === undefined
                  ? '!border-amber-500 focus-visible:ring-amber-500/50'
                  : ''"
              >
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