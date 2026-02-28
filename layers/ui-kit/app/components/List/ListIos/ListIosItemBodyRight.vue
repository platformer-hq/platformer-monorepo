<script setup lang="ts">
// TODO: What for all these slots?
defineSlots<{
  default(): unknown;
  chevron(): unknown;
  checkmark(): unknown;
  label(): unknown;
}>();

const { b, e } = bem('list-ios-item-body-right');
</script>

<template>
  <div :class="b()">
    <slot />
    <slot name="label" />
    <slot name="checkmark" />
    <div
      v-if="$slots.chevron"
      :class="e('chevron', {'pad-left': $slots.label || $slots.checkmark})"
    >
      <slot name="chevron" />
    </div>
  </div>
</template>

<style lang="scss">
.list-ios-item-body-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 16px;

  &__chevron {
    height: 100%;
    display: flex;
    align-items: center;

    &--pad-left {
      padding-left: 12px;
    }
  }
}
</style>
