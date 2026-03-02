<script setup lang="ts">
import { provideListItemOptions } from './provider.js';

export type ListAndroidItemVariant = 'regular' | 'accent' | 'destructive' | 'placeholder';

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
  variant?: ListAndroidItemVariant;
}>(), {
  variant: 'regular',
});
defineSlots<{
  left(): unknown;
  body(): unknown;
  bodyInput(): unknown;
  bodyLeft(): unknown;
  bodyLeftLabel(): unknown;
  bodyLeftSubtitle(): unknown;
  bodyRight(): unknown;
}>();

const { b } = bem('list-android-item');

provideListItemOptions({
  large: computed(() => props.large ?? false),
});

const bodyLeftSlots = [
  { id: 'bodyLeftLabel', name: 'label' },
  { id: 'bodyLeftSubtitle', name: 'subtitle' },
] as const;

const rootRef = useTemplateRef('root');
useRipples({
  enabled: () => props.clickable,
  containerRef: rootRef,
  clickRef: rootRef,
});
</script>

<template>
  <li ref="root" :class="b(variant, {clickable})">
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
          <slot name="bodyRight"/>
        </template>
      </ListAndroidItemBody>
    </slot>
  </li>
</template>

<style lang="scss">
@use "@ui-kit-mixins" as mixins;

.list-android-item {
  display: block;
  box-sizing: border-box;
  display: flex;
  padding: 0 0 0 20px;
  background: transparent;
  height: 100%;
  overflow: hidden;
  position: relative;

  &--clickable {
    @include mixins.clickable;
  }

  @each $variant in ("regular", "destructive", "accent", "placeholder") {
    &--#{$variant} {
      color: var(--list-android-item-#{$variant}-color);
    }
  }
}
</style>
