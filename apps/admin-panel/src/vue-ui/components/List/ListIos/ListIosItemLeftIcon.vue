<script setup lang="ts">
import { bem } from 'vue-ui';

defineProps<{
  /**
   * True if the icon must be rounded.
   */
  rounded?: boolean;
}>();

const [b, e] = bem('tgui-list-ios-item-left-icon');
</script>

<template>
  <div :class="b()">
    <i :class="e('image', { rounded })">
      <slot />
    </i>
  </div>
</template>

<style lang="scss">
.tgui-list-ios-item-left-icon {
  width: 50px;
  height: 100%;
  display: flex;
  align-items: center;

  &__image {
    width: 30px;
    height: 30px;
    overflow: hidden;
    display: block;

    &--rounded {
      border-radius: 7px;
    }
  }
}
</style>
