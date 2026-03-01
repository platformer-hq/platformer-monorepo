<script setup lang="ts">
import type { TransitionProps } from 'vue';

import type { UseViewTransitionAnimateFn } from './UseViewTransition.vue';

defineSlots<{
  default(props: TransitionProps): void;
}>();

const animate: UseViewTransitionAnimateFn = (transition, view, el, done) => {
  const rightTransform = ['translateX(100%)', 'translateX(0)'];
  if (transition === 'leave') {
    rightTransform.reverse();
  }
  if (view === 'left') {
    return setTimeout(done, 300);
  }
  el
    .animate({ transform: rightTransform }, {
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
        el.classList.add('android-view-transition');
      }
    }"
    :animate="animate"
    :after-enter="(view, el) => {
      if (view === 'right') {
        el.classList.remove('android-view-transition');
      }
    }"
  >
    <slot v-bind="transitionProps"/>
  </UseViewTransition>
</template>

<style lang="scss">
.android-view-transition {
  top: 0;
  position: fixed;
  left: 0;
  z-index: 100;
  width: 100vw;
  bottom: 0;
  overflow: hidden;
}
</style>
