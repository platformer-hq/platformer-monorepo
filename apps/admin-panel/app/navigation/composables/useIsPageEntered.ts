import { injectPageTransition } from '../provider';

export function useIsPageEntered(page: string | symbol) {
  const context = injectPageTransition();
  return computed(() => context.enteredPage.value === page);
}
