<script setup lang="ts">
import {Card, CardContent} from '@/components/ui/card';
import {toast} from 'vue-sonner';

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
    <CardContent>
      <p
          v-if="code"
          class="font-mono text-xl font-bold"
      >
        {{ code }}
      </p>

      <p
          v-else
          class="text-muted-foreground text-center"
      >
        No RCC generated yet.
      </p>
    </CardContent>
  </Card>
</template>