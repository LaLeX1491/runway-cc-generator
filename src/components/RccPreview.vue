<script setup lang="ts">
import {Card, CardContent} from '@/components/ui/card';
import {toast} from 'vue-sonner';
import {Tooltip, TooltipTrigger, TooltipContent} from '@/components/ui/tooltip';

const props = defineProps<{
  code: string;
}>();

function copyToClipboard() {
  if(props.code) {
    navigator.clipboard.writeText(props.code);
    toast.success("RCC copied to clipboard");
  }
}

</script>

<template>
  <Card :class="code ? 'cursor-pointer' : ''" @click="copyToClipboard">
    <CardContent class="text-center px-2 sm:px-6">
      <Tooltip v-if="code">
        <TooltipTrigger class="w-full">
          <p class="font-mono text-base sm:text-xl font-bold whitespace-pre-line break-words">
            {{ code }}
          </p>
        </TooltipTrigger>
        <TooltipContent>Click to copy to clipboard</TooltipContent>
      </Tooltip>

      <p
          v-else
          class="text-muted-foreground"
      >
        No RCC generated yet.
      </p>
    </CardContent>
  </Card>
</template>