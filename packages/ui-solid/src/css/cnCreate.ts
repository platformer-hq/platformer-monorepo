import { type Accessor, createMemo } from 'solid-js';

import type {
  Classes,
  ClassName,
  ClassNameHook,
  ClassNamesMap,
  WithOptionalClasses,
} from '@/css/types.js';
import { classNames } from '@/css/classnames.js';

/**
 * Extracts classes from a component properties.
 */
type ClassesFromProps<Props extends WithOptionalClasses<any, any>> =
  Exclude<Props['classes'], undefined>;

/**
 * Extracts classes keys from a component properties.
 */
type ElementKeyFromProps<Props extends WithOptionalClasses<any, any>> =
  Extract<keyof ClassesFromProps<Props>, string>;

function createClasses<ElementKey extends string, HookValue>(
  value: HookValue,
  ...classes: (
    | undefined
    | Partial<Classes<ElementKey, HookValue>>
    | Accessor<Partial<Classes<ElementKey, HookValue>> | undefined>
    )[]
): Accessor<ClassNamesMap<ElementKey>> {
  const forEachClasses = (fn: (item: Partial<Classes<ElementKey, HookValue>>) => void) => {
    classes.forEach(item => {
      const v = item
        ? typeof item === 'function' ? item() : item
        : false;
      v && fn(v);
    }, []);
  };

  // Merge all classes, so we will know all element keys.
  const $keys = createMemo<ElementKey[]>(() => {
    const items: ElementKey[] = [];
    forEachClasses(classes => {
      items.push(...Object.keys(classes) as ElementKey[]);
    });
    return [...new Set(items).values()];
  });

  /**
   * Computes a class names list.
   * @param classNameOrHook - class name or hook.
   */
  const compute = (classNameOrHook: ClassName | ClassNameHook<HookValue>): ClassName | ClassName[] => {
    return typeof classNameOrHook === 'function' ? classNameOrHook(value) : classNameOrHook;
  };

  return createMemo(() => {
    return $keys().reduce<ClassNamesMap<ElementKey>>((acc, key) => {
      Object.defineProperty(acc, key, {
        enumerable: true,
        get: createMemo(() => {
          const items: (ClassName | ClassName[])[] = [];
          forEachClasses(item => {
            const value = item[key];
            if (Array.isArray(value)) {
              items.push(...value.map(compute));
            } else {
              items.push(compute(value));
            }
          });
          return classNames(items) || undefined;
        }),
      });
      return acc;
    }, {});
  });
}

/**
 * @returns An accessor returning a map, containing all element keys specified by the
 * `classes` argument. The values are computed elements' class names.
 * @param props - value passed to the classes' hooks.
 * @param classes - list of classes to merge.
 */
export function cnCreate<Props extends WithOptionalClasses<any, any>>(
  props: Props | Accessor<Props>,
  ...classes: (
    | undefined
    | Props['classes']
    | Accessor<Props['classes']>
    )[]
): Accessor<ClassNamesMap<ElementKeyFromProps<Props>>> {
  // TODO: Check as any
  return createClasses(
    props,
    () => (typeof props === 'function' ? props() : props).classes,
    ...classes as any,
  );
}