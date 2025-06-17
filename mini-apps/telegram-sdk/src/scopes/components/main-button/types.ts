import type { RGB } from '@mini-apps/telegram-types';

export interface State {
  backgroundColor?: RGB;
  hasShineEffect: boolean;
  isEnabled: boolean;
  isLoaderVisible: boolean;
  isVisible: boolean;
  text: string;
  textColor?: RGB;
}
