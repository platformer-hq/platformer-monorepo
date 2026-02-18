<script setup lang="ts">
import { computed, h, onUnmounted, type Component } from 'vue';
import { bem } from 'vue-ui';

import Tappable from '@/vue-ui/components/Tappable.vue';

import ListAndroidItemBody from './ListAndroidItemBody.vue';
import ListAndroidItemBodyLeft from './ListAndroidItemBodyLeft.vue';
import ListAndroidItemBodyRight from './ListAndroidItemBodyRight.vue';
import ListAndroidItemLeft from './ListAndroidItemLeft.vue';
import { injectListOptions, provideListItemOptions } from './provider.js';

export type ListAndroidItemVariant = 'regular' | 'accent' | 'destructive' | 'placeholder';

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
  variant?: ListAndroidItemVariant;
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

const [b, e] = bem('tgui-list-android-item');
const Clickable: Component<{ class?: string }> = (props, options) => {
  return h(Tappable, { ...props, is: 'button' }, options.slots);
};

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
      :is="clickable ? Clickable : 'div'"
      :class="e('inner', { large })"
    >
      <slot name="left">
        <ListAndroidItemLeft v-if="leftSlots.some(s => s.id in $slots)">
          <template
            v-for="{id, name} in leftSlots"
            :key="id"
            #[name]
          >
            <slot :name="id" />
          </template>
        </ListAndroidItemLeft>
      </slot>
      <slot name="body">
        <ListAndroidItemBody>
          <template
            v-if="$slots.bodyInput"
            #input
          >
            <slot name="bodyInput" />
          </template>
          <template #left>
            <slot name="bodyLeft">
              <ListAndroidItemBodyLeft v-if="bodyLeftSlots.some(s => s.id in $slots)">
                <template
                  v-for="{id, name} in bodyLeftSlots"
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
                  v-for="{id, name} in bodyRightSlots"
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
    </component>
  </li>
</template>

<style lang="scss">
@mixin variant($name, $color) {
  &--#{$name} {
    color: var(--tgui-list-android-item-#{$name}-text-color, $color);
  }
}

.tgui-list-android-item {
  display: block;

  &__inner {
    appearance: none;
    border: none;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: stretch;
    padding: 0 0 0 20px;
    background: transparent;
    text-align: left;
    color: inherit;
    min-height: 50px;

    &--large {
      min-height: 64px;
    }
  }

  @include variant("regular", #222222);
  @include variant("accent", #1C93E3);
  @include variant("destructive", #CC2929);
  @include variant("placeholder", #82868A);
}
</style>
