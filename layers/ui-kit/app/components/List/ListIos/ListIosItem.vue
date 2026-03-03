<script setup lang="ts">
import { useMousePressed } from '@vueuse/core';

import { provideListItemOptions } from './provider.js';

export type ListIosItemVariant = 'regular' | 'accent' | 'destructive' | 'placeholder';

const props = withDefaults(defineProps<{
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
  variant: 'regular',
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

const { b, e } = bem('list-ios-item');

provideListItemOptions({
  large: computed(() => props.large || false),
});

const bodyLeftSlots = [
  { id: 'bodyLeftInput', name: 'input' },
  { id: 'bodyLeftLabel', name: 'label' },
  { id: 'bodyLeftSubtitle', name: 'subtitle' },
] as const;

const rootRef = useTemplateRef('root');
const { pressed } = useMousePressed({ target: rootRef });
const onHighlightLeave = (el: Element, done: VoidFunction) => {
  el
    .animate({ opacity: [0.1, 0] }, { duration: 300 })
    .finished
    .then(() => {
      done();
    });
};
</script>

<template>
  <li ref="root" :class="b(variant, { clickable })">
    <Transition v-if="clickable" :css="false" @leave="onHighlightLeave">
      <span v-if="pressed" key="active" :class="e('highlight')"/>
    </Transition>
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
        <template #right>
          <slot name="bodyRight"/>
        </template>
      </ListIosItemBody>
    </slot>
  </li>
</template>

<style lang="scss">
@use "@ui-kit-mixins" as mixins;

.list-ios-item {
  position: relative;
  appearance: none;
  border: none;
  box-sizing: border-box;
  display: flex;
  padding: 0 0 0 16px;
  background: transparent;
  // align-items: stretch;

  &--clickable {
    @include mixins.clickable;
  }

  &__highlight {
    background: currentColor;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    opacity: 0.1;
    pointer-events: none;
  }

  @each $variant in ("regular", "destructive", "accent", "placeholder") {
    &--#{$variant} {
      color: var(--list-ios-item-#{$variant}-color);
    }
  }
}
</style>
