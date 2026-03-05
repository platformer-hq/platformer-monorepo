<script setup lang="ts">
import { useScrollLock } from '@vueuse/core';
import type { TransitionProps } from 'vue';

import type { RoutingDirection } from '#layers/navigation';

import { providePageTransition } from '../provider';

type TransitionType = 'enter' | 'leave';
type PageType = 'left' | 'right';
export type PageTransitionState = 'before-enter' | 'entering' | 'entered';

export interface UsePageTransitionBeforeAnimateFn {
  (options: {
    transition: TransitionType;
    page: PageType;
    el: HTMLElement;
  }): void;
}
export interface UsePageTransitionAfterEnterFn {
  (options: {
    page: PageType;
    el: HTMLElement;
  }): void;
}
export interface UsePageTransitionAnimateFn {
  (options: {
    transition: TransitionType;
    page: PageType;
    el: HTMLElement;
    done: VoidFunction;
  }): void;
}
export interface UsePageTransitionProps {
  beforeAnimate?: UsePageTransitionBeforeAnimateFn;
  animate?: UsePageTransitionAnimateFn;
  afterEnter?: UsePageTransitionAfterEnterFn;
}

const props = defineProps<UsePageTransitionProps>();
defineSlots<{
  default(props: TransitionProps): void;
}>();

const detectPageType = (direction: RoutingDirection, transition: TransitionType): PageType => {
  return transition === 'enter'
    ? direction === 'forward' ? 'right' : 'left'
    : direction === 'forward' ? 'left' : 'right';
};

const routingDirection = useNavigationDirection();
const scrollLock = useScrollLock(window);
const route = useRoute();
const state = ref<PageTransitionState>(
  // On the initial direction transition hooks will not be called. This means, that not
  // setting the state to "entered", the value will hang on the "before-enter" value.
  routingDirection.value === 'initial'
    ? 'entered'
    : 'before-enter',
);
const enteredPage = ref<string | symbol | undefined>(route.name);

const onBeforeEnter = (el: Element) => {
  if (routingDirection.value === 'initial') {
    return;
  }
  state.value = 'before-enter';
  props.beforeAnimate?.({
    transition: 'enter',
    page: detectPageType(routingDirection.value, 'enter'),
    el: el as HTMLElement,
  });
  scrollLock.value = true;
};
const onEnter: TransitionProps['onEnter'] = (el, done) => {
  if (routingDirection.value === 'initial' || !props.animate) {
    return done();
  }
  state.value = 'entering';
  props.animate?.({
    transition: 'enter',
    page: detectPageType(routingDirection.value, 'enter'),
    el: el as HTMLElement,
    done,
  });
};
const onAfterEnter: TransitionProps['onAfterEnter'] = el => {
  props.afterEnter?.({
    page: detectPageType(routingDirection.value, 'enter'),
    el: el as HTMLElement,
  });
  scrollLock.value = false;
  state.value = 'entered';
  enteredPage.value = route.name;
};
const onBeforeLeave: TransitionProps['onBeforeLeave'] = el => {
  props.beforeAnimate?.({
    transition: 'leave',
    page: detectPageType(routingDirection.value, 'leave'),
    el: el as HTMLElement,
  });
};
const onLeave: TransitionProps['onLeave'] = (el, done) => {
  if (!props.animate) {
    return done();
  }
  props.animate?.({
    transition: 'leave',
    page: detectPageType(routingDirection.value, 'leave'),
    el: el as HTMLElement,
    done,
  });
};

providePageTransition({
  state: computed(() => state.value),
  enteredPage: computed(() => enteredPage.value),
});
</script>

<template>
  <slot
    :css="false"
    v-bind="{
      onBeforeEnter,
      onEnter,
      onAfterEnter,
      onBeforeLeave,
      onLeave,
    }"
  />
</template>
