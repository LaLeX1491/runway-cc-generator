<script setup lang="ts">
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Badge} from '@/components/ui/badge';
import {ref} from 'vue';
import {Button} from '@/components/ui/button';
import {ArrowLeftRightIcon} from "lucide-vue-next";
import {Tooltip, TooltipTrigger, TooltipContent} from '@/components/ui/tooltip';
import RunwayConditionForm from '@/components/condition-form/RunwayConditionForm.vue';
import {useRunwayConditionStore} from '@/stores/runway-conditions.ts';
import {storeToRefs} from 'pinia';
import {Accordion, AccordionItem, AccordionTrigger, AccordionContent} from '@/components/ui/accordion';
import {CircleQuestionMarkIcon} from 'lucide-vue-next';

const mode = ref<"ez" | "ad">("ez");

function toggleMode() {
  mode.value = mode.value === "ez" ? "ad" : "ez";
}

const store = useRunwayConditionStore();

const { selectedRunways } = storeToRefs(store);

</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex justify-between items-center">
        <CardTitle>
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
            <Button variant="ghost" @click="toggleMode">
              <ArrowLeftRightIcon class="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Switch form mode
          </TooltipContent>
        </Tooltip>
      </div>
      <Accordion type="single" collapsible class="border px-4 rounded-xl">
        <AccordionItem value="faq" class="border-b last:border-b-0">
          <AccordionTrigger class="flex items-center">
            <div class="flex gap-2 items-center">
              <CircleQuestionMarkIcon :size="16" /> <span>FAQ</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Accordion collapsible class="px-4 border-l">
              <AccordionItem value="diff">
                <AccordionTrigger>What is the difference between easy and advanced mode?</AccordionTrigger>
                <AccordionContent>In the advanced mode, you can put in your own values for the condition code, deposit and contamination. But be careful: the advanced mode should only be used if the input data is correct and realistic.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="ez-howtoselect">
                <AccordionTrigger>How to decide the runway condition in the easy mode?</AccordionTrigger>
                <AccordionContent>Use the latest METARs to determine the precipitation. You can also check the real-world D-ATIS but this data might be outdated. Select the surface condition as follows:<br><br>DRY = RWYCC 6 = No precipitation<br>WET = RWYCC 5 = RA, DZ or BR<br>SNOW = RWYCC 5 = SN, SG<br>Slippery Wet = RWYCC 3 = PL, GR, GS<br><br>For RWYCCs worse than 3, use the advanced mode. In general, moisture on the runway will only lead to RWYCC 5. Worse is possible, but unlikely.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="vatis">
                <AccordionTrigger>How to get the RWYCC in my atis?</AccordionTrigger>
                <AccordionContent>Paste the result in the airport conditions window of vATIS.<img src="/vatis-example.png" class="mt-2 border-2 rounded-md"></AccordionContent>
              </AccordionItem>
              <AccordionItem value="dmhs">
                <AccordionTrigger>Stil unsure? Use the decision making helpsheet.</AccordionTrigger>
                <AccordionContent><img src="/decision-making-helpsheet.png"></AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardHeader>

    <CardContent>
      <Tabs v-if="selectedRunways.length > 0">
        <TabsList class="w-full">
          <TabsTrigger v-for="runway in selectedRunways" :value="runway">Runway {{runway}}</TabsTrigger>
        </TabsList>
        <TabsContent v-for="runway in selectedRunways" :value="runway">
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