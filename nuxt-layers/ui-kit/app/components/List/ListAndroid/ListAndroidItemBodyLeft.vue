<script setup lang="ts">
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

const { b, e } = bem('list-android-item-body-left');
</script>

<template>
  <div :class="b()">
    <slot v-if="$slots.input" name="input"/>
    <div v-else :class="e('texts', {reversed, 'label-only': !$slots.subtitle})">
      <slot name="label" />
      <slot name="subtitle"/>
    </div>
  </div>
</template>

<style lang="scss">
.list-android-item-body-left {
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
