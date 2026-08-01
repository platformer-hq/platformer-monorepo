<script setup lang="ts">
import { usePlatform } from '~/_composables/usePlatform.js';

import { provideListItemOptions } from './_provider.js';

export type ListItemVariant = 'regular' | 'accent' | 'destructive' | 'placeholder';

const props = withDefaults(defineProps<{
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
  variant?: ListItemVariant;
  /**
   * @default true
   */
  separator?: boolean;
}>(), {
  variant: 'regular',
  separator: true,
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

const platform = usePlatform();
const rootRef = useTemplateRef('root');
useRipples({
  enabled: () => platform.value === 'android' && props.clickable,
  containerRef: rootRef,
  clickRef: rootRef,
});

const pressed = ref(false);

const { b } = bem('list-item');

provideListItemOptions({
  large: computed(() => props.large ?? false),
  separator: computed(() => props.separator ?? false),
});

const bodyLeftSlots = [
  { id: 'bodyLeftInput', name: 'input' },
  { id: 'bodyLeftLabel', name: 'label' },
  { id: 'bodyLeftSubtitle', name: 'subtitle' },
] as const;
</script>

<template>
  <li
    ref="root"
    :class="b(variant, {clickable, 'no-left': !$slots.left}, platform)"
    @pointerdown="pressed = true"
    @pointerup="pressed = false"
    @pointerleave="pressed = false"
    @pointercancel="pressed = false"
  >
    <IosActivationHighlight v-if="platform === 'ios' && clickable" :show="pressed"/>
    <slot name="left"/>
    <slot name="body">
      <ListItemBody>
        <template #left>
          <slot name="bodyLeft">
            <ListItemBodyLeft v-if="bodyLeftSlots.some(s => s.id in $slots)">
              <template
                v-for="{id, name} in bodyLeftSlots.filter(s => s.id in $slots)"
                :key="id"
                #[name]
              >
                <slot :name="id" />
              </template>
            </ListItemBodyLeft>
          </slot>
        </template>
        <template v-if="'bodyRight' in $slots" #right>
          <slot name="bodyRight"/>
        </template>
      </ListItemBody>
    </slot>
  </li>
</template>

<style lang="scss">
.list-item {
  position: relative;
  appearance: none;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto 1fr;
  transition: 300ms ease-out;

  &--ios {
    padding: 0 0 0 16px;
  }

  &--android {
    padding: 0 0 0 20px;
    overflow: hidden;
  }

  &--no-left {
    grid-template-columns: 1fr;
  }

  &--clickable {
    @include mixins.clickable;
  }

  @each $name, $color in (
    "destructive": var(--destructive-text-color),
    "accent": var(--link-color),
    "placeholder": var(--subtitle-text-color)
  ) {
    &--#{$name} {
      color: $color;
    }
  }
}
</style>
