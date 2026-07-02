<script setup lang="ts">
import { useMousePressed, watchThrottled } from '@vueuse/core';

import type { KnownHtmlTag } from '#ui-kit/types';

import { provideListItemOptions } from './_provider.js';

export type ListIosItemVariant = 'regular' | 'accent' | 'destructive' | 'placeholder';

const props = withDefaults(defineProps<{
  /**
   * @default 'li'
   */
  as?: KnownHtmlTag;
  /**
   * True if the element is clickable. This will add some additional visual changes
   * to the element.
   */
  clickable?: boolean;
  /**
   * True if the item has a large size.
   */
  large?: boolean;
  /**
   * Visual variant.
   * @default 'regular'
   */
  variant?: ListIosItemVariant;
}>(), {
  as: 'li',
  variant: 'regular',
  large: false,
});
defineSlots<{
  left(): unknown;
  body(): unknown;
  bodyLeft(): unknown;
  bodyLeftInput(): unknown;
  bodyLeftLabel(): unknown;
  bodyLeftSubtitle(): unknown;
  bodyRight(): unknown;
}>();

provideListItemOptions({
  large: computed(() => props.large),
});

const pressedDebounced = ref(false);
const rootRef = useTemplateRef<HTMLElement>('root');
const { pressed } = useMousePressed({ target: rootRef });

// We update press state with throttle as long as we track both touches
// and traditional clicks. Clicking the item on a touch device will trigger
// pressed state updates twice, but it is not intended.
watchThrottled(pressed, v => {
  pressedDebounced.value = v;
}, { throttle: 50 });

const { b } = bem('tgui-list-ios-item');
const bodyLeftSlots = [
  { id: 'bodyLeftInput', name: 'input' },
  { id: 'bodyLeftLabel', name: 'label' },
  { id: 'bodyLeftSubtitle', name: 'subtitle' },
] as const;
</script>

<template>
  <component
    :is="as"
    ref="root"
    :class="b(variant, large ? 'large' : 'small', {'no-left': !$slots.left})"
  >
    <IosActivationHighlight v-if="clickable" :show="pressedDebounced"/>
    <slot name="left"/>
    <slot name="body">
      <ListIosItemBody>
        <template #left>
          <slot name="bodyLeft">
            <ListIosItemBodyLeft v-if="bodyLeftSlots.some(s => s.id in $slots)">
              <template
                v-for="{id, name} in bodyLeftSlots.filter(s => s.id in $slots)"
                :key="id"
                #[name]
              >
                <slot :name="id" />
              </template>
            </ListIosItemBodyLeft>
          </slot>
        </template>
        <template v-if="'bodyRight' in $slots" #right>
          <slot name="bodyRight"/>
        </template>
      </ListIosItemBody>
    </slot>
  </component>
</template>

<style lang="scss">
.tgui-list-ios-item {
  position: relative;
  appearance: none;
  border: none;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto 1fr;
  padding: 0 0 0 16px;
  background: transparent;
  transition: 300ms ease-out;

  &--no-left {
    grid-template-columns: 1fr;
  }

  &--small {
    min-height: 52px;
  }

  &--large {
    min-height: 60px;
  }

  @each $variant in ("regular", "destructive", "accent", "placeholder") {
    &--#{$variant} {
      color: var(--tgui-list-ios-item-#{$variant}-color);
    }
  }
}
</style>
