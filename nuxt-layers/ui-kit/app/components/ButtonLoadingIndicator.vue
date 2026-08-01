<script setup lang="ts">
defineProps<{ show?: boolean }>();

const transition = createReversibleTransition({
  animatedProperties({ transition, el }) {
    return reverseTransitionKeyframesIfLeave({
      opacity: [0, 0, 1],
      transform: ['scale(0.93)', 'scale(1)'],
      marginLeft: ['0px', '8px', '8px'],
      width: ['0px', el.clientWidth + 'px'],
    }, transition);
  },
  animationOptions: {
    duration: 300,
    easing: 'ease-out',
    fill: 'both',
  },
});
</script>

<template>
  <Transition v-bind="transition" :css="false">
    <LoadingIndicator v-if="show" :size="20" class="button-loading-indicator"/>
  </Transition>
</template>

<style lang="scss">
.button-loading-indicator {
  margin-left: 8px;
}
</style>
