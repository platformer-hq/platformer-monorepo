import type { QueryClient, QueryKey, Updater } from '@tanstack/vue-query';
import { produce } from 'immer';

type SetterUpdater<D> = Updater<D | undefined, D | undefined>;

export function createQueryDataSetterDynamic<D, F extends (...args: any) => QueryKey>(
  queryKey: F,
) {
  return (args: Parameters<F>, client: QueryClient, updater: SetterUpdater<D>) => {
    const update = typeof updater === 'function' ? updater : () => updater;
    return client.setQueryData<D, D>(
      queryKey(...args),
      draft => produce(draft, value => {
        // @ts-expect-error Everything is fine here.
        return update(value);
      }),
    );
  };
}

export function createQueryDataSetter<D, K extends QueryKey>(queryKey: K | (() => K)) {
  const setter = createQueryDataSetterDynamic(() => {
    return typeof queryKey === 'function' ? queryKey() : queryKey;
  });
  return (client: QueryClient, updater: SetterUpdater<D>) => {
    setter([], client, updater);
  };
}

export function createQueryDataRefetcher(queryKey: QueryKey | (() => QueryKey)) {
  const refetch = createQueryDataRefetcherDynamic(() => {
    return typeof queryKey === 'function' ? queryKey() : queryKey;
  });
  return (client: QueryClient) => refetch([], client);
}

export function createQueryDataRefetcherDynamic<F extends (...args: any) => QueryKey>(
  queryKey: F,
) {
  return (args: Parameters<F>, client: QueryClient) => {
    return client.refetchQueries({ queryKey: queryKey(...args) });
  };
}
