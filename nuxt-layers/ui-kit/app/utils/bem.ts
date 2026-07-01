function isRecord(v: unknown): v is Record<string, unknown> {
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
function cn(...values: unknown[]): string {
  return values
    .map(value => {
      if (typeof value === 'string') {
        return value;
      }

      if (isRecord(value)) {
        return cn(Object.entries(value).map(entry => entry[1] && entry[0]));
      }

      if (Array.isArray(value)) {
        return cn(...value);
      }
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * Applies mods to the specified element.
 * @param element - element name.
 * @param mod - mod to apply.
 */
function applyMods(element: string, mod: unknown): string {
  if (Array.isArray(mod)) {
    return cn(mod.map(m => applyMods(element, m)));
  }
  if (isRecord(mod)) {
    return cn(
      Object.entries(mod).map(([mod, v]) => v && applyMods(element, mod)),
    );
  }
  const v = cn(mod);
  return v && `${element}--${v}`;
}

/**
 * Computes final classname for the specified element.
 * @param element - element name.
 * @param mods - mod to apply.
 */
function computeClassnames(element: string, ...mods: unknown[]): string {
  return cn(element, applyMods(element, mods));
}

/**
 * @returns A tuple, containing two functions. The first one generates classnames list for the
 * block, the second one generates classnames for its elements.
 * @param block - BEM block name.
 */

/* @__NO_SIDE_EFFECTS__ */
export function bem(block: string) {
  return {
    b: (...mods: unknown[]): string => computeClassnames(block, mods),
    e: (elem: string, ...mods: unknown[]): string => computeClassnames(`${block}__${elem}`, mods),
  };
}
