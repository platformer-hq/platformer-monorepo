import { injectViewTransition } from '../provider';

export function useIsViewEntered() {
  return injectViewTransition().isEntered;
}
