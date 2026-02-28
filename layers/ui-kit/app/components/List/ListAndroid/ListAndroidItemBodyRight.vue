<script setup lang="ts">
// TODO: What for all these slots?
defineSlots<{
  default(): unknown;
  chevron(): unknown;
  checkmark(): unknown;
  label(): unknown;
}>();

const { b, e } = bem('list-android-item-body-right');
</script>

<template>
  <div :class="b()">
    <slot/>
    <slot name="checkmark" />
    <slot name="label" />
    <div
      v-if="$slots.chevron"
      :class="e('chevron', {'pad-left': $slots.label || $slots.checkmark})"
    >
      <slot name="chevron" />
    </div>
  </div>
</template>

<style lang="scss">
.list-android-item-body-right {
  box-sizing: border-box;
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
