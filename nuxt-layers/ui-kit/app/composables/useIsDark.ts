import { miniApp, useSignal } from '@tma.js/sdk-vue';

export function useIsDark() {
  return useSignal(miniApp.isDark);
}
