/* eslint-disable @typescript-eslint/no-explicit-any */
import * as v from 'valibot';
import type { LocationQuery, LocationQueryValue } from 'vue-router';

type AnyLocationQueryValue = LocationQueryValue | LocationQueryValue[];
type AnyLocationQueryInputValue = AnyLocationQueryValue | undefined;
type AnyLocationQueryOutputValue = AnyLocationQueryValue | undefined;

interface FieldOptions<T> {
  schema: v.BaseSchema<AnyLocationQueryInputValue, T, v.BaseIssue<unknown>>;
  serialize(input: T): AnyLocationQueryOutputValue;
}
type AnyFields = {
  [key: string]: (
    | FieldOptions<unknown>
    | v.BaseSchema<AnyLocationQueryInputValue, unknown, v.BaseIssue<unknown>>
  );
};
type ResolvedFields<F extends AnyFields> = {
  [K in keyof F]: F[K] extends FieldOptions<any>
    ? F[K]
    : F[K] extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
      ? FieldOptions<v.InferOutput<F[K]>>
      : never;
};
type ResolvedSchema<F extends AnyFields> = {
  [K in keyof F]: ResolvedFields<F>[K]['schema'];
};

export function useParsedQuery<F extends AnyFields>(fields: F) {
  const route = useRoute();
  const resolvedFields = {} as ResolvedFields<F>;
  for (const field in fields) {
    (resolvedFields as any)[field] = 'schema' in (fields as any)[field]
      ? fields[field]
      : {
        schema: fields[field],
        serialize: (v: AnyLocationQueryValue) => v,
      };
  }
  const resolvedSchema = {} as ResolvedSchema<F>;
  for (const field in resolvedFields) {
    (resolvedSchema as any)[field] = resolvedFields[field].schema;
  }
  const parseQuery = (query: LocationQuery) => {
    return v.parse(v.looseObject(resolvedSchema), query);
  };
  const parsedQuery = ref<{
    [K in keyof ResolvedSchema<F>]: v.InferOutput<ResolvedSchema<F>[K]>
  }>(parseQuery(route.query));

  watch(parsedQuery, q => {
    const query: LocationQuery = {};
    for (const field in resolvedFields) {
      query[field] = resolvedFields[field].serialize(q[field]) ?? null;
    }
    navigateTo({ query });
  }, { deep: true });

  watch(() => route.query, parseQuery);

  return parsedQuery;
}
