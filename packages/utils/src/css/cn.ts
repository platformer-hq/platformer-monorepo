export function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

/**
 * Function which joins passed values with space following these rules:
 * 1. If value is non-empty string, it will be added to output.
 * 2. If value is object, only those keys will be added, which values are truthy.
 * 3. If value is array, classNames will be called with this value spread.
 * 4. All other values are ignored.
 *
 * You can find this function to similar one from the package {@link https://www.npmjs.com/package/classnames|classnames}.
 * @param values - values array.
 * @returns Final class name.
 */
export function cn(...values: any[]): string {
  return values
    .map((value) => {
      if (typeof value === 'string') {
        return value;
      }

      if (isRecord(value)) {
        return cn(Object.entries(value).map((entry) => entry[1] && entry[0]));
      }

      if (Array.isArray(value)) {
        return cn(...value);
      }
    })
    .filter(Boolean)
    .join(' ');
}
