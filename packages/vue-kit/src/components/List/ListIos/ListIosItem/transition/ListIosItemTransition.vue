<script setup lang="ts">
import type { TransitionProps } from 'vue';

import { createListIosItemTransition } from './createListIosItemTransition.js';

type Props = /* @vue-ignore */ TransitionProps;

defineProps<Props>();
</script>

<template>
  <Transition v-bind="createListIosItemTransition()" :css="false">
    <slot/>
  </Transition>
</template>
