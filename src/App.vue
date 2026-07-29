<script setup lang="ts">
import GeneratorView from "@/views/GeneratorView.vue";
import {TooltipProvider} from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
</script>

<template>
  <TooltipProvider>
      <Toaster />
      <GeneratorView />
  </TooltipProvider>
</template>