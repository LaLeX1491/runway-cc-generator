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


const mode = ref<"ez" | "ad">("ez");

function toggleMode() {
  mode.value = mode.value === "ez" ? "ad" : "ez";
}

const store = useRunwayConditionStore();

const { selectedRunways } = storeToRefs(store);

</script>

<template>
  <Card>
    <CardHeader class="flex justify-between items-center">
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