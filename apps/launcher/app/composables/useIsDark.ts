import { miniApp, useSignal } from '@tma.js/sdk-vue';

/**
 * @returns True if the current theme is considered dark.
 */
export function useIsDark() {
  return useSignal(miniApp.isDark);
}
