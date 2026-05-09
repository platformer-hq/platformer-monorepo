<script setup lang="ts">
import type { TransitionProps } from 'vue';

import { createListAndroidItemTransition } from './createListAndroidItemTransition.js';

defineProps<TransitionProps>();
</script>

<template>
  <Transition v-bind="{...createListAndroidItemTransition(), $props}" :css="false">
    <slot/>
  </Transition>
</template>
