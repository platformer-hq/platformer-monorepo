import { injectViewTransition } from '../provider';

export function useIsPageEntered(page: string) {
  const context = injectViewTransition();
  return computed(() => context.enteredPage.value === page);
}
