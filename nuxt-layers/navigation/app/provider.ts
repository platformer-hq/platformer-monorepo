export type NavigationDirection = 'initial' | 'forward' | 'backward';

export const {
  provide: provideNavigationState,
  inject: injectNavigationState,
} = createProvide<{
  direction: MaybeRefOrGetter<NavigationDirection>;
}>('routing-state');
