<script setup lang="ts">
import { useMousePressed } from '@vueuse/core';

import { provideListItemOptions } from './provider.js';

export type ListIosItemVariant = 'regular' | 'accent' | 'destructive' | 'placeholder';

const { variant = 'regular', large = false } = defineProps<{
  /**
   * True if the element is clickable. This will add some additional visual changes to the element.
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
}>();
defineSlots<{
  left(): unknown;
  body(): unknown;
  bodyInput(): unknown;
  bodyLeft(): unknown;
  bodyLeftLabel(): unknown;
  bodyLeftSubtitle(): unknown;
  bodyRight(): unknown;
}>();

const { b, e } = bem('list-ios-item');

provideListItemOptions({
  large: computed(() => large),
});

const bodyLeftSlots = [
  { id: 'bodyLeftLabel', name: 'label' },
  { id: 'bodyLeftSubtitle', name: 'subtitle' },
] as const;

const innerRef = useTemplateRef<HTMLButtonElement>('inner');
const { pressed } = useMousePressed({ target: innerRef });
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
  <li :class="b(variant)">
    <div ref="inner" :class="e('inner', { clickable })">
      <Transition v-if="clickable" :css="false" @leave="onHighlightLeave">
        <span v-if="pressed" key="active" :class="e('highlight')"/>
      </Transition>
      <slot name="left"/>
      <slot name="body">
        <ListIosItemBody>
          <template v-if="$slots.bodyInput" #input>
            <slot name="bodyInput" />
          </template>
          <template v-else #left>
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
    </div>
  </li>
</template>

<style lang="scss">
@use "@/domains/styles/mixins.scss";

.list-ios-item {
  display: block;
  position: relative;

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

  &__inner {
    appearance: none;
    border: none;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    padding: 0 0 0 16px;
    background: transparent;
    text-align: left;
    cursor: unset;
    color: inherit;
    align-items: stretch;

    &--clickable {
      @include mixins.clickable;
    }
  }

  @each $variant in ("regular", "destructive", "accent", "placeholder") {
    &--#{$variant} {
      color: var(--list-ios-item-#{$variant}-color);
    }
  }
}
</style>
