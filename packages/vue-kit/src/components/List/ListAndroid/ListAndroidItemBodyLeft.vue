<script setup lang="ts">
import { bem } from '@/utils/bem';

defineProps<{
  /**
   * True if the elements direction must be reversed.
   */
  reversed?: boolean;
}>();
defineSlots<{
  input(): unknown;
  label(): unknown;
  subtitle(): unknown;
}>();

const { b, e } = bem('tgui-list-android-item-body-left');
</script>

<template>
  <div :class="b()">
    <slot v-if="'input' in $slots" name="input"/>
    <div v-else :class="e('texts', {reversed, 'label-only': !('subtitle' in $slots)})">
      <slot name="label" />
      <slot name="subtitle"/>
    </div>
  </div>
</template>

<style lang="scss">
.tgui-list-android-item-body-left {
  min-width: 0;

  &__texts {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    padding: 10px 0;

    &--label-only {
      padding: 15px 0;
    }

    &--reversed {
      flex-flow: column-reverse;
    }
  }
}

</style>
