<script setup lang="ts">
import { injectPlatform } from '@/providers/platform.js';

const platform = injectPlatform();
defineSlots<{
  ios(): any;
  android(): any;
}>();
</script>

<template>
  <slot
    v-if="platform === 'ios'"
    name="ios"
  />
  <slot
    v-else
    name="android"
  />
</template>
