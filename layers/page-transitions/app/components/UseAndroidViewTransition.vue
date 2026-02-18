<script setup lang="ts">
import type { TransitionProps } from 'vue';

import type {
  UseViewTransitionAfterEnterFn,
  UseViewTransitionAnimateFn,
  UseViewTransitionBeforeAnimateFn,
} from './UseViewTransition.vue';

defineSlots<{
  default(props: TransitionProps): void;
}>();

const animationOptions = {
  duration: 300,
  easing: 'ease-in-out',
} satisfies KeyframeEffectOptions;
const modifyClassList = (el: HTMLElement, view: 'left' | 'right', action: 'add' | 'remove') => {
  el.classList[action]('android-view-transition', `android-view-transition--${view}`);
};
const beforeAnimate: UseViewTransitionBeforeAnimateFn = (transition, view, el) => {
  modifyClassList(el, view, 'add');
  if (view === 'left') {
    el.style.top = `${-window.scrollY}px`;
  }
  if (transition === 'enter' && view === 'right') {
    el.style.opacity = '0';
  }
};
const animate: UseViewTransitionAnimateFn = (transition, viewKind, el, done) => {
  const opacity = ['0', '1'];
  const scale = ['1.02', '1'];
  if (transition === 'leave') {
    [opacity, scale].forEach(arr => arr.reverse());
  }
  return viewKind === 'left'
    ? setTimeout(() => done(), animationOptions.duration)
    : el.animate({ opacity, scale }, animationOptions).finished.then(() => {
      done();
    });
};
const afterEnter: UseViewTransitionAfterEnterFn = (view, el) => {
  modifyClassList(el, view, 'remove');
  el.style.top = '';
  el.style.opacity = '';
};
</script>

<template>
  <UseViewTransition
    v-slot="slotProps"
    :before-animate="beforeAnimate"
    :animate="animate"
    :after-enter="afterEnter"
  >
    <slot v-bind="slotProps"/>
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
  transform: translateZ(0);
  will-change: opacity, scale;

  &--right {
    z-index: 101;
  }
}
</style>
