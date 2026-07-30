<script setup lang="ts">
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Badge} from '@/components/ui/badge';
import {ref, watch} from 'vue';
import {Button} from '@/components/ui/button';
import {ArrowLeftRightIcon} from "lucide-vue-next";
import {Tooltip, TooltipTrigger, TooltipContent} from '@/components/ui/tooltip';
import RunwayConditionForm from '@/components/condition-form/RunwayConditionForm.vue';
import {useRunwayConditionStore} from '@/stores/runway-conditions.ts';
import {storeToRefs} from 'pinia';
import {Accordion, AccordionItem, AccordionTrigger, AccordionContent} from '@/components/ui/accordion';
import {CircleQuestionMarkIcon} from 'lucide-vue-next';

const FORM_MODE_KEY = "rcc-form-mode";

function loadMode(): "ez" | "ad" {
  const stored = localStorage.getItem(FORM_MODE_KEY);
  return stored === "ad" ? "ad" : "ez";
}

const mode = ref<"ez" | "ad">(loadMode());

const store = useRunwayConditionStore();

const { selectedRunways } = storeToRefs(store);

watch(mode, (value) => {
  localStorage.setItem(FORM_MODE_KEY, value);
});

function toggleMode() {
  mode.value = mode.value === "ez" ? "ad" : "ez";
  store.clearConditions();
}
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between gap-2">
        <CardTitle class="flex flex-1 min-w-0 flex-wrap items-center gap-2">
          Runway Condition
          <Badge v-if="mode == 'ez'" class="bg-green-600 text-white">easy mode</Badge>
          <Tooltip v-else>
            <TooltipTrigger>
              <Badge class="bg-red-600 text-white">advanced mode</Badge>
            </TooltipTrigger>
            <TooltipContent>Advanced mode should only be used if your input data is correct and realistic.</TooltipContent>
          </Tooltip>
        </CardTitle>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" class="shrink-0" @click="toggleMode">
              <ArrowLeftRightIcon class="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Switch form mode
          </TooltipContent>
        </Tooltip>
      </div>
      <Accordion type="single" collapsible class="border px-2 sm:px-4 rounded-xl">
        <AccordionItem value="faq" class="border-b last:border-b-0">
          <AccordionTrigger class="flex items-center">
            <div class="flex gap-2 items-center">
              <CircleQuestionMarkIcon :size="16" /> <span>FAQ</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Accordion collapsible class="px-2 sm:px-4 border-l">
              <AccordionItem value="diff">
                <AccordionTrigger class="text-left">What is the difference between easy and advanced mode?</AccordionTrigger>
                <AccordionContent>In the advanced mode, you can put in your own values for the condition code, deposit and contamination. But be careful: the advanced mode should only be used if the input data is correct and realistic.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="ez-howtoselect">
                <AccordionTrigger class="text-left">How to decide the runway condition in the easy mode?</AccordionTrigger>
                <AccordionContent>Use the latest METARs to determine the precipitation. You can also check the real-world D-ATIS but this data might be outdated. Select the surface condition as follows:<br><br><b>DRY = RWYCC 6 = No precipitation</b><br><b>WET = RWYCC 5 = RA, DZ or BR</b><br><b>SNOW = RWYCC 5 = SN, SG</b><br><b>Slippery Wet = RWYCC 3 = PL, GR, GS</b><br><br>For RWYCCs worse than 3, use the advanced mode. In general, moisture on the runway will only lead to RWYCC 5. Worse is possible, but unlikely.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="vatis">
                <AccordionTrigger class="text-left">How to put the RWYCC in my atis?</AccordionTrigger>
                <AccordionContent><img src="/vatis-example.png" class="mt-2 border-2 rounded-md w-full h-auto max-w-md" alt="vatis explanation"></AccordionContent>
              </AccordionItem>
              <AccordionItem value="dmhs">
                <AccordionTrigger class="text-left">Stil unsure? Use the decision making helpsheet.</AccordionTrigger>
                <AccordionContent><img src="/decision-making-helpsheet.png" class="w-full h-auto" alt="Decision making helpsheet"></AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardHeader>

    <CardContent>
      <Tabs v-if="selectedRunways.length > 0">
        <TabsList class="w-full h-auto flex-wrap justify-start gap-1">
          <TabsTrigger v-for="runway in selectedRunways" :key="runway" :value="runway">Runway {{runway}}</TabsTrigger>
        </TabsList>
        <TabsContent v-for="runway in selectedRunways" :key="runway" :value="runway">
          <RunwayConditionForm :runway="runway" :mode="mode" />
        </TabsContent>
      </Tabs>
      <Tabs v-else>
        <TabsList class="w-full">
          Select active runways
        </TabsList>
      </Tabs>
    </CardContent>
  </Card>
</template>