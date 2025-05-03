import type { Accessor } from 'solid-js';

export type SignalsToRecordResult<T extends Record<string, Accessor<any>>> = {
  [K in keyof T]: ReturnType<T[K]>;
};

/**
 * Converts a map where values are functions to an object, where values are static, but have
 * only getters.
 * @param record - a record to convert.
 */
//@__NO_SIDE_EFFECTS__
export function signalsToRecord<T extends Record<string, Accessor<any>>>(record: T): SignalsToRecordResult<T> {
  return Object.entries(record).reduce<SignalsToRecordResult<T>>((acc, [k, accessor]) => {
    Object.defineProperty(acc, k, {
      enumerable: true,
      get(): any {
        return accessor();
      },
    });
    return acc;
  }, {} as SignalsToRecordResult<T>);
}
