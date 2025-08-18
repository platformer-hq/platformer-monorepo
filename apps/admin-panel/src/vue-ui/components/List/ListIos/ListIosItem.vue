<script setup lang="ts">
import { computed, onUnmounted } from 'vue';
import { bem } from 'vue-ui';

import { useActiveStateHandler } from '@/vue-ui/hooks/useActiveStateHandler';

import ListIosItemBody from './ListIosItemBody.vue';
import ListIosItemBodyLeft from './ListIosItemBodyLeft.vue';
import ListIosItemBodyRight from './ListIosItemBodyRight.vue';
import ListIosItemLeft from './ListIosItemLeft.vue';
import { injectListOptions, provideListItemOptions } from './provider.js';

export type ListIosItemVariant = 'regular' | 'accent' | 'destructive' | 'placeholder';

const { large, variant = 'regular' } = defineProps<{
  /**
   * True if the element is clickable. This will add some additional visual changes to the element.
   */
  clickable?: boolean;
  /**
   * True if the item has a large size. It will allow displaying both title
   * and subtitle.
   */
  large?: boolean;
  /**
   * Visual variant.
   */
  variant?: ListIosItemVariant;
}>();
defineSlots<{
  left(): any;
  leftIcon(): any;
  leftLabel(): any;
  body(): any;
  bodyInput(): any;
  bodyLeft(): any;
  bodyLeftLabel(): any;
  bodyLeftSubtitle(): any;
  bodyRight(): any;
  bodyRightCheckmark(): any;
  bodyRightChevron(): any;
  bodyRightCounter(): any;
  bodyRightClear(): any;
  bodyRightLabel(): any;
  bodyRightSwitch(): any;
  bodyRightRadio(): any;
}>();

const [b, e] = bem('tgui-list-ios-item');
const [active, onPointerDown] = useActiveStateHandler();

const { register, unregister, firstItem } = injectListOptions();
const currentItemId = register();

onUnmounted(() => {
  unregister(currentItemId);
});

provideListItemOptions({
  large: computed(() => large),
  first: computed(() => firstItem.value === currentItemId),
});

const leftSlots = [
  { id: 'leftLabel', name: 'label' },
  { id: 'leftIcon', name: 'icon' },
] as const;
const bodyLeftSlots = [
  { id: 'bodyLeftLabel', name: 'label' },
  { id: 'bodyLeftSubtitle', name: 'subtitle' },
] as const;
const bodyRightSlots = [
  { id: 'bodyRightCheckmark', name: 'checkmark' },
  { id: 'bodyRightChevron', name: 'chevron' },
  { id: 'bodyRightCounter', name: 'counter' },
  { id: 'bodyRightClear', name: 'clear' },
  { id: 'bodyRightLabel', name: 'label' },
  { id: 'bodyRightSwitch', name: 'switch' },
  { id: 'bodyRightRadio', name: 'radio' },
] as const;
</script>

<template>
  <li :class="b(variant)">
    <component
      :is="clickable ? 'button' : 'div'"
      :class="e('inner', { clickable, active, large })"
      @pointerdown="clickable ? onPointerDown() : undefined"
    >
      <slot name="left">
        <ListIosItemLeft v-if="leftSlots.some(s => s.id in $slots)">
          <template
            v-for="{id, name} in leftSlots"
            :key="id"
            #[name]
          >
            <slot :name="id" />
          </template>
        </ListIosItemLeft>
      </slot>
      <slot name="body">
        <ListIosItemBody>
          <template
            v-if="$slots.bodyInput"
            #input
          >
            <slot name="bodyInput" />
          </template>
          <template #left>
            <slot name="bodyLeft">
              <ListIosItemBodyLeft v-if="bodyLeftSlots.some(s => s.id in $slots)">
                <template
                  v-for="{id, name} in bodyLeftSlots"
                  :key="id"
                  #[name]
                >
                  <slot :name="id" />
                </template>
              </ListIosItemBodyLeft>
            </slot>
          </template>
          <template #right>
            <slot name="bodyRight">
              <ListIosItemBodyRight v-if="bodyRightSlots.some(s => s.id in $slots)">
                <template
                  v-for="{id, name} in bodyRightSlots"
                  :key="id"
                  #[name]
                >
                  <slot :name="id" />
                </template>
              </ListIosItemBodyRight>
            </slot>
          </template>
        </ListIosItemBody>
      </slot>
    </component>
  </li>
</template>

<style lang="scss">
@use "@/vue-ui/styles/mixins.scss";

@mixin variant($name, $color) {
  &--#{$name} {
    color: var(--tgui-list-ios-item-body-left-label-#{$name}-color, $color);
  }
}

.tgui-list-ios-item {
  display: block;

  &__inner {
    appearance: none;
    border: none;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: stretch;
    padding: 0 0 0 16px;
    background: transparent;
    text-align: left;
    cursor: unset;
    color: inherit;
    min-height: 44px;

    &--clickable {
      @include mixins.clickable;
    }

    &--active {
      background: var(--tgui-list-ios-item-active-bg, #D2D1D7);
    }

    &--large {
      min-height: 60px;
    }
  }

  @include variant("regular", black);
  @include variant("accent", #007AFF);
  @include variant("destructive", #FF3B30);
  @include variant("placeholder", #8E8E93);
}
</style>
