import type { DefineQueryOptionsTagged } from '@pinia/colada';

import {
  type UseParametrizedQueryMetaSetDataUpdater,
  useParametrizedQueryMeta,
} from './useParametrizedQueryMeta';

export function useNonParametrizedQueryMeta<
  TData = unknown,
  TError = Error,
  TDataInitial extends TData | undefined = undefined,
>(
  options: (
    | DefineQueryOptionsTagged<TData, TError, TDataInitial>
    | (() => DefineQueryOptionsTagged<TData, TError, TDataInitial>)
  ),
): {
  setData(updater: UseParametrizedQueryMetaSetDataUpdater<TData, TDataInitial>): void;
  invalidate(): void;
  getData(): TData | TDataInitial | undefined;
} {
  const queryMeta = useParametrizedQueryMeta(() => {
    return typeof options === 'function' ? options() : options;
  });

  return {
    setData(updater) {
      queryMeta.setData([], updater);
    },
    invalidate() {
      queryMeta.invalidate([]);
    },
    getData() {
      return queryMeta.getData([]);
    },
  };
}
