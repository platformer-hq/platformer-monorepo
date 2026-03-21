import type { DefineQueryOptionsTagged } from '@pinia/colada';

import {
  useParametrizedQueryMeta as _useParametrizedQueryMeta,
  type UseParametrizedQueryMetaSetDataUpdater,
} from '#layers/pinia';

export type { UseParametrizedQueryMetaSetDataUpdater };

export type UseParametrizedQueryMetaCreateOptionsFn<R> = (context: {
  apiGqlRequest: GqlApiRequestFn;
}) => R;

export function useParametrizedQueryMeta<
  Params,
  TData = unknown,
  TError = Error,
  TDataInitial extends TData | undefined = undefined,
>(
  createOptions: UseParametrizedQueryMetaCreateOptionsFn<
    (params: Params) => DefineQueryOptionsTagged<TData, TError, TDataInitial>
  >,
): {
  options(params: Params): DefineQueryOptionsTagged<TData, TError, TDataInitial>;
  setData(
    params: Params,
    updater: UseParametrizedQueryMetaSetDataUpdater<TData, TDataInitial>
  ): void;
  invalidate(params: Params): void;
  getData(params: Params): TData | TDataInitial | undefined;
} {
  const apiGqlRequest = useMakeApiGqlRequest();
  const options = createOptions({ apiGqlRequest });
  return {
    options,
    ..._useParametrizedQueryMeta(options),
  };
}
