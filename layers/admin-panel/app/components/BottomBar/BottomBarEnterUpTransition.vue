<script setup lang="ts">
const transition = createReversibleTransition({
  animatedProperties: {
    transform: ['translateY(100%)', 'translateY(0)'],
    opacity: [0, 0, 1],
  },
  animationOptions: {
    duration: 500,
    easing: 'ease-in-out',
  },
});
</script>

<template>
  <Transition v-bind="transition" :css="false">
    <slot/>
  </Transition>
</template>
