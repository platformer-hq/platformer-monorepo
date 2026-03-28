type Result<T extends string | number | undefined | null> =
  | string
  | (undefined extends T ? undefined : never);

/**
 * - Adds "px" suffix to the value if the value is of type "number".
 * - Returns the value is the value of type "string".
 * - Returns null otherwise.
 * @param value
 * @returns
 */
export function toPx<T extends string | number | null | undefined>(value: T): Result<T> {
  return (
    typeof value === 'string' || typeof value === 'number'
      ? typeof value === 'string' ? value : `${value}px`
      : null
  ) as Result<T>;
}
