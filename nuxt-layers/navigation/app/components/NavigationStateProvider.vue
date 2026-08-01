<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { provideNavigationState, type NavigationDirection } from '../provider.js';

const router = useRouter();

let prevPosition = router.options.history.state.position as number;
const direction = ref<NavigationDirection>('initial');

// Whenever the the current route changes, we update the position.
onUnmounted(
  router.afterEach(() => {
    const nextPosition = router.options.history.state.position as number;
    direction.value = nextPosition >= prevPosition ? 'forward' : 'backward';
    prevPosition = nextPosition;
  }),
);

provideNavigationState({
  direction: computed(() => direction.value),
});
</script>

<template>
  <slot/>
</template>
