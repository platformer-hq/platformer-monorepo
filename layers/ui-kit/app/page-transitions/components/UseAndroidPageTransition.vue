<script setup lang="ts">
import type { TransitionProps } from 'vue';

import type { UsePageTransitionProps } from './UsePageTransition.vue';

defineSlots<{
  default(props: TransitionProps): void;
}>();
const { b } = bem('use-android-page-transition');

const options: UsePageTransitionProps = {
  beforeAnimate({ el, page, transition }) {
    el.classList.add(...b(page, transition).split(' '));
  },
  animate({ transition, page, el, done }) {
    if (page === 'left') {
      return setTimeout(done, 300);
    }
    const left = ['100%', '0'];
    el
      .animate({ left: transition === 'leave' ? left.reverse() : left }, {
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
</script>

<template>
  <UsePageTransition v-slot="transitionProps" v-bind="options">
    <slot v-bind="transitionProps"/>
  </UsePageTransition>
</template>

<style lang="scss">
.use-android-page-transition {
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
