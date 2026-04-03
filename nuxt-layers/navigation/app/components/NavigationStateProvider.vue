<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { computed, onUnmounted, ref } from 'vue';

import { provideRoutingState, type RoutingDirection } from '../routing-state';

const router = useRouter();

let prevPosition = router.options.history.state.position as number;
const direction = ref<RoutingDirection>('initial');

// Whenever the the current route changes, we update the position.
onUnmounted(
  router.afterEach(() => {
    const nextPosition = router.options.history.state.position as number;
    direction.value = nextPosition >= prevPosition ? 'forward' : 'backward';
    prevPosition = nextPosition;
  }),
);

provideRoutingState({
  direction: computed(() => direction.value),
});
</script>

<template>
  <slot/>
</template>
