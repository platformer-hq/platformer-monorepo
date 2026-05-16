<script setup lang="ts">
import type { TransitionProps } from 'vue';

import { createListAndroidItemTransition } from './createListAndroidItemTransition.js';

type Props = /* @vue-ignore */ TransitionProps;

defineProps<Props>();
</script>

<template>
  <Transition v-bind="createListAndroidItemTransition()" :css="false">
    <slot/>
  </Transition>
</template>
