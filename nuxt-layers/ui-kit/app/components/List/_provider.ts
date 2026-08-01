export const {
  provide: provideListItemOptions,
  inject: injectListItemOptions,
} = createProvider<{
  large: MaybeRefOrGetter<boolean>;
  separator: MaybeRefOrGetter<boolean>;
}>();
