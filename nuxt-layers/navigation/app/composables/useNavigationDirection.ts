import { injectRoutingState } from '../routing-state.js';

export function useNavigationDirection() {
  return injectRoutingState().direction;
}
