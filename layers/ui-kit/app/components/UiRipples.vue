<script setup lang="ts">
import { useMousePressed } from '@vueuse/core';

const { enabled = true } = defineProps<{
  as: KnownHtmlTag;
  /**
   * @default true
   */
  enabled?: boolean;
}>();

const { b, e } = bem('ui-ripples');
const ripples = ref<{ x: number; y: number; canDestroy?: boolean; key: number }[]>([]);
const rootRef = useTemplateRef<HTMLElement>('root');
const { pressed } = useMousePressed({
  target: rootRef,
  onPressed(event) {
    if (!enabled) {
      return;
    }
    const [x, y] = 'clientX' in event
      ? [event.clientX, event.clientY]
      : [event.touches[0]!.clientX, event.touches[0]!.clientY];
    const { currentTarget } = event;
    const rect = (currentTarget as HTMLElement).getBoundingClientRect();
    ripples.value = [...ripples.value, {
      x: x - rect.left,
      y: y - rect.top,
      key: Math.random(),
    }];
  },
  drag: false,
  // We disable touch as long as it causes double onPressed function calls.
  // In turn, this creates 2 ripples instead of 1.
  touch: false,
});

watchEffect(() => {
  const { value: r } = ripples;

  // To modify ripples array, we have to check the following:
  // 1. Ripples array is not empty.
  // 2. Ripples array contains more than 1 element (so we can start removing at least something)
  // or the user is not holding the pointer (so we can probably remove everything).
  // 3. A tailed ripple is ready to be removed. This makes sure, we have at least something
  // to remove.
  if (r.length && (r.length > 1 || !pressed.value) && r[0]!.canDestroy) {
    ripples.value = ripples.value.filter((item, idx, arr) => {
      return !item.canDestroy || (pressed.value && idx === arr.length - 1);
    });
  }
});

const onEnter = (el: Element, done: VoidFunction) => {
  return el
    .animate(
      { width: ['0', '220%'], opacity: [0, 0.1, 0.1] },
      { duration: 300, easing: 'ease', fill: 'forwards' },
    )
    .finished
    .then(() => {
      done();
    })
    .then(() => {
      // Mark the first element not marked as destroyable to remove when possible.
      for (const ripple of ripples.value) {
        if (!ripple.canDestroy) {
          ripple.canDestroy = true;
          return;
        }
      }
    });
};
const onLeave = (el: Element, done: VoidFunction) => {
  return el.animate({ opacity: [0.1, 0] }, { duration: 200 }).finished.then(() => {
    done();
  });
};
</script>

<template>
  <component :is="as" ref="root" :class="b({enabled})">
    <slot />
    <span :class="e('ripples')">
      <TransitionGroup @enter="onEnter" @leave="onLeave">
        <span
          v-for="ripple in ripples"
          :key="ripple.key"
          :class="e('ripple')"
          :style="{ left: `${ripple.x}px`, top: `${ripple.y}px` }"
        />
      </TransitionGroup>
    </span>
  </component>
</template>

<style lang="scss">
@use "@/domains/styles/mixins";

.ui-ripples {
  position: relative;

  &--enabled {
    @include mixins.clickable;
  }

  &__ripples {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  &__ripple {
    display: block;
    aspect-ratio: 1;
    position: absolute;
    background: currentColor;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
