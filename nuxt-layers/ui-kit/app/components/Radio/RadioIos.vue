<script setup lang="ts" generic="T extends string | number | boolean">
import { hapticFeedback } from '@tma.js/sdk-vue';
import { useMousePressed } from '@vueuse/core';

const props = defineProps<{
  value: T;
  disabled?: boolean;
}>();

const currentValue = defineModel<T>({ required: true });
const checked = computed(() => currentValue.value === props.value);
const { pressed } = useMousePressed({ target: useTemplateRef('root') });
const { b, e } = bem('tgui-radio-ios');
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
    <svg
      :class="e('icon', { checked })"
      width="19"
      height="19"
      viewBox="0 0 16 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.5 15.5L5.83176 20.7944C5.91474 20.8958 6.07258 20.8866 6.14322 20.7762L14 8.5"
        stroke="currentcolor"
        stroke-width="2.33"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </label>
</template>

<style lang="scss">
@use "~scss/mixins";

.tgui-radio-ios {
  @include mixins.clickable;
  display: inline-block;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1.5px var(--tgui-radio-ios-border-color, #C8C7CC);
  transition: 300ms ease;
  transition-property: transform, box-shadow;
  position: relative;
  box-sizing: border-box;
  --checked-color: var(--tgui-radio-ios-checked-color, #007AFF);

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
    color: var(--tgui-radio-ios-icon-color, white);
    transition: stroke-dashoffset 300ms ease;
    stroke-dasharray: 100;
    stroke-dashoffset: 100;

    &--checked {
      stroke-dashoffset: 78;
    }
  }
}
</style>
