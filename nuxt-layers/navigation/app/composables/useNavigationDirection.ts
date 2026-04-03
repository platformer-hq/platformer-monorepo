import { injectRoutingState } from '../routing-state';

export function useNavigationDirection() {
  return injectRoutingState().direction;
}
