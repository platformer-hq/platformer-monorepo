<script setup lang="ts">
import type { TransitionGroupProps } from 'vue';

import { createListAndroidItemTransition } from './createListAndroidItemTransition.js';

defineProps<TransitionGroupProps>();
</script>

<template>
  <TransitionGroup v-bind="{...createListAndroidItemTransition(), $props}" :css="false">
    <slot/>
  </TransitionGroup>
</template>
