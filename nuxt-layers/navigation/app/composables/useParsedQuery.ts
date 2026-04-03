/* eslint-disable @typescript-eslint/no-explicit-any */
import * as v from 'valibot';
import { useRoute, useRouter, type LocationQuery, type LocationQueryValue } from 'vue-router';
import { ref, watch, readonly } from 'vue';

type AnyLocationQueryValue = LocationQueryValue | LocationQueryValue[];
type AnyLocationQueryInputValue = AnyLocationQueryValue | undefined;
type AnyLocationQueryOutputValue = AnyLocationQueryValue;

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
  const router = useRouter();
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

  watch(() => route.query, () => {
    parsedQuery.value = parseQuery(route.query);
  });

  return {
    query: readonly(parsedQuery),
    update(
      state: { [K in keyof ResolvedSchema<F>]?: v.InferOutput<ResolvedSchema<F>[K]> },
      options: { replace?: boolean } = {},
    ) {
      parsedQuery.value = {
        ...parsedQuery.value,
        ...Object
          .entries(state)
          .reduce<{
          [K in keyof ResolvedSchema<F>]?: v.InferOutput<ResolvedSchema<F>[K]>
        }>((acc, [key, value]) => {
            if (value !== undefined) {
              (acc as any)[key] = value;
            }
            return acc;
          }, {}),
      };

      const query: LocationQuery = {};
      for (const field in resolvedFields) {
        query[field] = resolvedFields[field].serialize(parsedQuery.value[field]) ?? null;
      }
      router.push({ query, replace: options.replace });
    },
  };
}
