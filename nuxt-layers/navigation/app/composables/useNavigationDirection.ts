import { injectNavigationState } from '../provider.js';

export function useNavigationDirection() {
  const state = injectNavigationState();
  return computed(() => toValue(state.direction));
}
