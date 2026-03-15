import type { DefineQueryOptionsTagged, EntryKeyTagged } from '@pinia/colada';

import type { GqlApiRequestFn } from './useMakeGqlApiRequest';

type CreateOptionsFn<R> = (context: { request: GqlApiRequestFn }) => R;
type SetDataUpdaterHook<TData, TDataInitial> =
  ((data: TData | Exclude<TDataInitial, undefined>) => (
    | TData
    | Exclude<TDataInitial, undefined>
  ));
type SetDataUpdater<TData, TDataInitial> = (
  | TData
  | Exclude<TDataInitial, undefined>
  | SetDataUpdaterHook<TData, TDataInitial>
);

export function useQueryMeta<
  TData = unknown,
  TError = Error,
  TDataInitial extends TData | undefined = undefined,
>(
  createOptions: CreateOptionsFn<DefineQueryOptionsTagged<TData, TError, TDataInitial>>,
): {
  options: DefineQueryOptionsTagged<TData, TError, TDataInitial>;
  setData(updater: SetDataUpdater<TData, TDataInitial>): void;
};
export function useQueryMeta<
  TData = unknown,
  TError = Error,
  TDataInitial extends TData | undefined = undefined,
>(
  createOptions: CreateOptionsFn<() => DefineQueryOptionsTagged<TData, TError, TDataInitial>>,
): {
  options(): DefineQueryOptionsTagged<TData, TError, TDataInitial>;
  setData(updater: SetDataUpdater<TData, TDataInitial>): void;
};
export function useQueryMeta<
  Params,
  TData = unknown,
  TError = Error,
  TDataInitial extends TData | undefined = undefined,
>(
  createOptions: CreateOptionsFn<
    (params: Params) => DefineQueryOptionsTagged<TData, TError, TDataInitial>
  >,
): {
  options(params: Params): DefineQueryOptionsTagged<TData, TError, TDataInitial>;
  setData(params: Params, updater: SetDataUpdater<TData, TDataInitial>): void;
};
export function useQueryMeta<
  Params,
  TData = unknown,
  TError = Error,
  TDataInitial extends TData | undefined = undefined,
>(
  createOptions: CreateOptionsFn<
    | DefineQueryOptionsTagged<TData, TError, TDataInitial>
    | (() => DefineQueryOptionsTagged<TData, TError, TDataInitial>)
    | ((params: Params) => DefineQueryOptionsTagged<TData, TError, TDataInitial>)
  >,
): {
  options: (
    | DefineQueryOptionsTagged<TData, TError, TDataInitial>
    | (() => DefineQueryOptionsTagged<TData, TError, TDataInitial>)
    | ((params: Params) => DefineQueryOptionsTagged<TData, TError, TDataInitial>)
  );
  setData: (
    | ((updater: SetDataUpdater<TData, TDataInitial>) => void)
    | ((params: Params, updater: SetDataUpdater<TData, TDataInitial>) => void)
  );
} {
  const request = useMakeGqlApiRequest();
  const queryCache = useQueryCache();
  const options = createOptions({ request });

  return {
    options,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData(arg1: any, arg2: any) {
      let updater: SetDataUpdater<TData, TDataInitial>;
      let params: Params | undefined;
      if (arg2) {
        params = arg1;
        updater = arg2;
      } else {
        updater = arg1;
      }
      let key: EntryKeyTagged<TData, TError, TDataInitial>;
      if (params !== undefined) {
        key = (
          options as (params: Params) => DefineQueryOptionsTagged<TData, TError, TDataInitial>
        )(params).key;
      } else {
        key = typeof options === 'function'
          ? (options as () => DefineQueryOptionsTagged<TData, TError, TDataInitial>)().key
          : options.key;
      }
      if (typeof updater === 'function') {
        const prev = queryCache.getQueryData(key);
        if (prev !== undefined) {
          queryCache.setQueryData(key, () => {
            return (updater as SetDataUpdaterHook<TData, TDataInitial>)(prev);
          });
        }
      } else {
        queryCache.setQueryData(key, updater);
      }
    },
  };
}
