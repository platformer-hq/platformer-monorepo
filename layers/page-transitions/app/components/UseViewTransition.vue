<script setup lang="ts">
import { useScrollLock } from '@vueuse/core';
import type { TransitionProps } from 'vue';

import { useNavigationDirection, type RoutingDirection } from '#layers/navigation';

import { provideViewTransition } from '../provider';

type TransitionType = 'enter' | 'leave';
type ViewType = 'left' | 'right';

export interface UseViewTransitionBeforeAnimateFn {
  (transition: TransitionType, view: ViewType, el: HTMLElement): void;
}
export interface UseViewTransitionAfterEnterFn {
  (view: ViewType, el: HTMLElement): void;
}
export interface UseViewTransitionAnimateFn {
  (
    transition: TransitionType,
    view: ViewType,
    el: HTMLElement,
    done: VoidFunction,
  ): void;
}

const props = defineProps<{
  beforeAnimate?: UseViewTransitionBeforeAnimateFn;
  animate?: UseViewTransitionAnimateFn;
  afterEnter?: UseViewTransitionAfterEnterFn;
}>();
defineSlots<{
  default(props: TransitionProps): void;
}>();

const routingDirection = useNavigationDirection();
const scrollLock = useScrollLock(window);
const state = ref<'before-enter' | 'entering' | 'entered'>(
  // On the initial direction transition hooks will not be called. This means, that not
  // setting the state to "entered", the value will hang on the "before-enter" value.
  routingDirection.value === 'initial'
    ? 'entered'
    : 'before-enter',
);

const getViewType = (direction: RoutingDirection, transition: TransitionType): ViewType => {
  return transition === 'enter'
    ? direction === 'forward' ? 'right' : 'left'
    : direction === 'forward' ? 'left' : 'right';
};

const onBeforeEnter = (el: Element) => {
  if (routingDirection.value === 'initial') {
    return;
  }
  state.value = 'before-enter';
  props.beforeAnimate?.('enter', getViewType(routingDirection.value, 'enter'), el as HTMLElement);
  scrollLock.value = true;
};
const onEnter = (el: Element, done: VoidFunction) => {
  if (routingDirection.value === 'initial' || !props.animate) {
    return done();
  }
  state.value = 'entering';
  props.animate('enter', getViewType(routingDirection.value, 'enter'), el as HTMLElement, done);
};
const onAfterEnter = (el: Element) => {
  props.afterEnter?.(getViewType(routingDirection.value, 'enter'), el as HTMLElement);
  scrollLock.value = false;
  state.value = 'entered';
};

const onBeforeLeave = (el: Element) => {
  props.beforeAnimate?.('leave', getViewType(routingDirection.value, 'leave'), el as HTMLElement);
};
const onLeave = (el: Element, done: VoidFunction) => {
  if (!props.animate) {
    return done();
  }
  props.animate('leave', getViewType(routingDirection.value, 'leave'), el as HTMLElement, done);
};

provideViewTransition({
  isEntered: computed(() => state.value === 'entered'),
});
</script>

<template>
  <slot
    :css="false"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
  />
</template>
