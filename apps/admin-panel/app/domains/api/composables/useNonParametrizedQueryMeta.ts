import type { DefineQueryOptionsTagged } from '@pinia/colada';

import {
  type UseParametrizedQueryMetaSetDataUpdater,
  type UseParametrizedQueryMetaCreateOptionsFn,
  useParametrizedQueryMeta,
} from './useParametrizedQueryMeta';

export function useNonParametrizedQueryMeta<
  TData = unknown,
  TError = Error,
  TDataInitial extends TData | undefined = undefined,
>(
  createOptions: UseParametrizedQueryMetaCreateOptionsFn<
    DefineQueryOptionsTagged<TData, TError, TDataInitial>
  >,
): {
  options: DefineQueryOptionsTagged<TData, TError, TDataInitial>;
  setData(updater: UseParametrizedQueryMetaSetDataUpdater<TData, TDataInitial>): void;
  invalidate(): void;
  getData(): TData | TDataInitial | undefined;
};

export function useNonParametrizedQueryMeta<
  TData = unknown,
  TError = Error,
  TDataInitial extends TData | undefined = undefined,
>(
  createOptions: UseParametrizedQueryMetaCreateOptionsFn<
    () => DefineQueryOptionsTagged<TData, TError, TDataInitial>
  >,
): {
  options: () => DefineQueryOptionsTagged<TData, TError, TDataInitial>;
  setData(updater: UseParametrizedQueryMetaSetDataUpdater<TData, TDataInitial>): void;
  invalidate(): void;
  getData(): TData | TDataInitial | undefined;
};

export function useNonParametrizedQueryMeta<
  TData = unknown,
  TError = Error,
  TDataInitial extends TData | undefined = undefined,
>(
  createOptions: UseParametrizedQueryMetaCreateOptionsFn<
    | DefineQueryOptionsTagged<TData, TError, TDataInitial>
    | (() => DefineQueryOptionsTagged<TData, TError, TDataInitial>)
  >,
): {
  options: (
    | DefineQueryOptionsTagged<TData, TError, TDataInitial>
    | (() => DefineQueryOptionsTagged<TData, TError, TDataInitial>)
  );
  setData(updater: UseParametrizedQueryMetaSetDataUpdater<TData, TDataInitial>): void;
  invalidate(): void;
  getData(): TData | TDataInitial | undefined;
} {
  const apiGqlRequest = useMakeApiGqlRequest();
  const options = createOptions({ apiGqlRequest });
  const queryMeta = useParametrizedQueryMeta(() => {
    return () => (typeof options === 'function' ? options() : options);
  });

  return {
    options,
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
