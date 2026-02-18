import type { KnownThemeParamsKey as SDKKnownThemeParamsKey } from '@tma.js/sdk-vue';

type RemoveColor<T extends string> = T extends `${infer U}_color` ? U : never;
type ReplaceLodash<T extends string> = T extends `${infer A}_${infer B}`
  ? `${A}-${ReplaceLodash<B>}`
  : T;

/**
 * List of known Telegram Mini Apps palette colors. These are shared between all mini applications
 * on the platform.
 */
export type KnownThemeParamsKey = SDKKnownThemeParamsKey extends (infer U extends string)
  ? ReplaceLodash<RemoveColor<U>>
  : never;

/**
 * List of known specific Telegram Mini Apps colors bound to the UI. These colors are specifically
 * bound to the SDK's `MiniApp` feature.
 */
export type KnownMiniAppColorKey = 'app-header' | 'app-bottom-bar' | 'app-bg';

/**
 * List of all known color keys.
 */
export type AnyKnownColorKey = KnownThemeParamsKey | KnownMiniAppColorKey;
