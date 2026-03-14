<script setup lang="ts">
const transition = createReversibleTransition({
  animatedProperties({ el, transition }) {
    return reverseTransitionKeyframesIfLeave({
      overflow: ['hidden', 'hidden'],
      height: ['0px', el.clientHeight + 'px'],
      opacity: [0, 0, 0, 1],
    }, transition);
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
