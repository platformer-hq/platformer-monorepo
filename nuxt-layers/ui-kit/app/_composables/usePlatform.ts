import { injectUiKitPlatform } from '~/utils/platform-provider';

export function usePlatform() {
  const injected = injectUiKitPlatform('ios');
  return computed(() => toValue(injected));
}
