<script lang="ts" setup>
import type { KnownCssColorToken } from '~colors/generated';
import { usePlatform } from '~ui-kit/_composables/usePlatform';
import type { KnownHtmlTag, KnownPlatform } from '~ui-kit/types';

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

interface IosSpecificProps {
  /**
   * Highlights the button on activation.
   * @default True if `active` property is omitted or equal to `true`.
   */
  highlightOnActive?: boolean;
}

export type ButtonBasePaletteColor = KnownCssColorToken | { kind: 'custom'; color: string };

export interface ButtonBaseProps extends AndroidSpecificProps, IosSpecificProps {
  /**
   * True if the button is active. This value is used as a default for `pressable`, `ripples`
   * and `clickable` properties.
   */
  active?: boolean;
  /**
   * @default 'button'
   */
  as?: KnownHtmlTag;
  /**
   * Should effect of liquid glass box shadow be applied.
   * - `ios` - apply only for ios.
   * - `android` - apply only for android.
   * - `all` - apply for all platforms.
   */
  glass?: KnownPlatform | 'all';
  /**
   * Should effect of liquid glass backdrop filter be applied. This value will only be applied
   * if `glass` property is used.
   * - `ios` - apply only for ios.
   * - `android` - apply only for android.
   * - `all` - apply for all platforms.
   * @default 'ios'
   */
  glassFilter?: KnownPlatform | 'all';
  palette?: 'filled' | 'tinted' | 'plain' | 'gray' | 'disabled' | {
    /**
     * Background color.
     */
    bg?: ButtonBasePaletteColor;
    /**
     * Text color.
     */
    text?: ButtonBasePaletteColor;
    /**
     * Border color.
     */
    border?: ButtonBasePaletteColor;
  };
  /**
   * True if the button should take all available width.
   */
  fullWidth?: boolean;
  /**
   * True if the button is clickable. This makes the button display cursor pointer.
   * @default true
   */
  clickable?: boolean;
}

const props = withDefaults(defineProps<ButtonBaseProps>(), {
  as: 'button',
  clickable: undefined,
  active: undefined,
  ripples: undefined,
  highlightOnActive: undefined,
  pressable: undefined,
  glassFilter: 'ios',
});

const rootRef = useTemplateRef<HTMLElement>('root');
const platform = usePlatform();

const { b } = bem('button-base');
const basedOnActive = (key: 'ripples' | 'pressable' | 'clickable' | 'highlightOnActive') => {
  return props[key] ?? props.active ?? true;
};
const pressed = ref(false);
const applyGlass = computed(() => (props.glass === 'all' || platform.value === props.glass));

useRipples({
  enabled: () => platform.value === 'android' && basedOnActive('ripples'),
  containerRef: rootRef,
  clickRef: rootRef,
});

defineExpose({ element: rootRef });
</script>

<template>
  <component
    :is="as"
    ref="root"
    :class="b(
      {
        'full-width': fullWidth,
        clickable: basedOnActive('clickable'),
        'android-pressed': platform === 'android' && basedOnActive('pressable') && pressed,
        glass: applyGlass,
        'glass-filter': applyGlass && (glassFilter === 'all' || glassFilter === platform),
      },
      typeof palette === 'string' && palette,
      platform,
    )"
    :style="typeof palette === 'object' && {
      '--button-base-bg-color': typeof palette.bg === 'string'
        ? cssColorTokenReference(palette.bg)
        : palette.bg?.color,
      '--button-base-text-color': typeof palette.text === 'string'
        ? cssColorTokenReference(palette.text)
        : palette.text?.color,
      '--button-base-border-color': typeof palette.border === 'string'
        ? cssColorTokenReference(palette.border)
        : palette.border?.color,
    }"
    @pointerdown="pressed = true"
    @pointerup="pressed = false"
    @pointerleave="pressed = false"
    @pointercancel="pressed = false"
  >
    <IosActivationHighlight
      v-if="platform === 'ios'"
      :show="basedOnActive('highlightOnActive') && pressed"
    />
    <slot/>
  </component>
</template>

<style lang="scss">
@use "sass:list";

.button-base {
  appearance: none;
  outline: none;
  border: 1px solid var(--button-base-border-color, transparent);
  background: var(--button-base-bg-color, transparent);
  color: var(--button-base-text-color, initial);
  transition: 200ms ease-out;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  @include mixins.noHighlight;

  &--full-width {
    width: 100%;
  }

  &--clickable {
    @include mixins.clickable;
  }

  &--android {
    overflow: hidden;

    &-pressed {
      transform: scale(0.95);
    }
  }

  &--glass {
    box-shadow: var(--glass-box-shadow);
  }

  &--glass-filter {
    backdrop-filter: var(--glass-backdrop-filter);
  }

  @each $name, $settings in (
    "filled": (var(--button-text-color), var(--button-color)),
    "gray": (var(--text-color), var(--tertiary-fill-bg-color)),
    "tinted": (var(--accent-text-color), var(--secondary-accent-color)),
    "disabled": (var(--text-main-disabled-color), var(--button-main-disabled-color)),
  ) {
    &--#{$name} {
      color: list.nth($settings, 1);
      background-color: list.nth($settings, 2);
    }
  }
}
</style>
