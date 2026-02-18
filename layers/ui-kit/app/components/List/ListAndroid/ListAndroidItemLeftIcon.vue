<script setup lang="ts">
import type { Component } from 'vue';

const { size = 'small' } = defineProps<{
  /**
   * An icon to render.
   */
  icon?: Component<{ class?: unknown }>;
  /**
   * The icon size.
   * - `small` - 28px
   * - `large` - 42px
   * @default 'small'
   */
  size?: 'small' | 'large';
  /**
   * True if the icon is supposed to be square. This only adds a left padding and adds border
   * radius to the icon.
   */
  square?: boolean;
}>();

const { b, e } = bem('list-android-item-left-icon');
</script>

<template>
  <div :class="b()">
    <i :class="e('icon', { rounded: square }, size)">
      <component :is="icon" v-if="icon" :class="e('image')"/>
      <slot v-else/>
    </i>
  </div>
</template>

<style lang="scss">
.list-android-item-left-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  &__icon {
    &--small {
      width: 28px;
      height: 28px;
    }

    &--large {
      width: 42px;
      height: 42px;
      margin-left: -6px;
    }

    &--rounded {
      border-radius: 8px;
    }
  }

  &__image {
    object-fit: contain;
    object-position: center;
    width: 100%;
    height: 100%;
  }
}
</style>
