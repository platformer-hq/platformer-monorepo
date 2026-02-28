<script lang="ts" setup>
import { useMousePressed } from '@vueuse/core';

import type { ColorBoxAnyColor } from '@/domains/colors/components/ColorBox.vue';

import type { KnownHtmlTag } from '#layers/ui-kit';

type PlatformBasedBoolOption = boolean | 'android' | 'ios' | 'auto';

export interface ButtonBaseProps {
  /**
   * @default 'button'
   */
  as?: KnownHtmlTag;
  palette?: 'filled' | 'tinted' | 'plain' | 'gray' | 'disabled' | {
    bg?: ColorBoxAnyColor;
    text?: ColorBoxAnyColor;
  };
  /**
   * True if the button should take all available width.
   */
  fullWidth?: boolean;
  /**
   * True if the button is active. This automatically enables or disables all "auto" properties
   * until the values are specified explicitly.
   */
  active?: boolean;
  /**
   * True if the button is clickable. This makes the button display cursor pointer.
   */
  clickable?: boolean;
  /**
   * True if the button is visually elevated.
   */
  elevated?: boolean;
  /**
   * Scales down the button on activation.
   * - True to enable on all platforms.
   * - False to disable on all platforms.
   * - `ios` or `android` to enable on specific platforms.
   * - `auto` to enable on Android, but disable on iOS.
   */
  pressable?: PlatformBasedBoolOption;
  /**
   * Highlights the button on activation.
   * - True to enable on all platforms.
   * - False to disable on all platforms.
   * - `ios` or `android` to enable on specific platforms.
   * - `auto` to enable on iOS, but disable on Android.
   * @default 'auto'
   */
  highlightOnActive?: PlatformBasedBoolOption;
  /**
   * Adds ripples on touch.
   * - True to enable on all platforms.
   * - False to disable on all platforms.
   * - `ios` or `android` to enable on specific platforms.
   * - `auto` to enable on Android, but disable on iOS.
   * @default 'auto'
   */
  ripples?: PlatformBasedBoolOption;
  /**
   * True if the button should have rounded corners.
   */
  rounded?: boolean;
}

const { as = 'button', ...props } = defineProps<ButtonBaseProps>();

const { b, e } = bem('button-base');
const colors = computed(() => {
  const { palette } = props;
  const [text, bg] = (
    typeof palette === 'string'
      ? ({
        filled: ['button-text', 'button'],
        tinted: ['accent-text', 'secondary-accent'],
        plain: ['accent-text', 'section-bg'],
        gray: ['text', 'tertiary-fill-bg'],
        disabled: ['text-main-disabled', 'button-main-disabled'],
      } as const)[palette]
      : palette
        ? [palette.text, palette.bg]
        : []
  );

  return { text, bg };
});

const createVisualSignal = (key: 'highlightOnActive' | 'ripples' | 'pressable') => {
  return computed(() => {
    if (props[key] !== undefined) {
      return props[key];
    }
    if (props.active !== undefined) {
      return props.active ? 'auto' : false;
    }
    return 'auto';
  });
};
const computedHighlightOnActive = createVisualSignal('highlightOnActive');
const computedRipples = createVisualSignal('ripples');
const computedPressable = createVisualSignal('pressable');
const computedClickable = computed(() => (
  props.active === undefined
    ? props.clickable ?? true
    : props.active
));

const rootRef = useTemplateRef('root');
const cssFilter = useIsCssFilterAllowed();
const { pressed } = useMousePressed({ target: computed(() => rootRef.value?.element) });
const platform = useTmaPlatform();
const onLeave = (el: Element, done: VoidFunction) => {
  el
    .animate({ opacity: [0.1, 0] }, { duration: 300 })
    .finished
    .then(() => {
      done();
    });
};
const platformBasedBoolOptionToBool = (
  value: PlatformBasedBoolOption,
  defaultTrueFor: 'ios' | 'android',
) => {
  return value === true
    || (
      platform.value.isMappedIos
      && (value === 'ios' || (value === 'auto' && defaultTrueFor === 'ios'))
    )
    || (
      platform.value.isMappedAndroid
      && ((value === 'auto' && defaultTrueFor === 'android') || value === 'android')
    );
};
</script>

<template>
  <ColorBox
    v-bind="colors"
    ref="root"
    :as
    :class="b({
      'full-width': fullWidth,
      clickable: computedClickable,
      pressed: platformBasedBoolOptionToBool(computedPressable, 'android') && pressed,
      rounded,
      elevated,
      'elevated-filter': elevated && cssFilter
    })"
  >
    <Transition
      v-if="platformBasedBoolOptionToBool(computedHighlightOnActive, 'ios')"
      :css="false"
      @leave="onLeave"
    >
      <span v-if="pressed" key="active" :class="e('highlight')"/>
    </Transition>
    <slot/>
    <UiRipples
      v-if="platformBasedBoolOptionToBool(computedRipples, 'android')"
      as="span"
      :class="e('ripples')"
    />
  </ColorBox>
</template>

<style lang="scss">
@use "@/domains/styles/mixins";

.button-base {
  appearance: none;
  outline: none;
  border: none;
  background: none;
  transition: 200ms ease-out;
  position: relative;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  @include mixins.noHighlight;

  &--elevated {
    box-shadow: var(--elevated-box-shadow);
  }

  &--elevated-filter {
    backdrop-filter: blur(15px);
  }

  &--full-width {
    width: 100%;
  }

  &--clickable {
    @include mixins.clickable;
  }

  &--pressed {
    transform: scale(0.95);
  }

  &--rounded {
    border-radius: 1000px;
    overflow: hidden;
  }

  &__ripples {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: inherit;
    overflow: hidden;
  }

  &__highlight {
    background: currentColor;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    opacity: 0.1;
    pointer-events: none;
    overflow: hidden;
  }
}
</style>
