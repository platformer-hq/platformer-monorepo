import type { HeaderColorKey, RGB } from '@telegram-apps/sdk-solid';
import type { Logger as UtilsLogger } from 'utils';

export type Locale = 'en' | 'ru';

export type Logger = Pick<UtilsLogger, 'log'>;

export type InitialColorsTuple = [
  header: MiniAppHeaderColor,
  background: BackgroundColor,
  bottomBar: BottomBarColor
];