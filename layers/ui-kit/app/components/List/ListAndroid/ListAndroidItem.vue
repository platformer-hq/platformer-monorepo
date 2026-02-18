<script setup lang="ts">
import { provideListItemOptions } from './provider.js';

export type ListAndroidItemVariant = 'regular' | 'accent' | 'destructive' | 'placeholder';

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
  variant?: ListAndroidItemVariant;
}>();
defineSlots<{
  left(): unknown;
  body(): unknown;
  bodyInput(): unknown;
  bodyLeft(): unknown;
  bodyLeftLabel(): unknown;
  bodyLeftSubtitle(): unknown;
  bodyRight(): unknown;
  bodyRightCheckmark(): unknown;
  bodyRightChevron(): unknown;
  bodyRightLabel(): unknown;
}>();

const { b, e } = bem('list-android-item');

provideListItemOptions({
  large: computed(() => large),
});

const bodyLeftSlots = [
  { id: 'bodyLeftLabel', name: 'label' },
  { id: 'bodyLeftSubtitle', name: 'subtitle' },
] as const;
const bodyRightSlots = [
  { id: 'bodyRightCheckmark', name: 'checkmark' },
  { id: 'bodyRightChevron', name: 'chevron' },
  { id: 'bodyRightLabel', name: 'label' },
] as const;
</script>

<template>
  <li :class="b(variant)">
    <UiRipples as="div" :enabled="clickable" :class="e('inner')">
      <slot name="left"/>
      <slot name="body">
        <ListAndroidItemBody>
          <template v-if="$slots.bodyInput" #input>
            <slot name="bodyInput" />
          </template>
          <template v-else #left>
            <slot name="bodyLeft">
              <ListAndroidItemBodyLeft v-if="bodyLeftSlots.some(s => s.id in $slots)">
                <template
                  v-for="{id, name} in bodyLeftSlots.filter(s => s.id in $slots)"
                  :key="id"
                  #[name]
                >
                  <slot :name="id" />
                </template>
              </ListAndroidItemBodyLeft>
            </slot>
          </template>
          <template #right>
            <slot name="bodyRight">
              <ListAndroidItemBodyRight v-if="bodyRightSlots.some(s => s.id in $slots)">
                <template
                  v-for="{id, name} in bodyRightSlots.filter(s => s.id in $slots)"
                  :key="id"
                  #[name]
                >
                  <slot :name="id" />
                </template>
              </ListAndroidItemBodyRight>
            </slot>
          </template>
        </ListAndroidItemBody>
      </slot>
    </UiRipples>
  </li>
</template>

<style lang="scss">
.list-android-item {
  display: block;

  &__inner {
    appearance: none;
    border: none;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    padding: 0 0 0 20px;
    background: transparent;
    text-align: left;
    color: inherit;
    height: 100%;
  }

  @each $variant in ("regular", "destructive", "accent", "placeholder") {
    &--#{$variant} {
      color: var(--list-android-item-#{$variant}-color);
    }
  }
}
</style>
