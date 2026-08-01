export const {
  provide: provideListItemOptions,
  inject: injectListItemOptions,
} = createProvide<{
  large: MaybeRefOrGetter<boolean>;
  separator: MaybeRefOrGetter<boolean>;
}>('list-item');
