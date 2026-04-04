<script setup lang="ts" generic="T extends string | number | boolean">
import { hapticFeedback } from '@tma.js/sdk-vue';
import { useMousePressed } from '@vueuse/core';
import { computed, useTemplateRef } from 'vue';

import CheckmarkIOS28 from '@/icons/icons/28/CheckmarkIOS28.vue';
import { bem } from '@/utils/bem';

const props = defineProps<{
  value: T;
  disabled?: boolean;
}>();

const currentValue = defineModel<T>({ required: true });
const checked = computed(() => currentValue.value === props.value);
const { pressed } = useMousePressed({ target: useTemplateRef('root') });
const { b, e } = bem('radio-ios');
</script>

<template>
  <label ref="root" :class="b({ checked, pressed })">
    <input
      v-show="false"
      v-model="currentValue"
      :value
      :disabled
      type="radio"
      @change="hapticFeedback.selectionChanged.ifAvailable()"
    >
    <CheckmarkIOS28 :size="19" :class="e('icon', { checked })"/>
  </label>
</template>

<style lang="scss">
@use "@/scss/mixins";

.radio-ios {
  @include mixins.clickable;
  display: inline-block;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1.5px var(--radio-ios-border-color, #C8C7CC);
  transition: 300ms ease;
  transition-property: transform, box-shadow;
  position: relative;
  box-sizing: border-box;
  --checked-color: var(--radio-ios-checked-color, #007AFF);

  &--checked {
    box-shadow: inset 0 0 0 11px var(--checked-color);
    border-color: var(--checked-color);
  }

  &--pressed {
    transform: scale(0.9);
  }

  &__icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--radio-ios-icon-color, white);
    transition: stroke-dashoffset 300ms ease;
    stroke-dasharray: 100;
    stroke-dashoffset: 100;

    &--checked {
      stroke-dashoffset: 78;
    }
  }
}
</style>
