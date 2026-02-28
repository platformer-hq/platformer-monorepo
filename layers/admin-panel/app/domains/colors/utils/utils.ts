import type { KnownThemeParamsKey as SdkKnownThemeParamsKey } from '@tma.js/sdk-vue';

import type {
  AnyKnownColorKey,
  KnownCustomColorKey,
  KnownMiniAppColorKey,
  KnownThemeParamsKey,
} from '../types';

const knownThemeKeyToSdkKnownThemeKeyMap = {
  'accent-text': 'accent_text_color',
  bg: 'bg_color',
  button: 'button_color',
  'button-text': 'button_text_color',
  'destructive-text': 'destructive_text_color',
  hint: 'hint_color',
  link: 'link_color',
  'secondary-bg': 'secondary_bg_color',
  'section-bg': 'section_bg_color',
  'subtitle-text': 'subtitle_text_color',
  'section-header-text': 'section_header_text_color',
  text: 'text_color',
  'bottom-bar-bg': 'bottom_bar_bg_color',
  'header-bg': 'header_bg_color',
  'section-separator': 'section_separator_color',
} satisfies Record<KnownThemeParamsKey, SdkKnownThemeParamsKey>;

const knownCustomColorKeyMap = {
  'quaternary-fill-bg': 1,
  'tertiary-fill-bg': 1,
  'separator-non-opaque': 1,
} satisfies Record<KnownCustomColorKey, 1>;

const knownMiniAppColorKeyMap = {
  'app-header': 1,
  'app-bottom-bar': 1,
  'app-bg': 1,
} satisfies Record<KnownMiniAppColorKey, 1>;

export function isKnownThemeParamsKey(value: unknown): value is KnownThemeParamsKey {
  return typeof value === 'string' && value in knownThemeKeyToSdkKnownThemeKeyMap;
}

export function isAnyKnownColorKey(value: unknown): value is AnyKnownColorKey {
  if (typeof value !== 'string') {
    return false;
  }
  return isKnownThemeParamsKey(value)
    || value in knownCustomColorKeyMap
    || value in knownMiniAppColorKeyMap;
}

export function knownThemeKeyToSdkKnownThemeKey(key: KnownThemeParamsKey): SdkKnownThemeParamsKey {
  return knownThemeKeyToSdkKnownThemeKeyMap[key];
}

export type ColorReferenceAnyColor = AnyKnownColorKey | string;
type ColorReferenceResult<T extends Maybe<ColorReferenceAnyColor>> =
  T extends (null | undefined) ? string | null : string;

/**
 * Converts the value to a CSS variable reference if the value is any known color key. Returns
 * the value itself otherwise.
 */
export function colorReference<T extends Maybe<ColorReferenceAnyColor>>(
  color: T,
): ColorReferenceResult<T> {
  return (
    color
      ? isAnyKnownColorKey(color)
        ? `var(--${color}-color)`
        : color
      : null
  ) as ColorReferenceResult<T>;
}
