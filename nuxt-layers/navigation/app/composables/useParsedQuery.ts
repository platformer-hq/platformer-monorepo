/* eslint-disable @typescript-eslint/no-explicit-any */
import * as v from 'valibot';
import type { LocationQuery, LocationQueryValue } from 'vue-router';

type SerializedValue = string | null | undefined;
type InputValue = LocationQueryValue | LocationQueryValue[] | undefined;

interface FieldOptions<TOutput> {
  schema: v.BaseSchema<InputValue, TOutput, v.BaseIssue<unknown>>;
  serialize: (ouput: TOutput) => SerializedValue;
}

type FieldsSchema<Fields extends object> = {
  [K in keyof Fields]: (
    | FieldOptions<Fields[K]>
    | (
      Fields[K] extends SerializedValue
        ? v.BaseSchema<InputValue, Fields[K], v.BaseIssue<unknown>>
        : never
    )
  )
};
type ResolvedFields<TFields extends object> = {
  [K in keyof TFields]: TFields[K] extends FieldOptions<any>
    ? TFields[K]
    : TFields[K] extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
      ? FieldOptions<v.InferOutput<TFields[K]>>
      : never;
};
type ResolvedSchema<TFields extends object> = {
  [K in keyof TFields]: ResolvedFields<TFields>[K]['schema'];
};

export function useParsedQuery<TFields extends object>(fields: FieldsSchema<TFields>) {
  const route = useRoute();
  const router = useRouter();
  const resolvedFields = {} as ResolvedFields<TFields>;
  for (const field in fields) {
    (resolvedFields as any)[field] = 'schema' in fields[field]
      ? fields[field]
      : {
        schema: fields[field],
        serialize: (v: InputValue) => v,
      };
  }
  const resolvedSchema = {} as ResolvedSchema<TFields>;
  for (const field in resolvedFields) {
    (resolvedSchema as any)[field] = resolvedFields[field].schema;
  }
  const parseQuery = (query: LocationQuery): TFields => {
    return v.parse(v.looseObject(resolvedSchema), query) as TFields;
  };
  const parsedQuery = ref(parseQuery(route.query));

  watch(() => route.query, () => {
    parsedQuery.value = parseQuery(route.query);
  });

  return {
    query: readonly(parsedQuery),
    update(state: Partial<TFields>, options: { replace?: boolean } = {}) {
      parsedQuery.value = {
        ...parsedQuery.value,
        ...Object
          .entries(state)
          .reduce<{
          [K in keyof ResolvedSchema<TFields>]?: v.InferOutput<ResolvedSchema<TFields>[K]>
        }>((acc, [key, value]) => {
            if (value !== undefined) {
              (acc as any)[key] = value;
            }
            return acc;
          }, {}),
      };

      const query: LocationQuery = {};
      for (const field in resolvedFields) {
        const serialized = resolvedFields[field].serialize(parsedQuery.value[field]);
        if (serialized !== null && serialized !== undefined) {
          query[field] = serialized;
        }
      }
      return router.push({ query, replace: options.replace });
    },
  };
}
