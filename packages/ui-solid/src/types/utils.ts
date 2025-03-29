/**
 * Marks specified properties as optional.
 */
export type PartialBy<T, K extends keyof T> = T extends infer T1
  ? T1 extends infer T2 extends T
    ? Omit<T2, K> & Partial<Pick<T2, K>>
    : never
  : never;

/**
 * Marks specified properties as required.
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
