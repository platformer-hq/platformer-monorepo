<script lang="ts" setup>
import { IconXmark24 } from '@workspace/icons';

const { b, e } = bem('tgui-text-field-android-right-clear');
</script>

<template>
  <div :class="b()">
    <IconXmark24 :class="e('icon')" :size="24"/>
  </div>
</template>

<style lang="scss">
@use "~scss/mixins";

.tgui-text-field-android-right-clear {
  box-sizing: content-box;
  padding: 8px;
  margin-right: -6px;
  color: var(--tgui-text-field-android-right-clear-color, #8E8E93);
  @include mixins.clickable;

  &__icon {
    display: block;
  }
}
</style>
