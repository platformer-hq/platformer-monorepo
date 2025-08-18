import type { RGB } from '@telegram-apps/sdk-vue';

export type Locale = 'en' | 'ru';

export type InitialColorsTuple = [
  header: RGB | string,
  background: RGB | undefined,
  bottomBar: RGB | undefined,
];
