<script setup lang="ts">
import { reactivePick } from '@vueuse/core';

import type { ButtonBaseProps } from '#packages/ui-kit';

interface IosSpecificProps {
  /**
   * True if the button is visually elevated.
   */
  elevated?: boolean;
  /**
   * Highlights the button on activation.
   * @default True if `active` property is omitted or equal to `true`.
   */
  highlightOnActive?: boolean;
}

interface AndroidSpecificProps {
  /**
   * Scales down the button on activation.
   * @default True if `active` property is omitted or equal to `true`.
   */
  pressable?: boolean;
  /**
   * Adds ripples on touch.
   * @default True if `active` property is omitted or equal to `true`.
   */
  ripples?: boolean;
}

interface Props extends Omit<ButtonBaseProps, 'palette'>, IosSpecificProps, AndroidSpecificProps {
  /**
   * True if the button is active. This value is used as a default for `pressable`, `ripples`
   * and `clickable` properties.
   */
  active?: boolean;
  palette?: ButtonBaseProps['palette'] | {
    bg?: ColorReferenceAnyColor;
    text?: ColorReferenceAnyColor;
  };
  /**
   * True if the button is clickable. This makes the button display cursor pointer.
   * @default True if `active` property is omitted or equal to `true`.
   */
  clickable?: boolean;
  /**
   * @default 'regular'
   */
  variant?: 'regular' | 'small' | 'multiline';
}

const props = withDefaults(defineProps<Props>(), {
  clickable: undefined,
  active: undefined,
  ripples: undefined,
  highlightOnActive: undefined,
  pressable: undefined,
});

const platform = useTmaPlatform();
const formattedPalette = computed(() => (
  typeof props.palette === 'string' ? props.palette : undefined
));
const sharedProps = reactivePick(props, [
  'fullWidth', 'as', 'variant', 'clickable', 'active',
]);
const style = computed(() => (
  typeof props.palette === 'object'
    ? ({
      background: colorReference(props.palette.bg) || undefined,
      color: colorReference(props.palette.text) || undefined,
    })
    : undefined
));
</script>

<template>
  <ButtonAndroid
    v-if="platform.isMappedAndroid"
    v-bind="sharedProps"
    :palette="formattedPalette"
    :style="style"
    :ripples
    :pressable
  >
    <slot/>
  </ButtonAndroid>
  <ButtonIos
    v-else
    v-bind="sharedProps"
    :style="style"
    :highlight-on-active
    :elevated
    :palette="formattedPalette"
  >
    <slot/>
  </ButtonIos>
</template>
