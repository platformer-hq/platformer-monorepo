<script setup lang="ts">
defineSlots<{
  icon(): any;
  label(): any;
  checkbox(): any;
}>();
</script>

<template>
  <div
    v-if="$slots.icon || $slots.label || $slots.checkbox"
    class="tgui-list-ios-item-left"
  >
    <slot
      v-if="$slots.icon"
      name="icon"
    />
    <slot
      v-else-if="$slots.label"
      name="label"
    />
    <slot
      v-else-if="$slots.checkbox"
      name="checkbox"
    />
  </div>
</template>
