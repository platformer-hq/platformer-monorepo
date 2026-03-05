<script setup lang="ts">
import type { TransitionProps } from 'vue';

import type { UsePageTransitionProps } from './UsePageTransition.vue';

defineSlots<{
  default(props: TransitionProps): void;
}>();

const { b } = bem('use-ios-page-transition');

const options: UsePageTransitionProps = {
  beforeAnimate({ el, page, transition }) {
    el.classList.add(...b(page, transition).split(' '));
  },
  animate({ transition, page, el, done }) {
    const leftTransform = ['-100px', '0'];
    const rightTransform = ['100%', '0'];
    if (transition === 'leave') {
      [leftTransform, rightTransform].forEach(arr => arr.reverse());
    }
    el
      .animate({ left: page === 'right' ? rightTransform : leftTransform }, {
        duration: 300,
        easing: 'ease-out',
      })
      .finished
      .then(() => {
        done();
      });
  },
  afterEnter({ el, page }) {
    el.classList.remove(...b(page, 'enter').split(' '));
  },
};
// TODO: There is probably some box shadow for the right view.
</script>

<template>
  <UsePageTransition v-slot="transitionProps" v-bind="options">
    <slot v-bind="transitionProps"/>
  </UsePageTransition>
</template>

<style lang="scss">
.use-ios-page-transition {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;

  &--right {
    z-index: 100;
  }
}
</style>
