<script setup lang="ts">
const { b } = bem('bottom-bar-inner');

const props = defineProps<{
  variant?: '2-columns' | {
    kind: 'rows';
    /**
     * @default 'fr'
     */
    size?: 'fr' | 'auto';
  };
}>();

const variantMod = computed(() => {
  const { variant } = props;
  if (!variant) {
    return;
  }
  if (variant === '2-columns') {
    return '2-columns';
  }
  return ['rows', variant.size || 'fr'];
});
</script>

<template>
  <div :class="b(variantMod)">
    <slot/>
  </div>
</template>

<style lang="scss">
.bottom-bar-inner {
  padding: 8px 16px 16px;

  &--2-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  &--rows {
    display: grid;
    gap: 16px;
  }

  &--rows-fr {
    grid-auto-rows: 1fr;
  }

  &--rows-auto {
    grid-auto-rows: auto;
  }
}
</style>
