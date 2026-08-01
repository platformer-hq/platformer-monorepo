import { injectUiKitPlatform } from '~ui-kit/utils/platform-provider';

export function usePlatform() {
  const injected = injectUiKitPlatform('ios');
  return computed(() => toValue(injected));
}
