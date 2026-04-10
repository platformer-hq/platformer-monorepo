<script setup lang="ts">
import { getIosPageTransitionOptions, getAndroidPageTransitionOptions, usePageTransition } from '@workspace/ui-kit';
import type { TransitionProps } from 'vue';

import { providePageTransition } from '../provider';

defineSlots<{
  default(props: TransitionProps): unknown;
}>();

const platform = useTmaPlatform();
const navigationDirection = useNavigationDirection();
const route = useRoute();
const enteredPage = ref(route.name);

const options = computed(() => (
  platform.value.isMappedIos
    ? getIosPageTransitionOptions()
    : getAndroidPageTransitionOptions()
));
const { transition, state } = usePageTransition(() => ({
  navigationDirection: navigationDirection.value,
  ...options.value,
  afterEnter(...args) {
    enteredPage.value = route.name;
    options.value.afterEnter(...args);
  },
}));

providePageTransition({
  state,
  enteredPage: readonly(enteredPage),
});
</script>

<template>
  <slot v-bind="transition"/>
</template>
