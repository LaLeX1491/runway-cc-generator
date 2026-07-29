<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { Input } from "@/components/ui/input";

const now = ref(new Date());
let timer: number;

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

const utcTime = computed(() => {
  const date = now.value;

  const hour = pad(date.getUTCHours());
  const minute = pad(date.getUTCMinutes());
  const second = pad(date.getUTCSeconds());

  const baseMinute = pad(Math.floor(date.getUTCMinutes() / 10) * 10);

  return `${hour}:${minute}:${second} UTC (using ${hour}${baseMinute}z as generation time)`;
});

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <Input
      disabled
      :model-value="utcTime"
  />
</template>