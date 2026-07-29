<script setup lang="ts">
import AirportSelector from "@/components/AirportSelector.vue";
import RccPreview from "@/components/RccPreview.vue";
import RunwayConditionFormWrapper from "@/components/condition-form/RunwayConditionFormWrapper.vue";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRunwayStore } from "@/stores/runway-conditions";
import {storeToRefs} from 'pinia';

const store = useRunwayStore();

const { conditionString } = storeToRefs(store);

</script>

<template>
  <main class="min-h-screen bg-muted/40 p-8">
    <div class="mx-auto max-w-4xl space-y-6">

      <section>
        <h1 class="text-3xl font-bold">
          Runway Condition Code Generator
        </h1>

        <p class="text-muted-foreground">
          Generate ICAO runway condition reports.
        </p>
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