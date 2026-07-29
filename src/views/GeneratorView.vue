<script setup lang="ts">
import AirportSelector from "@/components/AirportSelector.vue";
import RccPreview from "@/components/RccPreview.vue";
import RunwayConditionFormWrapper from "@/components/condition-form/RunwayConditionFormWrapper.vue";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-vue-next";
import { useRunwayStore } from "@/stores/runway-conditions";
import {storeToRefs} from 'pinia';
import {useColorMode} from '@vueuse/core';

const store = useRunwayStore();

const { conditionString } = storeToRefs(store);

const mode = useColorMode();

function toggleTheme() {
  mode.value = mode.value === "dark" ? "light" : "dark";
}

</script>

<template>
  <main class="min-h-screen bg-muted/40 p-8">
    <div class="mx-auto max-w-4xl space-y-6">
      <section class="flex items-center gap-2">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900 shadow-sm">
          <img src="/logo.webp" class="p-1 m-2 rounded-lg">
        </div>
        <div>
          <h1 class="text-3xl font-bold">
            Runway Condition Code Generator
          </h1>

          <p class="text-muted-foreground">
            Generate ICAO runway condition reports for <a class="underline text-blue-900" href="https://vatis.app" target="_blank">vATIS</a>.
          </p>
        </div>
        <Button
            variant="ghost"
            size="icon"
            class="ml-auto"
            @click="toggleTheme"
        >
          <SunIcon v-if="mode === 'dark'" class="h-5 w-5" />
          <MoonIcon v-else class="h-5 w-5" />
        </Button>
      </section>

      <div class="grid gap-6">

        <Card>
          <CardContent>
            <AirportSelector />
          </CardContent>
        </Card>

        <RunwayConditionFormWrapper />

        <Button
            size="lg"
            @click="store.generateConditionString()"
        >
          Generate RCC
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>
              Result
            </CardTitle>
          </CardHeader>

          <CardContent>
            <RccPreview :code="conditionString"/>
          </CardContent>
        </Card>

      </div>
    </div>
  </main>
</template>