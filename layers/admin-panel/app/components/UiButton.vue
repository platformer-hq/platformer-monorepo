<script setup lang="ts">
import type { ButtonBaseProps } from './ButtonBase.vue';

interface Props extends ButtonBaseProps {
  /**
   * @default 'regular'
   */
  variant?: 'regular' | 'small' | 'multiline';
}

withDefaults(defineProps<Props>(), {
  variant: 'regular',
  ripples: undefined,
  highlightOnActive: undefined,
  pressable: undefined,
  clickable: undefined,
});
const { b } = bem('ui-button');
</script>

<template>
  <ButtonBase v-bind="$props" :as :clickable :class="b(variant)">
    <slot/>
  </ButtonBase>
</template>

<style lang="scss">
.ui-button {
  &--small {
    padding: 4px 12px;
    min-height: 28px;
    border-radius: 1000px;
  }

  &--multiline {
    padding: 8px 24px;
    min-height: 62px;
    border-radius: 16px;
  }

  &--regular {
    padding: 10px 24px;
    min-height: 50px;
    border-radius: 25px;
  }
}
</style>
