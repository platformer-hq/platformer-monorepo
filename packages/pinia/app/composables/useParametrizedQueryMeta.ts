import type { DefineQueryOptionsTagged } from '@pinia/colada';

export type UseParametrizedQueryMetaSetDataUpdaterHook<TData, TDataInitial> =
  ((data: TData | Exclude<TDataInitial, undefined>) => (
    | TData
    | Exclude<TDataInitial, undefined>
  ));
export type UseParametrizedQueryMetaSetDataUpdater<TData, TDataInitial> = (
  | TData
  | Exclude<TDataInitial, undefined>
  | UseParametrizedQueryMetaSetDataUpdaterHook<TData, TDataInitial>
);

export function useParametrizedQueryMeta<
  Params,
  TData = unknown,
  TError = Error,
  TDataInitial extends TData | undefined = undefined,
>(
  options: (params: Params) => DefineQueryOptionsTagged<TData, TError, TDataInitial>,
): {
  setData(
    params: Params,
    updater: UseParametrizedQueryMetaSetDataUpdater<TData, TDataInitial>
  ): void;
  invalidate(params: Params): void;
  getData(params: Params): TData | TDataInitial | undefined;
} {
  const queryCache = useQueryCache();

  return {
    setData(params, updater) {
      const key = (typeof options === 'function' ? options(params) : options).key;
      if (typeof updater !== 'function') {
        queryCache.setQueryData(key, updater);
        return;
      }
      const prev = queryCache.getQueryData(key);
      if (prev !== undefined) {
        queryCache.setQueryData(key, () => {
          return (updater as UseParametrizedQueryMetaSetDataUpdaterHook<TData, TDataInitial>)(prev);
        });
      }
    },
    invalidate(params) {
      queryCache.invalidateQueries({
        key: (typeof options === 'function' ? options(params) : options).key,
      });
    },
    getData(params) {
      return queryCache.getQueryData(
        (typeof options === 'function' ? options(params) : options).key,
      );
    },
  };
}
