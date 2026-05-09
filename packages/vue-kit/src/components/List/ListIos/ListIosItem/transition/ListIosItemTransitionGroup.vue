<script setup lang="ts">
import type { TransitionGroupProps } from 'vue';

import { createListIosItemTransition } from './createListIosItemTransition.js';

defineProps<TransitionGroupProps>();
</script>

<template>
  <TransitionGroup v-bind="{...createListIosItemTransition(), $props}" :css="false">
    <slot/>
  </TransitionGroup>
</template>
