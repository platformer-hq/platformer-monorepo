import type { BackgroundColor, BottomBarColor, MiniAppHeaderColor } from '@telegram-apps/sdk-solid';

export type Locale = 'en' | 'ru';

export type InitialColorsTuple = [
  header: MiniAppHeaderColor,
  background: BackgroundColor,
  bottomBar: BottomBarColor
];