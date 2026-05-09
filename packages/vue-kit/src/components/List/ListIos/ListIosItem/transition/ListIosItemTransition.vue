<script setup lang="ts">
import type { TransitionProps } from 'vue';

import { createListIosItemTransition } from './createListIosItemTransition.js';

defineProps<TransitionProps>();
</script>

<template>
  <Transition v-bind="{...createListIosItemTransition(), ...$props}" :css="false">
    <slot/>
  </Transition>
</template>
