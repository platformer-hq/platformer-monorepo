import { useScrollLock } from '@vueuse/core';
import {
  type TransitionProps,
  type DeepReadonly,
  computed,
  readonly,
  ref,
  toValue,
  type ComputedRef,
  type MaybeRefOrGetter,
} from 'vue';

export type UsePageTransitionTransitionType = 'enter' | 'leave';
export type UsePageTransitionPageType = 'left' | 'right';
export type UsePageTransitionState = 'before-enter' | 'entering' | 'entered';
export type UsePageTransitionNavigationDirection = 'initial' | 'forward' | 'backward';

export interface UsePageTransitionOptions {
  /**
   * The current navigation direction. This value determines which animation exactly
   * should be performed - from left to right, or from right to left.
   */
  navigationDirection: UsePageTransitionNavigationDirection;
  /**
   * A function to call before the animation starts.
   */
  beforeAnimate?(options: {
    transition: UsePageTransitionTransitionType;
    page: UsePageTransitionPageType;
    el: HTMLElement;
  }): void;
  /**
   * A function to call to animate the element.
   */
  animate?(options: {
    transition: UsePageTransitionTransitionType;
    page: UsePageTransitionPageType;
    el: HTMLElement;
    done: VoidFunction;
  }): void;
  /**
   * A function to call after the element entered.
   */
  afterEnter?(options: { page: UsePageTransitionPageType; el: HTMLElement }): void;
}

export interface UsePageTransitionReturn {
  transition: Pick<
    TransitionProps,
    'onBeforeEnter' | 'onEnter' | 'onAfterEnter' | 'onBeforeLeave' | 'onLeave' | 'css'
  >;
  state: DeepReadonly<ComputedRef<UsePageTransitionState>>;
}

function detectPageType(
  direction: UsePageTransitionNavigationDirection,
  transition: UsePageTransitionTransitionType,
): UsePageTransitionPageType {
  return transition === 'enter'
    ? direction === 'forward' ? 'right' : 'left'
    : direction === 'forward' ? 'left' : 'right';
}

export function usePageTransition(
  options: MaybeRefOrGetter<UsePageTransitionOptions>,
): UsePageTransitionReturn {
  const scrollLock = useScrollLock(window);
  const optionsValue = computed(() => toValue(options));
  const state = ref<UsePageTransitionState>(
    // On the initial direction transition hooks will not be called. This means, that not
    // setting the state to "entered", the value will hang on the "before-enter" value.
    optionsValue.value.navigationDirection === 'initial'
      ? 'entered'
      : 'before-enter',
  );

  return {
    transition: {
      css: false,
      onBeforeEnter(el) {
        if (optionsValue.value.navigationDirection === 'initial') {
          return;
        }
        scrollLock.value = true;
        state.value = 'before-enter';
        optionsValue.value.beforeAnimate?.({
          transition: 'enter',
          page: detectPageType(optionsValue.value.navigationDirection, 'enter'),
          el: el as HTMLElement,
        });
      },
      onEnter(el, done) {
        if (optionsValue.value.navigationDirection === 'initial' || !optionsValue.value.animate) {
          return done();
        }
        state.value = 'entering';
        optionsValue.value.animate?.({
          transition: 'enter',
          page: detectPageType(optionsValue.value.navigationDirection, 'enter'),
          el: el as HTMLElement,
          done,
        });
      },
      onAfterEnter(el) {
        scrollLock.value = false;
        state.value = 'entered';
        optionsValue.value.afterEnter?.({
          page: detectPageType(optionsValue.value.navigationDirection, 'enter'),
          el: el as HTMLElement,
        });
      },
      onBeforeLeave(el) {
        optionsValue.value.beforeAnimate?.({
          transition: 'leave',
          page: detectPageType(optionsValue.value.navigationDirection, 'leave'),
          el: el as HTMLElement,
        });
      },
      onLeave(el, done) {
        if (!optionsValue.value.animate) {
          return done();
        }
        optionsValue.value.animate?.({
          transition: 'leave',
          page: detectPageType(optionsValue.value.navigationDirection, 'leave'),
          el: el as HTMLElement,
          done,
        });
      },
    },
    state: readonly(state),
  };
}
