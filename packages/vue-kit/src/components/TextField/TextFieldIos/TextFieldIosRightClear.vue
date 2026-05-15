<script lang="ts" setup>
import IconXMarkCircleFill20 from '@/icons/xmark-circle-fill-20.svg?component';
import { bem } from '@/utils/bem';

const { b, e } = bem('tgui-text-field-ios-right-clear');
</script>

<template>
  <div :class="b()">
    <IconXMarkCircleFill20 :class="e('icon')" :width="20" :height="20"/>
  </div>
</template>

<style lang="scss">
@use "@/scss/mixins";

.tgui-text-field-ios-right-clear {
  box-sizing: content-box;
  padding: 5px;
  margin-right: -7px;
  color: var(--tgui-text-field-ios-right-clear-color, #8E8E93);
  @include mixins.clickable;

  &__icon {
    display: block;
  }
}
</style>
