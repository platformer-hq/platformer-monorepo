<script setup lang="ts">
import type { TransitionProps } from 'vue';

import type { UseViewTransitionAnimateFn } from './UseViewTransition.vue';

defineSlots<{
  default(props: TransitionProps): void;
}>();

const animate: UseViewTransitionAnimateFn = (transition, view, el, done) => {
  const leftTransform = ['translateX(-100px)', 'translateX(0)'];
  const rightTransform = ['translateX(100%)', 'translateX(0)'];
  if (transition === 'leave') {
    [leftTransform, rightTransform].forEach(arr => arr.reverse());
  }
  el
    .animate({ transform: view === 'right' ? rightTransform : leftTransform }, {
      duration: 300,
      easing: 'ease-out',
    })
    .finished
    .then(() => {
      done();
    });
};
</script>

<template>
  <UseViewTransition
    v-slot="transitionProps"
    :before-animate="(_transition, view, el) => {
      if (view === 'right') {
        el.classList.add('ios-view-transition');
      }
    }"
    :animate="animate"
    :after-enter="(view, el) => {
      if (view === 'right') {
        el.classList.remove('ios-view-transition');
      }
    }"
  >
    <slot v-bind="transitionProps"/>
  </UseViewTransition>
</template>

<style lang="scss">
.ios-view-transition {
  top: 0;
  position: fixed;
  left: 0;
  z-index: 100;
  width: 100vw;
  bottom: 0;
  overflow: hidden;
}
</style>
