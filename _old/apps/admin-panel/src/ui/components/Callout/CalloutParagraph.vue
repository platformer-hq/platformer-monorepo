<script setup lang="ts">
import Text from '@/ui/adapters/Text.vue';
</script>

<template>
  <Text
    is="p"
    variant="callout"
    class="callout__paragraph"
  >
    <slot />
  </Text>
</template>

<style lang="scss">
.callout__paragraph {
  color: var(--theme-text-color);
  margin-top: 8px;

  &:first-child {
    margin-top: 0;
  }
}
</style>
